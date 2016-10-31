var data = require('./flights-small');
var gridCore = require('grid/src/modules/core');

var grid = gridCore();
var rows = [];

var columns = ['date', 'delay', 'distance', 'origin', 'destination'];
grid.colModel.add(columns.map(function () {
  var colDescriptor = grid.colModel.create();
  colDescriptor.width = 100;
  return colDescriptor;
}));

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
