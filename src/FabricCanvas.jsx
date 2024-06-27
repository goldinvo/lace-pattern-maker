import React, { useRef, useEffect, useState } from 'react'
import { fabric } from 'fabric'

// export default function FabricCanvas() {
//   const canvasRef = useRef(null);
  
//   useEffect(() => {
//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Add a rectangle to the canvas
//     const rect = new fabric.Rect({
//       left: 100,
//       top: 100,
//       fill: 'red',
//       width: 200,
//       height: 200,
//     });
//     canvas.add(rect);

//     // Clean up the canvas when the component is unmounted
//     return () => {
//       canvas.dispose();
//     };
//   }, []);
  
//   return <canvas ref={canvasRef} width={600} height={400} />;
// }

const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    // Initialize the Fabric.js canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);

    // Example: Add a rectangle to the canvas
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 200,
      height: 200,
    });

    fabricCanvasRef.current.add(rect);

    // Add event handler for object selection
    fabricCanvasRef.current.on('object:selected', (e) => {
      setSelectedObject(e.target);
    });

    // Cleanup on unmount
    return () => {
      fabricCanvasRef.current.dispose();
    };
  }, []);

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: 'green',
      left: 150,
      top: 150,
    });
    fabricCanvasRef.current.add(circle);
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="600" />
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={deleteSelectedObject} disabled={!selectedObject}>
        Delete Selected Object
      </button>
    </div>
  );
};

export default FabricCanvas;