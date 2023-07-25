export const raSeparator = '--'

export const toRaId = (id1: string, id2: string): string => `${id1}${raSeparator}${id2}`

export const toApiIds = (raId: string, property1: string, property2: string): { [key: string]: string } => {
  const ids = raId.split(raSeparator)
  const obj: { [key: string]: string } = {}
  obj[property1] = ids[0]
  obj[property2] = ids[1]
  return obj
}
