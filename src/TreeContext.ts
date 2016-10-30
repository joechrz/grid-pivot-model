import { TreeNode } from './TreeNode';

const universe = require('universe');

export class TreeContext {
  private _root: TreeNode;
  private _universe: any;

  constructor() {
    this._root = new TreeNode();
  }

  public initialize(data: any[]) {
    return universe(data).then(instance => {
      this._universe = instance;

      return this._universe.query({
        groupBy: 'date',
        select: {
          $sum: 'distance',
          $min: 'distance',
          $max: 'distance'
        }
      }).then(qres => {
        this._root.data = qres.data;
        return this;
      });
    });
  }

  public getData() {
    return this._root.data;
  }
}
