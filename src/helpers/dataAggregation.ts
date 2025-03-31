import { ITypeParsedOmpData } from "@/types/data";



const aggregateNumericValues = (aggregatedRow: ITypeParsedOmpData, row: ITypeParsedOmpData) => {
  aggregatedRow.impressions = (aggregatedRow.impressions || 0) + (row.impressions || 0);
  aggregatedRow.clicks = (aggregatedRow.clicks || 0) + (row.clicks || 0);
  aggregatedRow.cost_micros = (aggregatedRow.cost_micros || 0) + (row.cost_micros || 0);
  aggregatedRow.sessions = (aggregatedRow.sessions || 0) + (row.sessions || 0);
  aggregatedRow.leads = (aggregatedRow.leads || 0) + (row.leads || 0);
  aggregatedRow.revenue = (aggregatedRow.revenue || 0) + (row.revenue || 0);
};

export const aggregateByDate = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> => {
  const aggregatedData = new Map<string, ITypeParsedOmpData>();

  data.forEach((row) => {
    const dateStr = row.date ? new Date(row.date).toISOString().split("T")[0] : null;
    if (!dateStr) return;

    if (!aggregatedData.has(dateStr)) {
      aggregatedData.set(dateStr, {
        date: dateStr,
        campaign_name: null,
        campaign_id: null,
        ad_group_name: null,
        ad_group_id: null,
        impressions: 0,
        clicks: 0,
        cost_micros: 0,
        sessions: 0,
        leads: 0,
        revenue: 0,
      });
    }

    const aggregatedRow = aggregatedData.get(dateStr)!;
    aggregateNumericValues(aggregatedRow, row);
  });
  return aggregatedData;
};

export const aggregateByCampaign = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> => {
  const aggregatedData = new Map<string, ITypeParsedOmpData>();

  data.forEach((row) => {
    const campaignName = row.campaign_name;
    if (!campaignName) return;

    if (!aggregatedData.has(campaignName)) {
      aggregatedData.set(campaignName, {
        date: null,
        campaign_name: campaignName,
        campaign_id: row.campaign_id,
        ad_group_name: null,
        ad_group_id: null,
        impressions: 0,
        clicks: 0,
        cost_micros: 0,
        sessions: 0,
        leads: 0,
        revenue: 0,
      });
    }

    const aggregatedRow = aggregatedData.get(campaignName)!;
    aggregateNumericValues(aggregatedRow, row);
  });
  return aggregatedData;
};

export const aggregateByAdGroupId = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> => {
  const aggregatedData = new Map<string, ITypeParsedOmpData>();

  data.forEach((row) => {
    const adGroupId = row.ad_group_id;
    if (adGroupId === null || adGroupId === undefined) return;

    const key = adGroupId.toString();
    if (!aggregatedData.has(key)) {
      aggregatedData.set(key, {
        date: null,
        campaign_name: row.campaign_name,
        campaign_id: row.campaign_id,
        ad_group_name: row.ad_group_name,
        ad_group_id: row.ad_group_id,
        impressions: 0,
        clicks: 0,
        cost_micros: 0,
        sessions: 0,
        leads: 0,
        revenue: 0,
      });
    }
    const aggregatedRow = aggregatedData.get(key)!;

    aggregateNumericValues(aggregatedRow, row);
  });

  return aggregatedData;
};
