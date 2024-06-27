import { useState } from 'react'
import Header from './components/Header.jsx'
import FabricCanvas from './FabricCanvas.jsx'
import Toolbar from './Toolbar.jsx'
import './App.css'

function App() {
  const [curPos, setCurPos] = useState({x: 0, y: 0});
  function handleCurPosUpdate(coords) { setCurPos(coords) };


  return (
    <>
      <Header/>
      <FabricCanvas handleCurPosUpdate={handleCurPosUpdate}/>
      <Toolbar curPos={curPos}/>
    </>
  )
}

export default App
