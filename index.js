var gpm = require('./.src');
var data = require('./flights-small');
var gridCore = require('grid/src/modules/core');

/** ********************************************** **/
/** GRID 1: Raw Data **/
(function() {
  var grid = gridCore();

  var columns = ['date', 'delay', 'distance', 'origin', 'destination'];
  grid.colModel.add(columns.map(function () {
    var colDescriptor = grid.colModel.create();
    colDescriptor.width = 100;
    return colDescriptor;
  }));

  var rows = [];

  var headerRow = grid.rowModel.create();
  headerRow.header = true;
  headerRow.fixed = true;
  headerRow.dataRow = 0;
  rows.push(headerRow);

  var rowDescriptor;
  for (var x = 0, xl = data.length; x < xl; x++) {
    rowDescriptor = grid.rowModel.create();
    rows.push(rowDescriptor);
  }
  grid.rowModel.add(rows);

  var dirtyClean = grid.makeDirtyClean();
  grid.dataModel = {
    get: function (row, col) {
      return {
        value: data[row][columns[col]],
        formatted: data[row][columns[col]]
      };
    },

    getHeader: function (row, col) {
      return {
        value: columns[col],
        formatted: columns[col]
      };
    },

    isDirty: dirtyClean.isDirty
  };

  grid.build(document.getElementById('raw-data-grid-container'));
})();

/** ********************************************** **/
/** ********************************************** **/
/** GRID 2: Pivot table data **/
(function() {
  var grid = gridCore();
  var pivotModel = new gpm.TreeContext();
  var dirtyClean = grid.makeDirtyClean();

  var rows = [];
  var cols = [];

  var headerRow = grid.rowModel.create();
  headerRow.header = true;
  headerRow.fixed = true;
  headerRow.dataRow = 0;
  rows.push(headerRow);

  var headerCol = grid.colModel.create();
  headerCol.header = true;
  headerCol.fixed = true;
  headerCol.dataCol = 0;
  cols.push(headerCol);

  pivotModel.initialize(data).then(function (treeContext) {
    var rowDescriptor;
    var data = treeContext.getData();
    var colMap = {};

    var ixOffset = 0;
    Object.keys(data[0].value).forEach(function (name, index) {
      if (name === 'valueList') {
        ixOffset++;
        return;
      }

      colMap[index - ixOffset] = name;

      var colDescriptor = grid.colModel.create();
      colDescriptor.width = 100;
      cols.push(colDescriptor);
    });

    grid.colModel.add(cols);

    for (var x = 0, xl = data.length; x < xl; x++) {
      rowDescriptor = grid.rowModel.create();
      rows.push(rowDescriptor);
    }
    grid.rowModel.add(rows);

    grid.dataModel = {
      get: function (row, col) {
        return {
          value: data[row].value[colMap[col]],
          formatted: data[row].value[colMap[col]]
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
            value: colMap[col - 1],
            formatted: colMap[col - 1]
          };
        }

        if (col === 0) {
          return {
            value: data[row - 1].key,
            formatted: data[row - 1].key
          };
        }
      },

      isDirty: dirtyClean.isDirty
    };

    grid.build(document.getElementById('pivot-grid'));
  }).catch(function(msg) {
    console.error(msg);
    throw msg;
  });
})();
