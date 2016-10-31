export enum AggregateType {
  SUM = <any>'$sum',
  AVG = <any>'$avg',
  MIN = <any>'$min',
  MAX = <any>'$max',
  COUNT = <any>'$count'
}

export class Aggregate {
  constructor(
    public aggregateType: AggregateType,
    public overColumn: string
  ) { }
}

