export const FinishedBuildings = [
  "ZU",
  "GU",
  "MZ",
  "TR_L",
  "TR_A",
  "TR_B",
  "TR_C",
  "FE",
  "HB",
  "NI",
  "LI",
  "FÖ",
  "E2",
] as string[];

export const AllBuildingAbbreviations: string[] = [
  "ZU",
  "GU",
  "MZ",
  "TR",
  "FE",
  "NI",
  "LI",
  "FÖ",
  "GE",
  "HB",
  "HO",
  "E2",
  "WI",
  "CL",
  "CE",
  "SH",
];

export const LNC_BUILDINGS = ["LI", "FE", "MN"] as const;
export type LncBuildingType = (typeof LNC_BUILDINGS)[number];

export const DATE_OF_LNC_START = "2025-05-10T14:00:00";
