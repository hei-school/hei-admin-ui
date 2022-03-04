export type RaListResponseType = {
  data: Array<any>
  total: number
}

export type RaSingleResponseType = {
  data: any
}

export type RaDataProviderType = {
  getList: (resourceType: string, params: any) => Promise<RaListResponseType>
  getOne: (resourceType: string, params: any) => Promise<RaSingleResponseType>
  create: (resourceType: string, params: any) => Promise<RaSingleResponseType>
  update: (resourceType: string, params: any) => Promise<RaSingleResponseType>
}
