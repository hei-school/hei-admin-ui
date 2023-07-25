export const raSeparator = '--'

//combine two ids into one so that we can split it to get two ids after
export const toRaId = (id1: string, id2: string): string => `${id1}${raSeparator}${id2}`

//split the id and get the two ids
export const toApiIds = (raId: string, property1: string, property2: string): { [key: string]: string } => {
  const ids = raId.split(raSeparator)
  const obj: { [key: string]: string } = {}
  obj[property1] = ids[0]
  obj[property2] = ids[1]
  return obj
}
