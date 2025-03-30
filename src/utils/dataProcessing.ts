import { ITypeParsedOmpData } from "@/types/data";
import { aggregateByDate, aggregateByCampaign, aggregateByAdGroupId } from "@/utils/dataAggregation";

export const processDateDimensionWithCampaign = (
  data: ITypeParsedOmpData[],
  aggregatedByDate: Map<string, ITypeParsedOmpData>
): ITypeParsedOmpData[] => {
  const uniqueCampaigns = [...new Set(data.map((row) => row.campaign_name))].filter(Boolean) as string[];
  const allCombinations: ITypeParsedOmpData[] = [];

  aggregatedByDate.forEach((_, dateStr) => {
    uniqueCampaigns.forEach((campaignName) => {
      const campaignRows = data.filter(
        (row) =>
          row.date && new Date(row.date).toISOString().split("T")[0] === dateStr && row.campaign_name === campaignName
      );

      const combinedRow: ITypeParsedOmpData =
        campaignRows.length > 0
          ? createAggregatedRow(dateStr, campaignName, campaignRows)
          : createEmptyRow(dateStr, campaignName, data);

      allCombinations.push(combinedRow);
    });
  });

  return sortByDateAndCampaign(allCombinations);
};

export const processDateDimension = (
  data: ITypeParsedOmpData[],
  selectedDimensions: string[]
): ITypeParsedOmpData[] => {
  const aggregatedByDate = aggregateByDate(data);

  if (selectedDimensions.includes("ad_group_name")) {
    return processDateDimensionWithAdGroup(data, aggregatedByDate);
  }

  if (selectedDimensions.includes("campaign_name")) {
    return processDateDimensionWithCampaign(data, aggregatedByDate);
  }

  return sortByDate(Array.from(aggregatedByDate.values()));
};

export const processCampaignDimension = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByCampaign(data);
  return sortByCampaignName(Array.from(aggregatedData.values()));
};

export const processAdGroupDimension = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByAdGroupId(data);
  return sortByAdGroupName(Array.from(aggregatedData.values()));
};

export const processDateDimensionWithAdGroup = (
  data: ITypeParsedOmpData[],
  aggregatedByDate: Map<string, ITypeParsedOmpData>
): ITypeParsedOmpData[] => {
  const uniqueAdGroups = [...new Set(data.map((row) => row.ad_group_name))].filter(Boolean) as string[];
  const allCombinations: ITypeParsedOmpData[] = [];

  aggregatedByDate.forEach((_, dateStr) => {
    uniqueAdGroups.forEach((adGroupName) => {
      const adGroupRows = data.filter(
        (row) =>
          row.date && new Date(row.date).toISOString().split("T")[0] === dateStr && row.ad_group_name === adGroupName
      );

      const combinedRow: ITypeParsedOmpData =
        adGroupRows.length > 0
          ? createAggregatedAdGroupRow(dateStr, adGroupName, adGroupRows)
          : createEmptyAdGroupRow(dateStr, adGroupName, data);

      allCombinations.push(combinedRow);
    });
  });

  return sortByDateAndAdGroup(allCombinations);
};

// Helper functions for creating rows
const createAggregatedRow = (
  dateStr: string,
  campaignName: string,
  campaignRows: ITypeParsedOmpData[]
): ITypeParsedOmpData => ({
  date: dateStr,
  campaign_name: campaignName,
  campaign_id: campaignRows[0].campaign_id,
  ad_group_name: null,
  ad_group_id: null,
  impressions: campaignRows.reduce((sum, row) => sum + (row.impressions || 0), 0),
  clicks: campaignRows.reduce((sum, row) => sum + (row.clicks || 0), 0),
  cost_micros: campaignRows.reduce((sum, row) => sum + (row.cost_micros || 0), 0),
  sessions: campaignRows.reduce((sum, row) => sum + (row.sessions || 0), 0),
  leads: campaignRows.reduce((sum, row) => sum + (row.leads || 0), 0),
  revenue: campaignRows.reduce((sum, row) => sum + (row.revenue || 0), 0),
});

const createEmptyRow = (dateStr: string, campaignName: string, data: ITypeParsedOmpData[]): ITypeParsedOmpData => ({
  date: dateStr,
  campaign_name: campaignName,
  campaign_id: data.find((row) => row.campaign_name === campaignName)?.campaign_id || null,
  ad_group_name: null,
  ad_group_id: null,
  impressions: 0,
  clicks: 0,
  cost_micros: 0,
  sessions: 0,
  leads: 0,
  revenue: 0,
});

// Helper functions for creating ad group rows
const createAggregatedAdGroupRow = (
  dateStr: string,
  adGroupName: string,
  adGroupRows: ITypeParsedOmpData[]
): ITypeParsedOmpData => {
  const firstRow = adGroupRows[0];
  return {
    date: dateStr,
    campaign_name: firstRow.campaign_name,
    campaign_id: firstRow.campaign_id,
    ad_group_name: adGroupName,
    ad_group_id: firstRow.ad_group_id,
    impressions: adGroupRows.reduce((sum, row) => sum + (row.impressions || 0), 0),
    clicks: adGroupRows.reduce((sum, row) => sum + (row.clicks || 0), 0),
    cost_micros: adGroupRows.reduce((sum, row) => sum + (row.cost_micros || 0), 0),
    sessions: adGroupRows.reduce((sum, row) => sum + (row.sessions || 0), 0),
    leads: adGroupRows.reduce((sum, row) => sum + (row.leads || 0), 0),
    revenue: adGroupRows.reduce((sum, row) => sum + (row.revenue || 0), 0),
  };
};

const createEmptyAdGroupRow = (
  dateStr: string,
  adGroupName: string,
  data: ITypeParsedOmpData[]
): ITypeParsedOmpData => {
  const matchingAdGroup = data.find((row) => row.ad_group_name === adGroupName);
  if (!matchingAdGroup) {
    throw new Error(`No matching ad group found for ${adGroupName}`);
  }
  return {
    date: dateStr,
    campaign_name: matchingAdGroup.campaign_name,
    campaign_id: matchingAdGroup.campaign_id,
    ad_group_name: adGroupName,
    ad_group_id: matchingAdGroup.ad_group_id,
    impressions: 0,
    clicks: 0,
    cost_micros: 0,
    sessions: 0,
    leads: 0,
    revenue: 0,
  };
};

// Sorting helpers
const sortByDateAndCampaign = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.campaign_name || "").localeCompare(b.campaign_name || "");
  });

const sortByDate = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });

const sortByCampaignName = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => (a.campaign_name || "").localeCompare(b.campaign_name || ""));

const sortByDateAndAdGroup = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.ad_group_name || "").localeCompare(b.ad_group_name || "");
  });

const sortByAdGroupName = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => (a.ad_group_name || "").localeCompare(b.ad_group_name || ""));
