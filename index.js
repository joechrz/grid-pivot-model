var gpm = require('./.src');
var data = require('./flights-small');
var gridCore = require('grid/src/modules/core');

/** ********************************************** **/
/** GRID 1: Raw Data **/
require('./simple-grid');

/** ********************************************** **/
/** ********************************************** **/
/** GRID 2: Pivot table data **/
var grid = gridCore();
var dirtyClean = grid.makeDirtyClean();
var builderFactory = require('./row-builder');

var aggregates = [
  new gpm.Aggregate(gpm.AggregateType.COUNT, 'distance'),
  new gpm.Aggregate(gpm.AggregateType.SUM, 'distance'),
  new gpm.Aggregate(gpm.AggregateType.MIN, 'distance'),
  new gpm.Aggregate(gpm.AggregateType.MAX, 'distance')
];

var drillOrder = ['date', 'origin', 'destination'];

gpm.create(grid, data, aggregates).then(function (treeContext) {
  var expandableBuilder = builderFactory(grid, function (ctx) {
    console.log(ctx.viewRow);

    var row = grid.viewPort.toVirtualRow(ctx.viewRow);
    var rowDesc = grid.virtual.row.get(row);
    var datum = rowDesc.datum;

    rowDesc.treeNode.drill(datum.key, drillOrder.shift(), aggregates).then(function (resultNode) {
      rowDesc.children = treeContext.createRowDescriptors(resultNode);
      rowDesc.expanded = true;
    }).catch(function (err) {
      console.error(err);
      throw err;
    });
  });

  var colDescriptors = treeContext.initColumnDescriptors(expandableBuilder);
  grid.colModel.add(colDescriptors);

  var rowDescriptors = treeContext.initRowDescriptors(treeContext);
  grid.rowModel.add(rowDescriptors);

  grid.dataModel = {
    get: function (row, col) {
      return {
        value: treeContext.dataFor(row, col),
        formatted: treeContext.dataFor(row, col)
      };
    },

    getHeader: function (row, col) {
      if (row === 0 && col === 0) {
        return {
          value: '-',
          formatted: '-'
        };
      }

      if (row === 0) {
        return {
          value: treeContext.columnNameFor(col),
          formatted: treeContext.columnNameFor(col)
        };
      }

      if (col === 0) {
        var rowDesc = grid.virtual.row.get(row);

        if (!rowDesc.datum) {
          return {
            value: '??',
            formatted: '??'
          };
        }

        return {
          value: rowDesc.datum.key,
          formatted: rowDesc.datum.key
        };
      }
    },

    isDirty: dirtyClean.isDirty
  };

  var gridContainer = document.getElementById('pivot-grid');
  grid.build(gridContainer);
}).catch(function(msg) {
  console.error(msg);
  throw msg;
});
