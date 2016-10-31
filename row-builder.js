module.exports = function createBuilder(grid, clickHandler) {
  return grid.colModel.createBuilder(function render(ctx) {
    var elem = document.createElement('div');
    elem.innerHTML = '<span class="triangle-wrap"><span class="triangle"></span></span> <span class="label"></span>';

    if (clickHandler) {
      elem.addEventListener('click', clickHandler.bind(this, ctx));
    }

    return elem;
  }, function update(elem, ctx) {
    var rowDescriptor = grid.virtual.row.get(ctx.virtualRow);

    if (rowDescriptor.expanded) {
      elem.classList.add('expanded');
    }
    else {
      elem.classList.remove('expanded');
    }

    if (rowDescriptor.level) {
      elem.classList.add('level-' + rowDescriptor.level);
    }
    else {
      elem.classList.remove('level-0');
      elem.classList.remove('level-1');
      elem.classList.remove('level-2');
      elem.classList.remove('level-3');
    }

    var textLabel = elem.querySelector('.label');
    if (textLabel) {
      textLabel.textContent = ctx.data.formatted;
    }

    return elem;
  });
};
