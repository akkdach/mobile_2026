
export interface CatalogByObjectType {
    catalog_profile_has_catalog_id: number
    cat_profile: string
    catalog: string
    code_group: string
    codegrp: Codegrp[]
  }
  
  export interface Codegrp {
    catalog_code_group_has_code_id: number
    catalog: string
    code_group: string
    code: string
    short_text: string
  }