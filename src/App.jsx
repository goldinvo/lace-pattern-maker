import React, { useRef, useEffect, useState } from 'react'
import Toolbar from './toolbar/Toolbar.jsx'
import Header from './header/Header.jsx'
import { fabric } from 'fabric'
import * as fabricEvents from './fabricEvents.js'
import * as constants from './constants.js'
import * as utils from './utils.js'

// Change defaults
fabric.Group.prototype.hasControls = false;

function App() {
  const canvasRef = useRef(null);
  const fabRef = useRef(null);

  const [curPos, setCurPos] = useState({x: 0, y: 0});
  const [mode, setMode] = useState('select');
  const [drawMode, setDrawMode] = useState('point');
  const [snap, setSnap] = useState(true);
  const [clipboard, setClipboard] = useState(null);
  const [selectionExists, setSelectionExists] = useState(false);
  const [metaExists, setMetaExists] = useState(false);

  useEffect(() => {
    // Initialize fabric
    fabRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: constants.BACKGROUND_COLOR,
      width: window.outerWidth,
      height: window.outerHeight,
      hoverCursor: 'pointer',
      hasControls: false,
      selectionFullyContained: true, // watch for better selection feature: https://github.com/fabricjs/fabric.js/issues/3773
      preserveObjectStacking: true,
      state: {
        mode: 'select',
        drawMode: 'point',
        snap: true,
      },
    });
    let canvas = fabRef.current;

    
    window.onresize = function() {
      canvas.setWidth(window.outerWidth);
      canvas.setHeight(window.outerHeight);
    };

    // Initialize background grid
    let bg = new utils.infBGrid();
    canvas.state.bg = bg; // just to be able to send to back later
    canvas.add(bg);
    canvas.renderAll();

    // Initialize brush
    let brush = new fabric.PencilBrush(canvas);
    brush.color = constants.DRAW_COLOR;
    brush.width = constants.LINE_WIDTH;
    canvas.freeDrawingBrush = brush;

    // Fabric events handlers
    canvas.on({
      'mouse:wheel': (opt) => fabricEvents.handleScroll(opt, canvas),
      'mouse:down': (opt) => fabricEvents.handleMouseDown(opt, canvas),
      'mouse:move': (opt) => setCurPos(fabricEvents.handleMouseMove(opt, canvas)),
      'mouse:up': (opt) => fabricEvents.handleMouseUp(opt, canvas, setMetaExists),

      'selection:created': (opt) => {
        setSelectionExists(true);
        fabricEvents.handleSelectionCreated(opt, canvas);
      },
      'selection:updated': (opt) => fabricEvents.handleSelectionUpdated(opt, canvas),
      'selection:cleared': (opt) => {
        setSelectionExists(false);
        fabricEvents.handleSelectionCleared(opt, canvas);
      },
      'path:created': (opt) => {opt.path.set(utils.defaultPath)}
    });

    // Cleanup on unmount
    return () => {
      fabRef.current.dispose();
    };
  }, []);

  function handleMode(event, newMode){
    let canvas = fabRef.current;
    if (newMode !== null){
      setMode(newMode);
      canvas.state.mode = newMode;
      utils.resetCanvasState(canvas, setMetaExists);
    }
  };

  function handleDrawMode(event, newDrawMode) {
    let canvas = fabRef.current;
    if (mode==='draw' && newDrawMode !== null){
      setDrawMode(newDrawMode);
      canvas.state.drawMode = newDrawMode;
      utils.resetCanvasState(canvas, setMetaExists);
    }
  }

  function handleSnap(event) {
    setSnap(event.target.checked);
    fabRef.current.state.snap = event.target.checked;
  }

  function handleCopy() {
    let canvas = fabRef.current;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().clone(function(cloned) {
        setClipboard(cloned);
        canvas.state.clipboard = cloned;
      }, [...Object.keys(utils.defaultCircle), ...Object.keys(utils.defaultPath)]);
    }
  }

  function handlePaste() {
    let canvas = fabRef.current;
    if (clipboard && metaExists) {
      let metaPoint = canvas.state.curMetaPoint;
      // clone again, so you can do multiple copies.
      clipboard.clone(function(clonedObj) {
        clonedObj.set({
          left: metaPoint.aCoords.tl.x,
          top: metaPoint.aCoords.tl.y,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function(obj) {
            canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      }, [...Object.keys(utils.defaultCircle), ...Object.keys(utils.defaultPath)]);
    }  
  }

  function handleDelete() {
    let canvas = fabRef.current;
    let activeObject = canvas.getActiveObjects();
    canvas.discardActiveObject();
    canvas.remove(...activeObject);
  }

  // make sure to use absolute coordinates/scaling
  function handlePrint(x, y, width, height, scale) {
    let canvas = fabRef.current;
    canvas.remove(canvas.state.bg);
    canvas.backgroundColor = 'white';
    let tempCanvas = new fabric.StaticCanvas().loadFromJSON(canvas.toJSON());
    canvas.backgroundColor = constants.BACKGROUND_COLOR;
    canvas.add(canvas.state.bg);
    canvas.sendToBack(canvas.state.bg);
    
    tempCanvas.setHeight(height);
    tempCanvas.setWidth(width);
    tempCanvas.absolutePan({x, y});
    let dataURL = tempCanvas.toDataURL({
      multiplier: scale,
    });
    
    let title = "title";
    let windowContent = `
    <!DOCTYPE html>
    <html>
    <head><title>${title}</title></head>
    <body><img src="${dataURL}" onload=window.print()></body>
    </html>
    `;
    let printWin = window.open();
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
  }

  let propagateState = {
    curPos, 
    selectionExists,
    mode, handleMode,
    drawMode, handleDrawMode,
    snap, handleSnap,
    clipboard, handleCopy, handlePaste, metaExists,
    handleDelete,
  }

  return (
    <div>
      <Header {...{handlePrint, }}/>
      <canvas ref={canvasRef}> 
        Could not load canvas. Please update browser or enable JavaScript.
      </canvas>
      <Toolbar {...propagateState}/>
    </div>
  );
};

export default App