
import { useEffect, useState } from 'react';
import _ from '../_';
import { HexColorPicker } from "react-colorful";
import CanvasDraw from 'react-canvas-draw'

function CanvasEditor({ trait, traitValue }) {

  const [color, setColor] = useState("#aabbcc");

  const canvasDrawProps = {
    onChange: null,
    loadTimeOffset: 5,
    lazyRadius: 0,
    brushRadius: 12,
    brushColor: color,
    catenaryColor: "#0a0302",
    gridColor: "rgba(150,150,150,0.17)",
    hideGrid: false,
    canvasWidth: 400,
    canvasHeight: 400,
    disabled: false,
    imgSrc: "",
    saveData: null,
    immediateLoading: false,
    hideInterface: false,
    gridSizeX: 25,
    gridSizeY: 25,
    gridLineWidth: 0.5,
    hideGridX: false,
    hideGridY: false,
    enablePanAndZoom: false,
    mouseZoomFactor: 0.01,
    zoomExtents: { min: 0.33, max: 3 },
  };

  return trait && traitValue ? (
    <><h4>draw a {traitValue} {trait}</h4>
      <HexColorPicker color={color} onChange={setColor} /><br /><br />
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }} >
        <CanvasDraw {...canvasDrawProps} />;
      </div>
    </>
  ) : null
}


export default CanvasEditor