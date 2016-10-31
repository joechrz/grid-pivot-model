export interface IDescriptor {
  hidden: boolean,
  fixed: boolean,
  header: boolean,
  isBuiltActionable: boolean,
  builder: any
}

export interface IRowDescriptor extends IDescriptor {
  height: number;
}

export interface IColumnDescriptor extends IDescriptor {
  width: number;
}

export interface IColModel {
  create(builder?: null): IColumnDescriptor;
}

export interface IRowModel {
  create(builder?: null): IRowDescriptor;
}

export interface IGrid {
  colModel: IColModel;
  rowModel: IRowModel;

  data: {
    row: { get(index: number): IRowDescriptor },
    col: { get(index: number): IColumnDescriptor }
  },

  virtual: {
    row: { get(index: number): IRowDescriptor },
    col: { get(index: number): IColumnDescriptor }
  },

  build(element: any);
}
