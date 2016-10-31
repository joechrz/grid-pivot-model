import { IQueryResult } from './lib/IQueryResult';
import { Aggregate, AggregateType } from './lib/Aggregates';
import { IGrid, IColumnDescriptor, IRowDescriptor } from './lib/Grid';

export class TreeNode {
  private _parent: TreeNode;
  private _dimension: string;
  public context: IQueryResult;

  public get universe() {
    return this.context.universe;
  }

  public get data() {
    return this.context.data;
  }

  constructor(queryResult: IQueryResult, parentNode: TreeNode = null) {
    this.context = queryResult;
    this._parent = parentNode;

    this._dimension = queryResult.original.groupBy || null;
  }

  public buildSelectObject(aggregates: Aggregate[]) {
    const select = {};

    aggregates.forEach(agg => {
      select[agg.aggregateType] = agg.overColumn;
    });

    return select;
  }

  public createColumnMap(aggregates: Aggregate[]) {
    const colMap = {};

    aggregates.forEach((agg, index) => {
      colMap[index] = agg.aggregateType.toString().replace('$', '');
    });

    return colMap;
  }

  public drill(intoKey: string, by: string, aggregates: Aggregate[]) {
    const query = {
      groupBy: by,
      select: this.buildSelectObject(aggregates),
      filter: { }
    };

    return this.universe.query(query).then(qres => {
      return new TreeNode(qres, this);
    });
  }
}
