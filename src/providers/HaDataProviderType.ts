export type HaDataProviderType = {
  getList: (
    page: number,
    perPage: number,
    filter: any,
    meta?: any
  ) => Promise<Array<any>>;
  getOne: (id: string, meta?: any) => Promise<any>;
  saveOrUpdate: (resources: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
};
