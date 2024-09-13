export type HaListResponseType = {
  data: Array<any>;
  metadata?: Record<string, any>;
};
export type HaDataProviderType = {
  getList: (
    page: number,
    perPage: number,
    filter: any,
    meta?: any
  ) => Promise<HaListResponseType>;
  getOne: (id: string, meta?: any) => Promise<any>;
  saveOrUpdate: (resources: any, meta?: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
};
