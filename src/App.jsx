import React, { useRef, useEffect, useState } from 'react'
import { fabric } from 'fabric'
import Toolbar from './Toolbar.jsx'
import Header from './Header.jsx'

function App() {
  const canvasRef = useRef(null);
  const fabRef = useRef(null);
  const fabStateRef = useRef({
    mode: 'select'
  });

  const [curPos, setCurPos] = useState({x: 0, y: 0});
  const [mode, setMode] = useState('select');

  useEffect(() => {
    // Init fabric
    fabRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#eeeeee",
    });

    // Fabric events handlers
    fabRef.current.on('mouse:wheel', handleScroll);
    fabRef.current.on('mouse:down', handleMouseDown);
    fabRef.current.on('mouse:move', handleMouseMove);
    fabRef.current.on('mouse:up', handleMouseUp); 

    // Cleanup on unmount
    return () => {
      fabRef.current.dispose();
    };
  }, []);

  function handleScroll(opt) {
    var delta = opt.e.deltaY;
    var zoom = fabRef.current.getZoom();
    zoom *= .999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    fabRef.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  function handleMouseDown(opt) {
    console.log(fabStateRef)
    var evt = opt.e;
    if (evt.altKey === true) {
      fabStateRef.current.isDragging = true;
      fabRef.current.selection = false;
      fabStateRef.current.lastPosX = evt.clientX;
      fabStateRef.current.lastPosY = evt.clientY;
    } else if (fabStateRef.current.mode == 'draw') {
      const circle = new fabric.Circle({
        radius: 5,
        fill: 'black',
        left: opt.absolutePointer.x,
        top: opt.absolutePointer.y,
      });
      fabRef.current.add(circle);
    }
  }

  function handleMouseMove(opt) {
    setCurPos(opt.absolutePointer)

    if (fabStateRef.current.isDragging) {
      var e = opt.e;
      var vpt = fabRef.current.viewportTransform;
      vpt[4] += e.clientX - fabStateRef.current.lastPosX;
      vpt[5] += e.clientY - fabStateRef.current.lastPosY;
      fabRef.current.requestRenderAll();
      fabStateRef.current.lastPosX = e.clientX;
      fabStateRef.current.lastPosY = e.clientY;
    }
  }

  function handleMouseUp(opt) {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    fabRef.current.setViewportTransform(fabRef.current.viewportTransform);
    fabStateRef.current.isDragging = false;
    fabRef.current.selection = true;
  }

  function handleMode(event, newMode){
    if (newMode !== null){
      fabStateRef.current.mode = newMode;
      setMode(newMode);
    }
  };

  return (
    <div>
      <Header/>
      <canvas ref={canvasRef} width="800" height="600"> 
        Could not load canvas. Please update browser or enable JavaScript.
      </canvas>
      <Toolbar curPos={curPos} mode={mode} handleMode={handleMode}/>
    </div>
  );
};

export default App