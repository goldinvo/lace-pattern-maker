import React, { useRef, useEffect, useState } from 'react'
import Toolbar from './toolbar/Toolbar.jsx'
import Header from './Header.jsx'
import { fabric } from 'fabric'
import * as fabricEvents from './fabricEvents.js'
import * as constants from './constants.js'
import * as utils from './utils.js'

// Change defaults (seems OK to do this way based on maintainer comments)
fabric.Group.prototype.hasControls = false;
fabric.Object.prototype.hasControls = false;
fabric.Object.prototype.hasBorders = false;
fabric.Object.prototype.perPixelTargetFind = true;


function App() {
  const canvasRef = useRef(null);
  const fabRef = useRef(null);

  const [curPos, setCurPos] = useState({x: 0, y: 0});
  const [mode, setMode] = useState('select');
  const [drawMode, setDrawMode] = useState('point');
  const [snap, setSnap] = useState(true);
  const [clipboard, setClipboard] = useState(null);
  const [selectionExists, setSelectionExists] = useState(false);

  useEffect(() => {
    // Initialize fabric
    fabRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: constants.BACKGROUND_COLOR,
      width: window.outerWidth,
      height: window.outerHeight,
      hoverCursor: 'pointer',
      hasControls: false,
      selectionFullyContained: true, // watch for better selection feature: https://github.com/fabricjs/fabric.js/issues/3773
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
    brush.width = constants.PENCIL_WIDTH;
    canvas.freeDrawingBrush = brush;

    // Fabric events handlers
    canvas.on({
      'mouse:wheel': (opt) => fabricEvents.handleScroll(opt, canvas),
      'mouse:down': (opt) => fabricEvents.handleMouseDown(opt, canvas),
      'mouse:move': (opt) => setCurPos(fabricEvents.handleMouseMove(opt, canvas)),
      'mouse:up': (opt) => fabricEvents.handleMouseUp(opt, canvas),

      'selection:created': (opt) => {
        setSelectionExists(true);
        fabricEvents.handleSelectionCreated(opt, canvas);
      },
      'selection:updated': (opt) => fabricEvents.handleSelectionUpdated(opt, canvas),
      'selection:cleared': (opt) => {
        setSelectionExists(false);
        fabricEvents.handleSelectionCleared(opt, canvas);
      },
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
      utils.resetCanvasState(canvas);
    }
  };

  function handleDrawMode(event, newDrawMode) {
    let canvas = fabRef.current;
    if (newDrawMode !== null){
      setDrawMode(newDrawMode);
      canvas.state.drawMode = newDrawMode;
      utils.resetCanvasState(canvas);
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
      });
    }
  }

  function handlePaste() {
    let canvas = fabRef.current;
    if (clipboard) {
      // clone again, so you can do multiple copies.
      clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
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
        // _clipboard.top += 10;
        // _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    }  
  }

  function handleDelete() {
    let canvas = fabRef.current;
    let activeObject = canvas.getActiveObjects();
    canvas.discardActiveObject();
    canvas.remove(...activeObject);
  }

  let propagateState = {
    curPos, 
    selectionExists,
    mode, handleMode,
    drawMode, handleDrawMode,
    snap, handleSnap,
    clipboard, handleCopy, handlePaste,
    handleDelete,
  }

  return (
    <div>
      <Header/>
      <canvas ref={canvasRef}> 
        Could not load canvas. Please update browser or enable JavaScript.
      </canvas>
      <Toolbar {...propagateState}/>
    </div>
  );
};

export default App