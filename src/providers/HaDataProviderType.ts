export type HaDataProviderType = {
  getList: (page: number, perPage: number, filter: any) => Promise<Array<any>>
  getOne: (id: string) => Promise<any>
  saveOrUpdate: (resources: Array<any>) => Promise<Array<any>>
}
