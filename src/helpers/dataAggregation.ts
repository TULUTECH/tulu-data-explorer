import { ITypeParsedOmpData } from "@/types/data";

const sumMetrics = (target: ITypeParsedOmpData, source: ITypeParsedOmpData): void => {
  target.impressions = (target.impressions || 0) + (source.impressions || 0);
  target.clicks = (target.clicks || 0) + (source.clicks || 0);
  target.cost_micros = (target.cost_micros || 0) + (source.cost_micros || 0);
  target.sessions = (target.sessions || 0) + (source.sessions || 0);
  target.leads = (target.leads || 0) + (source.leads || 0);
  target.revenue = (target.revenue || 0) + (source.revenue || 0);
};

const initAggregatedRow = (initialRow: Partial<ITypeParsedOmpData>): ITypeParsedOmpData => ({
  date: initialRow.date ?? null,
  campaign_name: initialRow.campaign_name ?? null,
  campaign_id: initialRow.campaign_id ?? null,
  ad_group_name: initialRow.ad_group_name ?? null,
  ad_group_id: initialRow.ad_group_id ?? null,
  impressions: 0,
  clicks: 0,
  cost_micros: 0,
  sessions: 0,
  leads: 0,
  revenue: 0,
});

const aggregateBy = (
  data: ITypeParsedOmpData[],
  keyExtractor: (row: ITypeParsedOmpData) => string | null,
  initialRowCreator: (row: ITypeParsedOmpData) => ITypeParsedOmpData
): Map<string, ITypeParsedOmpData> => {
  const aggregatedData = new Map<string, ITypeParsedOmpData>();
  data.forEach((row) => {
    const key = keyExtractor(row);
    if (!key) return;
    if (!aggregatedData.has(key)) {
      aggregatedData.set(key, initialRowCreator(row));
    }
    const aggregatedRow = aggregatedData.get(key)!;
    sumMetrics(aggregatedRow, row);
  });
  return aggregatedData;
};
export const aggregateByDate = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> =>
  aggregateBy(
    data,
    (row) => (row.date ? new Date(row.date).toISOString().split("T")[0] : null),
    (row) => initAggregatedRow({ date: row.date ? new Date(row.date).toISOString().split("T")[0] : null })
  );
export const aggregateByCampaign = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> =>
  aggregateBy(
    data,
    (row) => row.campaign_name || null,
    (row) => initAggregatedRow({ campaign_name: row.campaign_name, campaign_id: row.campaign_id })
  );
export const aggregateByAdGroupId = (data: ITypeParsedOmpData[]): Map<string, ITypeParsedOmpData> =>
  aggregateBy(
    data,
    (row) => (row.ad_group_id !== null && row.ad_group_id !== undefined ? row.ad_group_id.toString() : null),
    (row) =>
      initAggregatedRow({
        campaign_name: row.campaign_name,
        campaign_id: row.campaign_id,
        ad_group_name: row.ad_group_name,
        ad_group_id: row.ad_group_id,
      })
  );
