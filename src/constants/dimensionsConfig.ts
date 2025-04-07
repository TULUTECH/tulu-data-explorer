export enum DIMENSION_KEY_ENUM {
  CampaignId = "campaign_id",
  CampaignName = "campaign_name",
  AdGroupId = "ad_group_id",
  AdGroupName = "ad_group_name",
  Date = "date",
}

export interface IDimensionConfig {
  label: string;
  isSelectableForTable: boolean;
}

export const DIMENSION_CONFIG: Record<DIMENSION_KEY_ENUM, IDimensionConfig> = {
  [DIMENSION_KEY_ENUM.Date]: { label: "Date", isSelectableForTable: true },
  [DIMENSION_KEY_ENUM.CampaignId]: {
    label: "Campaign ID",
    isSelectableForTable: false,
  },
  [DIMENSION_KEY_ENUM.CampaignName]: {
    label: "Campaign Name",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.AdGroupId]: {
    label: "Ad-Group ID",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.AdGroupName]: {
    label: "Ad-Group Name",
    isSelectableForTable: false,
  },
};

export const DIMENSION_OBJS = Object.entries(DIMENSION_CONFIG).map(
  ([key, config]) => ({
    value: key as DIMENSION_KEY_ENUM,
    label: config.label,
    isSelectableForTable: config.isSelectableForTable,
  }),
);

export const DIMENSION_LABEL_MAP = Object.keys(DIMENSION_CONFIG).reduce(
  (acc, key) => {
    const typedKey = key as DIMENSION_KEY_ENUM;
    acc[typedKey] = DIMENSION_CONFIG[typedKey].label;
    return acc;
  },
  {} as Record<DIMENSION_KEY_ENUM, string>,
);
