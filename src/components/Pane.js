import { useState } from "react"

function Pane({ children }) {

  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      position: 'relative',
      width: expanded ? '33vw' : '3rem',
      flexGrow: expanded ? '1' : '0',
      background: 'lightgreen',
      border: '2px solid blue'
    }}>

      {children}

      <button
        onClick={() => { setExpanded(!expanded) }} className="expand"
        style={{
          position: 'absolute',
          top: 0,
          right: 0
        }}
      >

        {expanded ? '------' : '+++++++'}

      </button>
    </div>
  )
}

export default Pane