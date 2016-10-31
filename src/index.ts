import { TreeContext } from './TreeContext';

import { Aggregate, AggregateType } from './lib/Aggregates';
import { IGrid } from './lib/Grid';

const universe = require('universe');

// initializes the treecontext (the total row) with a list of aggregates
// NOTE: currently assumes columns is measures
export function create(gridInstance: IGrid, data: any[], aggregates: Aggregate[]) {
  return universe(data).then(instance => {
    const aggObj = {};

    aggregates.forEach(aggregate => {
      aggObj[aggregate.aggregateType] = aggregate.overColumn;
    });

    const query = {
      groupBy: function () {
        return '_total';
      },
      select: aggObj
    };

    return instance.query(query).then(instance => {
      return new TreeContext(gridInstance, aggregates, instance);
    });
  });
};

export {
  TreeContext,
  Aggregate,
  AggregateType
};
