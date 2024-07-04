import * as constants from './constants.js'
import * as utils from './utils.js'

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
  let commandToSave = null;
  switch(canvas.state.mode) {
    case 'pan':
      canvas.state.isDragging = true;
      canvas.state.lastPosX = opt.e.clientX;
      canvas.state.lastPosY = opt.e.clientY;
      break;
    case 'draw':
      switch(canvas.state.drawMode) {
        case 'point':
          let coords = opt.absolutePointer;
          if (canvas.state.snap) coords = snapToGrid(coords);

          const circle = new fabric.Circle({
            ...utils.defaultCircle,
            left: coords.x,
            top: coords.y,
          });
          canvas.add(circle);
          commandToSave = {
            action: 'add',
            objects: [circle],
          };
          break;
        case 'line':
          if (!canvas.state.p1) {
            let p1Coords = opt.absolutePointer;
            if (canvas.state.snap) p1Coords = snapToGrid(p1Coords);

            let p1 = new fabric.Circle({
              ...utils.defaultCircle,
              fill: constants.META_COLOR,
              left: p1Coords.x,
              top: p1Coords.y,
            });
            canvas.add(p1);
            canvas.state.p1 = p1;

          } else if (!canvas.state.p2){
            let p1Coords = canvas.state.p1.getCenterPoint();
            let p2Coords = opt.absolutePointer;
            if (canvas.state.snap) p2Coords = snapToGrid(p2Coords);
            let p3Coords = {  
              x: (p1Coords.x + p2Coords.x) / 2,
              y: (p1Coords.y + p2Coords.y) / 2,
            }

            let p2 = new fabric.Circle({
              ...utils.defaultCircle,
              fill: constants.META_COLOR,
              left: p2Coords.x,
              top: p2Coords.y,
            });
            canvas.add(p2);
            canvas.state.p2 = p2;

            let p3 = new fabric.Circle({
              ...utils.defaultCircle,
              radius: constants.DOT_RADIUS * 1.75,
              fill: constants.SELECT_COLOR,
              left: p3Coords.x,
              top: p3Coords.y,
            });
            canvas.add(p3);
            canvas.state.p3 = p3;

            let line = new fabric.Path( 
              `M ${p1Coords.x} ${p1Coords.y} Q ${p3Coords.x}, ${p3Coords.y}, ${p2Coords.x}, ${p2Coords.y}`, 
              utils.defaultPath
            );
            canvas.add(line); //canvas.insertAt??
            canvas.state.originalLine = canvas.state.curLine = line;
            canvas.bringToFront(canvas.state.p1);
            canvas.bringToFront(canvas.state.p2);
            canvas.bringToFront(canvas.state.p3);

            commandToSave = {
              action: 'add',
              objects: [line],
              undoCallback: () => utils.resetDrawLineState(canvas),
            }
          } else if ( // replicate behavior of perPixelTargetFind
            canvas.state.p3.containsPoint(opt.pointer)
            && !canvas.isTargetTransparent(canvas.state.p3, opt.pointer.x, opt.pointer.y) 
          ) {
            canvas.state.isBending = true;
            canvas.state.disableUndo = true;
            canvas.state.disableModeSwitch = true;
          } else {
            utils.resetDrawLineState(canvas);
          }
          break;
        default:
          break;
      }
      break;
    case 'delete':
      canvas.state.isDeleting = true;
      canvas.state.disableModeSwitch = true;
      if (opt.target) {
        // TODO: what happens when you have groups?
        canvas.remove(opt.target);
        commandToSave = {
          action: 'remove',
          objects: [opt.target],
        }
      }
    case 'select':
      break;
  }
  canvas.fire('saveState', commandToSave);
}

export function handleMouseMove(opt, canvas) {
  let commandToSave = null;
  if (canvas.state.isDragging) {
    let vpt = canvas.viewportTransform;
    vpt[4] += opt.e.clientX - canvas.state.lastPosX;
    vpt[5] += opt.e.clientY - canvas.state.lastPosY;
    canvas.state.lastPosX = opt.e.clientX;
    canvas.state.lastPosY = opt.e.clientY;
  } else if (canvas.state.isDeleting) {
    if (opt.target) {
      // TODO: improve experience by interpolating delete stroke
      // TODO: what happens when you have groups?
      canvas.remove(opt.target);
      commandToSave = {
        action: 'remove',
        objects: [opt.target],
      }
    }
  } else if (canvas.state.isBending) {
    // update p3 location
    let p3 = canvas.state.p3
    p3.left = opt.absolutePointer.x;
    p3.top = opt.absolutePointer.y;
    p3.setCoords();
    let p1Coords = canvas.state.p1.getCenterPoint();
    let p2Coords = canvas.state.p2.getCenterPoint();
    let p3Coords = opt.absolutePointer;
    // update line
    let newLine = new fabric.Path( 
      `M ${p1Coords.x} ${p1Coords.y} Q ${p3Coords.x}, ${p3Coords.y}, ${p2Coords.x}, ${p2Coords.y}`, 
      utils.defaultPath
    );
    canvas.remove(canvas.state.curLine);
    canvas.add(newLine);
    canvas.state.curLine = newLine;
    
    canvas.bringToFront(canvas.state.p1);
    canvas.bringToFront(canvas.state.p2);
    canvas.bringToFront(canvas.state.p3);

    // undo is currently disabled.
  }
  canvas.state.curPos = opt.absolutePointer;
  canvas.fire('saveState', commandToSave);
}

export function handleMouseUp(opt, canvas) {
  let commandToSave = null;
  
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.state.isDragging = false;
  canvas.state.isDeleting = false;
  canvas.state.disableModeSwitch = false;

  if (canvas.state.isBending) {
    commandToSave = {
      action: 'replace',
      oldObjects: [canvas.state.originalLine],
      newObjects: [canvas.state.curLine],
    }
    utils.resetDrawLineState(canvas);
    canvas.state.disableUndo = false;
    canvas.state.disableModeSwitch = false;
  }

  if (canvas.state.mode === 'select') {
    if (!canvas.state.curMetaPoint) {
      if (opt.isClick && !opt.target) {
        // draw meta point
        let absCoords = opt.absolutePointer;
        if (canvas.state.snap) absCoords = snapToGrid(absCoords);
        let metaPoint = new fabric.Circle({
          ...utils.defaultCircle,
          left: absCoords.x,
          top: absCoords.y,
          radius: constants.DOT_RADIUS * .75,
          fill: constants.META_COLOR,
          selectable: false,
          evented: false,
        });
        canvas.add(metaPoint);
        canvas.bringToFront(metaPoint);
        canvas.state.curMetaPoint = metaPoint;
      } else {
        utils.resetMetaPointState(canvas);
      }
    } else if (opt.isClick && !opt.target) {
      utils.resetMetaPointState(canvas);
    }
  }
  canvas.fire('saveState', commandToSave)
}

export function handleSelectionCreated(opt, canvas) {
  handleSelectionUpdated(opt, canvas);
  canvas.state.selectionExists = true;
  canvas.fire('saveState');
}

export function handleSelectionUpdated(opt, canvas) {
  function setColor(color) {
    return (object) => {
      let target = object.fill ? 'fill' : 'stroke';
      object.set(target, color)
    }
  }
  opt.selected && opt.selected.map(setColor(constants.SELECT_COLOR));
  opt.deselected && opt.deselected.map(setColor(constants.DRAW_COLOR));
}

export function handleSelectionCleared(opt, canvas) {
  handleSelectionUpdated(opt, canvas);
  canvas.state.selectionExists = false;
  canvas.fire('saveState');
}

