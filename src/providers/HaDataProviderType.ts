export type HaDataProviderType = {
  getList: (page: number, perPage: number, filter: any, meta?: any) => Promise<Array<any>>
  getOne: (id: string) => Promise<any>
  saveOrUpdate: (resources: any) => Promise<any>
}
