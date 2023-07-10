import { set } from "lodash";
import _ from "lodash";
import { useEffect, useState } from "react";

function Pane({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [startResizePositon, setStartResizePosition] = useState([0, 0]); // [x,y]
  const [resizing, setResizing] = useState(false);
  var startingWidthPx = window.innerWidth / 2;
  const [width, setWidth] = useState(startingWidthPx);

  function resize(newWidth) {
    setWidth(newWidth);
  }
  useEffect(() => {
    console.log(
      `current width is ${width}, resizing is ${resizing}, startResizePositon is ${startResizePositon[0]}`
    );
  }, [resizing, width, startResizePositon]);

  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`, //: expanded ? "33vw" : "3rem",
        flexGrow: "1",
        background: "lightgreen",
        border: "2px solid blue",
      }}
    >
      <div
        style={{
          cursor: "col-resize",
        }}
        onMouseDown={(event) => {
          // debounce

          setResizing(true);
          // track mouse movement to resize
          setStartResizePosition([event.clientX, event.clientY]);
        }}
        onMouseMove={() =>
          _.throttle((event) => {
            if (resizing) {
              var delta = event.clientX - startResizePositon[0];
              var newWidth = parseInt(width) - delta;
              resize(newWidth);
            }
          }, 100)
        }
        onMouseUp={(event) => {
          setResizing(false);
        }}
      >
        drag me to resize
      </div>

      {children}

      <button
        onClick={() => {
          setExpanded(!expanded);
        }}
        className="expand"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        {expanded ? "------" : "+++++++"}
      </button>
    </div>
  );
}

export default Pane;
