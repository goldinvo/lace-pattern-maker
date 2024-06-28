import React, { useRef, useEffect, useState } from 'react'
import Toolbar from './toolbar/Toolbar.jsx'
import Header from './Header.jsx'
import { fabric } from 'fabric'

fabric.Group.prototype.hasControls = false  // https://github.com/fabricjs/fabric.js/issues/1166


const GRID_COLOR = '#d0d0d0';
const CELL_SIZE = 30;

const DOT_RADIUS = 5;

const MAX_SCALE = 3;
const MIN_SCALE = 0.3;

function snapToGrid({x, y}) {
  return {
    x: Math.round(x / CELL_SIZE) * CELL_SIZE, 
    y: Math.round(y / CELL_SIZE) * CELL_SIZE, 
  };
}

function App() {
  const canvasRef = useRef(null);
  const fabRef = useRef(null);

  const [curPos, setCurPos] = useState({x: 0, y: 0});
  const [mode, setMode] = useState('select');
  const [snap, setSnap] = useState(true);

  useEffect(() => {
    // Initialize fabric
    fabRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffe9",
      width: window.outerWidth,
      height: window.outerHeight,
      hoverCursor: 'pointer',
      hasControls: false,
      state: {
        snap: true,
      },
    });
    let canvas = fabRef.current;

    
    window.onresize = function() {
      canvas.setWidth(window.outerWidth);
      canvas.setHeight(window.outerHeight);
    };

    // Initialize grid https://stackoverflow.com/questions/68604136/fabric-js-canvas-infinite-background-grid-like-miro
    var infBGrid = fabric.util.createClass(fabric.Object, { 
      type: 'infBGrid',
      
      initialize: function () {

      },
      
      render: function (ctx) {
          let canvas = fabRef.current;
          let zoom = canvas.getZoom();
          let offX = canvas.viewportTransform[4];
          let offY = canvas.viewportTransform[5];
  
          ctx.save();
          ctx.strokeStyle = GRID_COLOR;
          ctx.lineWidth = 1;
  
          let gridSize = CELL_SIZE * zoom;
  
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
  
    let bg = new infBGrid();
    canvas.add(bg);
    canvas.renderAll();

    // Fabric events handlers
    canvas.on({
      'mouse:wheel': handleScroll,
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': handleMouseUp,
      // 'selection:updated': () => {

      // }
    });

    // Cleanup on unmount
    return () => {
      fabRef.current.dispose();
    };
  }, []);

  function handleScroll(opt) {
    var zoom = fabRef.current.getZoom();
    zoom *= .999 ** opt.e.deltaY;
    if (zoom > MAX_SCALE) zoom = MAX_SCALE;
    if (zoom < MIN_SCALE) zoom = MIN_SCALE;
    fabRef.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  function handleMouseDown(opt) {
    let canvas = fabRef.current;
    switch(canvas.state.mode) {
      case 'pan':
        console.log(snapToGrid(opt.absolutePointer))
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

        fabRef.current.add(circle);
        break;
      case 'select':
        // fabRef.current.selection = true; // should already be true anyway
        break;
    }
  }

  function handleMouseMove(opt) {
    setCurPos(opt.absolutePointer)

    if (fabRef.current.state.isDragging) {
      var vpt = fabRef.current.viewportTransform;
      vpt[4] += opt.e.clientX - fabRef.current.state.lastPosX;
      vpt[5] += opt.e.clientY - fabRef.current.state.lastPosY;
      fabRef.current.requestRenderAll();
      fabRef.current.state.lastPosX = opt.e.clientX;
      fabRef.current.state.lastPosY = opt.e.clientY;
    }
  }

  function handleMouseUp(opt) {
    let canvas = fabRef.current;
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.state.isDragging = false;
  }

  function handleMode(event, newMode){
    let canvas = fabRef.current;
    if (newMode !== null){
      setMode(newMode);
      canvas.state.mode = newMode;
      switch (newMode) {
        case 'select':
          canvas.defaultCursor = 'default';
          canvas.selection = true;
          canvas.skipTargetFind = false;
          break;
        case 'pan':
          canvas.defaultCursor = 'grab';
          canvas.selection = false;
          canvas.skipTargetFind = true;
          break;
        case 'draw':
          canvas.defaultCursor = 'crosshair';
          canvas.selection = false;
          canvas.skipTargetFind = true;
          break;
      }
    }
  };

  function handleSnap(event) {
    setSnap(event.target.checked);
    fabRef.current.state.snap = event.target.checked;
  }

  return (
    <div>
      <Header/>
      <canvas ref={canvasRef}> 
        Could not load canvas. Please update browser or enable JavaScript.
      </canvas>
      <Toolbar 
        curPos={curPos} 
        mode={mode} 
        handleMode={handleMode}
        snap={snap}
        handleSnap={handleSnap}
      />
    </div>
  );
};

export default App