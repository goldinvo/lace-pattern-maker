import './Toolbar.css'

export default function Toolbar({curPos}) {

    return (
    <div>
        x: {Math.round(curPos.x)}, y: {Math.round(curPos.y)}
    </div>
  )
}