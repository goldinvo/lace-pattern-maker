import * as constants from './constants.js'

export const defaultCircle = {
  originX: 'center',
  originY: 'center',
  
  radius: constants.DOT_RADIUS,
  fill: constants.DRAW_COLOR,
  
  perPixelTargetFind: true,
  hasControls: false,
  hasBorders: false,
}

export const defaultPath = {
  fill: '',
  stroke: constants.DRAW_COLOR,
  strokeWidth: constants.LINE_WIDTH,
  strokeLineCap: "round",
  perPixelTargetFind: true,
  hasControls: false,
  hasBorders: false,
}

export function resetCanvasState(canvas) {
    // Reset selection
    canvas.discardActiveObject().renderAll();

    // Reset line drawing fields
    canvas.remove(canvas.state.p1);
    canvas.remove(canvas.state.p2);
    canvas.remove(canvas.state.p3);
    canvas.state.p1 = canvas.state.p2 = canvas.state.p3 = null;
    canvas.state.curLine = null;
    canvas.state.isBending = false;

    let mode = canvas.state.mode;
    switch (mode) {
        case 'select':
          canvas.defaultCursor = 'default';
          canvas.selection = true;
          canvas.skipTargetFind = false;
          fabric.Object.prototype.selectable = true;
          break;
        case 'pan':
          canvas.defaultCursor = 'grab';
          canvas.selection = false;
          canvas.skipTargetFind = true;
          // fabric.Object.prototype.selectable = false; // N/A if skipTargetFind
          break;
        case 'draw':
          canvas.defaultCursor = 'crosshair';
          canvas.selection = false;
          canvas.skipTargetFind = true;
          // fabric.Object.prototype.selectable = false;
          break;
        case 'delete':
          canvas.defaultCursor = 'crosshair';
          canvas.selection = false;
          canvas.skipTargetFind = false;
          fabric.Object.prototype.selectable = false;
          break;
      }
}