import { ITypeParsedOmpData, Metric } from "@/types/data";
import { aggregateByDate, aggregateByCampaign, aggregateByAdGroupId } from "@/helpers/dataAggregation";
import { METRICS } from "@/helpers/constants";

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
  return processDateDimensionWithField(
    data,
    aggregatedByDate,
    "campaign_name",
    (row, value) => row.campaign_name === value,
    createCampaignRow,
    sortByDateAndCampaign
  );
};

export const processDateDimensionWithAdGroup = (
  data: ITypeParsedOmpData[],
  aggregatedByDate: Map<string, ITypeParsedOmpData>
): ITypeParsedOmpData[] => {
  return processDateDimensionWithField(
    data,
    aggregatedByDate,
    "ad_group_id",
    (row, value) => row.ad_group_id === value,
    createAdGroupRow,
    sortByDateAndAdGroupId
  );
};

export const processAdGroupDimension = (filteredData: ITypeParsedOmpData[]): ITypeParsedOmpData[] => {
  const aggregatedData = aggregateByAdGroupId(filteredData);
  return sortByAdGroupId(Array.from(aggregatedData.values()));
};

// Generic function to process date dimension with another field
function processDateDimensionWithField<T>(
  data: ITypeParsedOmpData[],
  aggregatedByDate: Map<string, ITypeParsedOmpData>,
  fieldName: keyof ITypeParsedOmpData,
  filterFn: (row: ITypeParsedOmpData, value: T) => boolean,
  createRowFn: (
    dateStr: string,
    fieldValue: T,
    rows: ITypeParsedOmpData[],
    allData: ITypeParsedOmpData[]
  ) => ITypeParsedOmpData,
  sortFn: (data: ITypeParsedOmpData[]) => ITypeParsedOmpData[]
): ITypeParsedOmpData[] {
  // Extract unique values for the field
  const uniqueValues = [...new Set(data.map((row) => row[fieldName]))].filter(Boolean) as T[];

  const allCombinations: ITypeParsedOmpData[] = [];

  aggregatedByDate.forEach((_, dateStr) => {
    uniqueValues.forEach((fieldValue) => {
      const filteredRows = data.filter(
        (row) => row.date && new Date(row.date).toISOString().split("T")[0] === dateStr && filterFn(row, fieldValue)
      );

      const combinedRow =
        filteredRows.length > 0
          ? createRowFn(dateStr, fieldValue, filteredRows, data)
          : createRowFn(dateStr, fieldValue, [], data);

      allCombinations.push(combinedRow);
    });
  });

  return sortFn(allCombinations);
}

// Helper functions for creating rows
function createCampaignRow(
  dateStr: string,
  campaignName: string,
  campaignRows: ITypeParsedOmpData[],
  allData: ITypeParsedOmpData[]
): ITypeParsedOmpData {
  if (campaignRows.length === 0) {
    return {
      date: dateStr,
      campaign_name: campaignName,
      campaign_id: allData.find((row) => row.campaign_name === campaignName)?.campaign_id || null,
      ad_group_name: null,
      ad_group_id: null,
      ...initializeMetricFields(),
    };
  }

  return {
    date: dateStr,
    campaign_name: campaignName,
    campaign_id: campaignRows[0].campaign_id,
    ad_group_name: null,
    ad_group_id: null,
    ...aggregateMetricFields(campaignRows),
  };
}

function createAdGroupRow(
  dateStr: string,
  adGroupId: number,
  adGroupRows: ITypeParsedOmpData[],
  allData: ITypeParsedOmpData[]
): ITypeParsedOmpData {
  if (adGroupRows.length === 0) {
    const matchingRow = allData.find((row) => row.ad_group_id === adGroupId);
    return {
      date: dateStr,
      campaign_name: matchingRow?.campaign_name || null,
      campaign_id: matchingRow?.campaign_id || null,
      ad_group_name: matchingRow?.ad_group_name || null,
      ad_group_id: adGroupId,
      ...initializeMetricFields(),
    };
  }

  const firstRow = adGroupRows[0];
  return {
    date: dateStr,
    campaign_name: firstRow.campaign_name,
    campaign_id: firstRow.campaign_id,
    ad_group_name: firstRow.ad_group_name,
    ad_group_id: adGroupId,
    ...aggregateMetricFields(adGroupRows),
  };
}

// Utility functions for metric field operations
function initializeMetricFields(): Record<Metric, number> {
  return {
    impressions: 0,
    clicks: 0,
    cost_micros: 0,
    sessions: 0,
    leads: 0,
    revenue: 0,
  };
}

function aggregateMetricFields(rows: ITypeParsedOmpData[]): Record<Metric, number> {
  const result = initializeMetricFields();

  for (const metricObj of METRICS) {
    const field = metricObj.value;
    result[field] = rows.reduce((sum, row) => sum + (row[field] || 0), 0);
  }

  return result;
}

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
