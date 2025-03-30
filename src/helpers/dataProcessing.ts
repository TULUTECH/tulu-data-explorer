import { ITypeParsedOmpData } from "@/types/data";
import { aggregateByDate, aggregateByCampaign, aggregateByAdGroupId } from "@/helpers/dataAggregation";

export const processCampaignDimension = (data: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByCampaign(data);
  return sortByCampaignName(Array.from(aggregatedData.values()));
};

export const processDateDimension = (
  data: ITypeParsedOmpData[],
  selectedDimensions: string[]
): ITypeParsedOmpData[] => {
  const aggregatedByDate = aggregateByDate(data);

  if (selectedDimensions.includes("campaign_name")) {
    return processDateDimensionWithCampaign(data, aggregatedByDate);
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
