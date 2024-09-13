export type RaListResponseType = {
  data: Array<any>;
  total: number;
  pageInfos?: any;
  metadata: Record<string, any>;
};

export type RaSingleResponseType = {
  data: any;
};

export type RaDataProviderType = {
  getList: (resourceType: string, params: any) => Promise<RaListResponseType>;
  getOne: (resourceType: string, params: any) => Promise<RaSingleResponseType>;
  create: (resourceType: string, params: any) => Promise<RaSingleResponseType>;
  update: (resourceType: string, params: any) => Promise<RaSingleResponseType>;
  delete: (resourceType: string, params: any) => Promise<RaSingleResponseType>;
};