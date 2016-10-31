export interface IQueryObject {
  select: Object,
  groupBy: string,
  filter: Object
}

export interface IQueryResult {
  change: Function,
  changeMap: Function,
  clear: Function,
  column: {
    array: boolean,
    filterCount: number,
    key: string,
    promise: Promise<any>,
    queries: any[],
    type: string,
    values: any[]
  }
  data: any[],
  dimension: any,
  group: Object,
  hash: string,
  lock: Function,
  locked: boolean,
  original: IQueryObject,
  parent: {
    hash: string,
    original: IQueryObject
  }
  post: Function,
  postAggregations: any[],
  reducer: Function,
  sortByKey: Function,
  squash: Function,
  universe: any,
  unlock: Function
}
