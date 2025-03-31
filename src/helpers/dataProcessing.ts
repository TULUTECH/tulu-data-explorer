import { ITypeParsedOmpData } from "@/types/data";
import { aggregateByDate, aggregateByCampaign, aggregateByAdGroupId } from "@/helpers/dataAggregation";

export const processCampaignDimension = (filteredData: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByCampaign(filteredData);
  return sortByCampaignName(Array.from(aggregatedData.values()));
};

export const processDateDimension = (
  filteredData: ITypeParsedOmpData[],
  selectedDimensions: string[]
): ITypeParsedOmpData[] => {
  const aggregatedByDate = aggregateByDate(filteredData);

  if (selectedDimensions.includes("ad_group_id")) {
    return processDateDimensionWithAdGroup(filteredData, aggregatedByDate);
  }

  if (selectedDimensions.includes("campaign_name")) {
    return processDateDimensionWithCampaign(filteredData, aggregatedByDate);
  }
  return sortByDate(Array.from(aggregatedByDate.values()));
};
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
export const processDateDimensionWithAdGroup = (
  data: ITypeParsedOmpData[],
  aggregatedByDate: Map<string, ITypeParsedOmpData>
): ITypeParsedOmpData[] => {
  const uniqueAdGroupIds = [...new Set(data.map((row) => row.ad_group_id))].filter(Boolean) as number[];
  const allCombinations: ITypeParsedOmpData[] = [];

  aggregatedByDate.forEach((_, dateStr) => {
    uniqueAdGroupIds.forEach((adGroupId) => {
      const adGroupRows = data.filter(
        (row) => row.date && new Date(row.date).toISOString().split("T")[0] === dateStr && row.ad_group_id === adGroupId
      );

      const combinedRow: ITypeParsedOmpData =
        adGroupRows.length > 0
          ? createAggregatedAdGroupRow(dateStr, adGroupId, adGroupRows)
          : createEmptyAdGroupRow(dateStr, adGroupId, data);

      allCombinations.push(combinedRow);
    });
  });

  return sortByDateAndAdGroupId(allCombinations);
};
export const processAdGroupDimension = (filteredData: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByAdGroupId(filteredData);
  return sortByAdGroupId(Array.from(aggregatedData.values()));
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
const createAggregatedAdGroupRow = (
  dateStr: string,
  adGroupId: number,
  adGroupRows: ITypeParsedOmpData[]
): ITypeParsedOmpData => {
  const firstRow = adGroupRows[0];
  return {
    date: dateStr,
    campaign_name: firstRow.campaign_name,
    campaign_id: firstRow.campaign_id,
    ad_group_name: firstRow.ad_group_name,
    ad_group_id: adGroupId,
    impressions: adGroupRows.reduce((sum, row) => sum + (row.impressions || 0), 0),
    clicks: adGroupRows.reduce((sum, row) => sum + (row.clicks || 0), 0),
    cost_micros: adGroupRows.reduce((sum, row) => sum + (row.cost_micros || 0), 0),
    sessions: adGroupRows.reduce((sum, row) => sum + (row.sessions || 0), 0),
    leads: adGroupRows.reduce((sum, row) => sum + (row.leads || 0), 0),
    revenue: adGroupRows.reduce((sum, row) => sum + (row.revenue || 0), 0),
  };
};
const createEmptyAdGroupRow = (dateStr: string, adGroupId: number, data: ITypeParsedOmpData[]): ITypeParsedOmpData => {
  const matchingRow = data.find((row) => row.ad_group_id === adGroupId);
  return {
    date: dateStr,
    campaign_name: matchingRow?.campaign_name || null,
    campaign_id: matchingRow?.campaign_id || null,
    ad_group_name: matchingRow?.ad_group_name || null,
    ad_group_id: adGroupId,
    impressions: 0,
    clicks: 0,
    cost_micros: 0,
    sessions: 0,
    leads: 0,
    revenue: 0,
  };
};
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

// Sorting helpers
const sortByDateAndCampaign = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.campaign_name || "").localeCompare(b.campaign_name || "");
  });

const sortByDateAndAdGroupId = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.ad_group_id || 0) - (b.ad_group_id || 0);
  });
const sortByDate = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });

const sortByCampaignName = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => (a.campaign_name || "").localeCompare(b.campaign_name || ""));

const sortByAdGroupId = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] =>
  data.sort((a, b) => (a.ad_group_id || 0) - (b.ad_group_id || 0));
