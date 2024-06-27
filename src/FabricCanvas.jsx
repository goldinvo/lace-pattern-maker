import React, { useRef, useEffect, useState } from 'react'
import { fabric } from 'fabric'


function fabricInit(canvas) {
  // Canvas zoom
  canvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= .999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
  });

  // Canvas pan
  canvas.on('mouse:down', function(opt) {
    var evt = opt.e;
    console.log(opt);
    if (evt.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    }
  });
  canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
      var e = opt.e;
      var vpt = this.viewportTransform;
      vpt[4] += e.clientX - this.lastPosX;
      vpt[5] += e.clientY - this.lastPosY;
      this.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  });
  canvas.on('mouse:up', function(opt) {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
  });
}

export default function FabricCanvas() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
    });
    fabricInit(fabricRef.current);    
    // Add event handler for object selection
    fabricRef.current.on('selection:created', (e) => {
      setSelectedObject(e.selected[0]);
    });

    fabricRef.current.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0]);
    });

    fabricRef.current.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Cleanup on unmount
    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: 'green',
      left: 150,
      top: 150,
    });
    fabricRef.current.add(circle);
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      fabricRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="600"> 
        Could not load canvas. Please update browser or enable JavaScript.
      </canvas>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={deleteSelectedObject} disabled={!selectedObject}>
        Delete Selected Object
      </button>
    </div>
  );
};