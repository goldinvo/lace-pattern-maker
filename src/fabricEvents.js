import {DOT_RADIUS, MIN_SCALE, MAX_SCALE, CELL_SIZE} from './constants.js'

function snapToGrid({x, y}) {
  return {
    x: Math.round(x / CELL_SIZE) * CELL_SIZE, 
    y: Math.round(y / CELL_SIZE) * CELL_SIZE, 
  };
}

export function handleScroll(opt, canvas) {
  var zoom = canvas.getZoom();
  zoom *= .999 ** opt.e.deltaY;
  if (zoom > MAX_SCALE) zoom = MAX_SCALE;
  if (zoom < MIN_SCALE) zoom = MIN_SCALE;
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
        radius: DOT_RADIUS,
        fill: 'black',
        left: gridPoint.x,
        top: gridPoint.y,
        perPixelTargetFind: true,
        hasControls: false,
        hasBorders: false,
      });
      circle.on('selected', (opt) => {
        opt.target.set('fill', 'red');
      })
      circle.on('deselected', (opt) => {
        opt.target.set('fill', 'black');
      })

      canvas.add(circle);
      break;
    case 'select':
      // canvas.selection = true; // should already be true anyway
      break;
  }
}

export function handleMouseMove(opt, canvas, setCurPos) {
  setCurPos(opt.absolutePointer)

  if (canvas.state.isDragging) {
    let vpt = canvas.viewportTransform;
    vpt[4] += opt.e.clientX - canvas.state.lastPosX;
    vpt[5] += opt.e.clientY - canvas.state.lastPosY;
    canvas.requestRenderAll();
    canvas.state.lastPosX = opt.e.clientX;
    canvas.state.lastPosY = opt.e.clientY;
  }
}

export function handleMouseUp(opt, canvas) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.state.isDragging = false;
}

export function handleSelectionCleared(opt, canvas) {

}

export function handleSelectionUpdated(opt, canvas) {

}

export function handleSelectionCreated(opt, canvas) {

}
