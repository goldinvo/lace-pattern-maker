import * as constants from './constants.js'

function snapToGrid({x, y}) {
  return {
    x: Math.round(x / constants.CELL_SIZE) * constants.CELL_SIZE, 
    y: Math.round(y / constants.CELL_SIZE) * constants.CELL_SIZE, 
  };
}

export function handleScroll(opt, canvas) {
  var zoom = canvas.getZoom();
  zoom *= .999 ** opt.e.deltaY;
  if (zoom > constants.MAX_SCALE) zoom = constants.MAX_SCALE;
  if (zoom < constants.MIN_SCALE) zoom = constants.MIN_SCALE;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
}

export function handleMouseDown(opt, canvas) {
  switch(canvas.state.mode) {
    case 'pan':
      canvas.state.isDragging = true;
      canvas.state.lastPosX = opt.e.clientX;
      canvas.state.lastPosY = opt.e.clientY;
      break;
    case 'draw':
      let gridPoint = opt.absolutePointer;
      if (canvas.state.snap) gridPoint = snapToGrid(gridPoint);

      const circle = new fabric.Circle({
        originX: 'center',
        originY: 'center',
        radius: constants.DOT_RADIUS,
        fill: constants.DRAW_COLOR,
        left: gridPoint.x,
        top: gridPoint.y,
        perPixelTargetFind: true,
        hasControls: false,
        hasBorders: false,
      });
      
      canvas.add(circle);
      break;
    case 'select':
      // canvas.selection = true; // should already be true anyway
      break;
  }
}

export function handleMouseMove(opt, canvas) {
  if (canvas.state.isDragging) {
    let vpt = canvas.viewportTransform;
    vpt[4] += opt.e.clientX - canvas.state.lastPosX;
    vpt[5] += opt.e.clientY - canvas.state.lastPosY;
    canvas.requestRenderAll();
    canvas.state.lastPosX = opt.e.clientX;
    canvas.state.lastPosY = opt.e.clientY;
  }

  return opt.absolutePointer;
}

export function handleMouseUp(opt, canvas) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.state.isDragging = false;
}

export function handleSelectionCreated(opt, canvas) {
  opt.selected.map(object => object.set('fill', 'red'));
}

export function handleSelectionUpdated(opt, canvas) {
  opt.selected.map(object => object.set('fill', 'red'));
  opt.deselected.map(object => object.set('fill', 'black'));
}

export function handleSelectionCleared(opt, canvas) {
  opt.deselected.map(object => object.set('fill', 'black'));
}

