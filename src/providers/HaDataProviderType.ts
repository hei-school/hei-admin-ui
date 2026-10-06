// Filtres et métadonnées par défaut d'un provider qui ne les précise pas.
export type HaFilter = Record<string, unknown>;
export type HaMeta = Record<string, unknown>;

// Second argument que dataProvider transmet à saveOrUpdate :
// `{isUpdate: true, meta}` pour update, les CreateParams `{data, meta}` pour create.
export type HaSaveParams<Meta = HaMeta> = {
  isUpdate?: boolean;
  data?: unknown;
  meta?: Meta;
};

export type HaListResponseType<Resource> = {
  data: Resource[];
  metadata?: Record<string, unknown>;
};

/**
 * Contrat d'un provider de ressource.
 *
 * - `Resource` : ce que la ressource renvoie (liste, détail, suppression) ;
 * - `Filter` / `Meta` : filtres et métadonnées de requête lus par le provider ;
 * - `Payload` : ce que reçoit saveOrUpdate, un tableau dans le cas général ;
 * - `SaveParams` : son second argument ;
 * - `Saved` : ce que renvoie saveOrUpdate.
 *
 * Les méthodes sont déclarées en signatures de méthode : leurs paramètres
 * restent bivariants, ce qui permet à dataProvider de manipuler tous les
 * providers sous le type commun `UntypedHaDataProvider`.
 */
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

// Type commun de tous les providers, utilisé par dataProvider qui les agrège.
export type UntypedHaDataProvider = HaDataProviderType<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>;
