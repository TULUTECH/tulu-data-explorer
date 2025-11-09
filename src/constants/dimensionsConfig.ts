export enum DIMENSION_KEY_ENUM {
  CampaignId = "tulu_campaign_id",
  CampaignName = "tulu_campaign_name",
  AdGroupId = "tulu_adgroup_id",
  AdGroupName = "tulu_adgroup_name",
  Group = "tulu_group",
  Medium = "tulu_medium",
  Source = "tulu_source",
  CampaignStatus = "tulu_campaign_status",
  AdGroupStatus = "tulu_adgroup_status",
  Geo = "tulu_geo",
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
    isSelectableForTable: true,
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
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.Group]: {
    label: "Group",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.Medium]: {
    label: "Medium",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.Source]: {
    label: "Source",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.CampaignStatus]: {
    label: "Campaign Status",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.AdGroupStatus]: {
    label: "Ad-Group Status",
    isSelectableForTable: true,
  },
  [DIMENSION_KEY_ENUM.Geo]: {
    label: "Geo",
    isSelectableForTable: true,
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
