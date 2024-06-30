import * as constants from './constants.js'
import {fabric} from 'fabric'

export const defaultCircle = {
  originX: 'center',
  originY: 'center',
  
  radius: constants.DOT_RADIUS,
  fill: constants.DRAW_COLOR,

  hasControls: false,
  hasBorders: false,
  perPixelTargetFind: true,
}

export const defaultPath = {
  fill: '',
  stroke: constants.DRAW_COLOR,
  strokeWidth: constants.LINE_WIDTH,
  strokeLineCap: 'round',

  hasControls: false,
  hasBorders: false,
  perPixelTargetFind: true,
}

export function userToAbsolute(coords) {
  return {x: coords.x * constants.CELL_SIZE, y: coords.y * constants.CELL_SIZE};
}

export function absoluteToUser(coords) {
  return {x: coords.x / constants.CELL_SIZE, y: coords.y / constants.CELL_SIZE};
}

export function resetMetaPointState(canvas, setMetaExists) {
  canvas.remove(canvas.state.curMetaPoint);
  canvas.state.curMetaPoint = null;
  setMetaExists(false);
}

export function resetDrawLineState(canvas) {
  canvas.remove(canvas.state.p1);
  canvas.remove(canvas.state.p2);
  canvas.remove(canvas.state.p3);
  canvas.state.p1 = canvas.state.p2 = canvas.state.p3 = null;
  canvas.state.curLine = null;
  canvas.state.isBending = false;
}

// Remember to set React state as well, if it applies
// Call on all mode changes, including draw mode!!
// curPos not updating is expected behavior
// what about existSelection?
export function resetCanvasState(canvas, setMetaExists) {
    // Reset selection
    canvas.discardActiveObject().renderAll();

  
    resetDrawLineState(canvas);
    resetMetaPointState(canvas, setMetaExists);

    let mode = canvas.state.mode;
    switch (mode) {
        case 'select':
          canvas.defaultCursor = 'default';
          canvas.selection = true;
          canvas.skipTargetFind = false;
          fabric.Object.prototype.selectable = true;
          canvas.isDrawingMode = false;
          break;
        case 'draw':
            canvas.defaultCursor = 'crosshair';
            canvas.selection = false;
            canvas.skipTargetFind = true;
            // fabric.Object.prototype.selectable = false;
            canvas.isDrawingMode = canvas.state.drawMode==='freehand';
            break;
        case 'pan':
          canvas.defaultCursor = 'grab';
          canvas.selection = false;
          canvas.skipTargetFind = true;
          // fabric.Object.prototype.selectable = false; // N/A if skipTargetFind
          canvas.isDrawingMode = false;
          break;
        case 'delete':
          canvas.defaultCursor = 'crosshair';
          canvas.selection = false;
          canvas.skipTargetFind = false;
          fabric.Object.prototype.selectable = false;
          canvas.isDrawingMode = false;
          break;
      }
}

// Grid https://stackoverflow.com/questions/68604136/fabric-js-canvas-infinite-background-grid-like-miro
export const infBGrid = fabric.util.createClass(fabric.Object, { 
  type: 'infBGrid',
  
  initialize: function () {
  },
  
  render: function (ctx) {
      let canvas = this.canvas;
      let zoom = canvas.getZoom();
      let offX = canvas.viewportTransform[4];
      let offY = canvas.viewportTransform[5];

      ctx.save();
      ctx.strokeStyle = constants.GRID_COLOR;
      ctx.lineWidth = 1;

      let gridSize = constants.CELL_SIZE * zoom;

      const numCellsX = Math.ceil(canvas.width / gridSize);
      const numCellsY = Math.ceil(canvas.height / gridSize);

      let gridOffsetX = offX % gridSize;
      let gridOffsetY = offY % gridSize;
      ctx.beginPath();
      // draw vertical lines
      for (let i = 0; i <= numCellsX; i++) {
        let x = gridOffsetX + i * gridSize;
        ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
        ctx.lineTo((x - offX) / zoom, (canvas.height - offY) / zoom);
      }
    
      // draw horizontal lines
      for (let i = 0; i <= numCellsY; i++) {
        let y = gridOffsetY + i * gridSize;
        ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
        ctx.lineTo((canvas.width - offX) / zoom, (y - offY) / zoom);
      }
    
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
  }
});