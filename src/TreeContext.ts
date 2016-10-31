const universe = require('universe');

import { TreeNode } from './TreeNode';
import { IGrid, IColumnDescriptor, IRowDescriptor } from './lib/Grid';
import { Aggregate, AggregateType } from './lib/Aggregates';
import { IQueryResult } from './lib/IQueryResult';

export class TreeContext extends TreeNode {
  public grid: IGrid;
  private _colMap: { [key: number]: string } = {};

  constructor(gridInstance: IGrid, aggregates: Aggregate[], queryResult: IQueryResult) {
    super(queryResult, null);
    this.grid = gridInstance;

    this._colMap = this.createColumnMap(aggregates);
  }

  public columnNameFor(col: number) {
    return this._colMap[col - 1];
  }

  public dataFor(row: number, col: number) {
    const rowDesc = this.grid.data.row.get(row);

    if (!rowDesc['datum']) {
      return;
    }

    return rowDesc['datum'].value[this._colMap[col]];
  }

  public createRowDescriptors(forData: any[], builder): IRowDescriptor[] {
    const descriptors = [];

    forData.forEach(datum => {
      const desc = this.grid.rowModel.create();
      desc['datum'] = datum;
      descriptors.push(desc);
    });

    return descriptors;
  }

  public initRowDescriptors(forData: any[], builder): IRowDescriptor[] {
    const fixedHeader = this.grid.rowModel.create(builder);
    fixedHeader.fixed = true;
    fixedHeader.header = true;

    return [fixedHeader].concat(this.createRowDescriptors(forData, builder));
  }

  public initColumnDescriptors(builder): IColumnDescriptor[] {
    const fixedHeader = this.grid.colModel.create(builder);
    fixedHeader.fixed = true;
    fixedHeader.header = true;

    return [fixedHeader].concat(this.createColumnDescriptors(builder));
  }

  public createColumnDescriptors(builder): IColumnDescriptor[] {
    const columns = this.context.original.select;
    const descriptors = [];

    Object.keys(columns).forEach(col => {
      const colDescriptor = this.grid.colModel.create();
      descriptors.push(colDescriptor);
    });

    return descriptors;
  }

}
