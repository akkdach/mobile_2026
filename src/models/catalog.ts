export interface ICataLog {
  CATALOG_PROFILE_HAS_CATALOG_ID: number;
  CAT_PROFILE: string;
  CATALOG: string;
  CODE_GROUP: string;
  CODEGRP: ICodeGRP[];
}

export interface ICodeGRP {
  CATALOG_CODE_GROUP_HAS_CODE_ID: number;
  CATALOG: string;
  CODE_GROUP: string;
  CODE: string;
  SHORT_TEXT: string;
}