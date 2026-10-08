export type HaFilter = Record<string, unknown>;
export type HaMeta = Record<string, unknown>;

export type HaSaveParams<Meta = HaMeta> = {
  isUpdate?: boolean;
  data?: unknown;
  meta?: Meta;
};

export type HaListResponseType<Resource> = {
  data: Resource[];
  metadata?: Record<string, unknown>;
};

export interface HaDataProviderType<
  Resource,
  Filter = HaFilter,
  Meta = HaMeta,
  Payload = Resource[],
  SaveParams = HaSaveParams<Meta>,
  Saved = Resource[],
> {
  getList(
    page: number,
    perPage: number,
    filter: Filter,
    meta?: Meta
  ): Promise<HaListResponseType<Resource>>;
  getOne(id: string, meta?: Meta): Promise<Resource>;
  saveOrUpdate(resources: Payload, params?: SaveParams): Promise<Saved>;
  delete(id: string): Promise<Resource>;
}

export const notImplemented = (): never => {
  throw new Error("Not implemented");
};

export type UntypedHaDataProvider = HaDataProviderType<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>;
