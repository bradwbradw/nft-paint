
import { useEffect, useState } from 'react';
import _ from '../_';
import JsPaintIntegration from '../module/jsPaintIntegration';

function CanvasEditor({ trait, traitValue }) {

  useEffect(() => {

    var iframe = document.getElementById('jspaint-iframe');
    var jspaint = iframe.contentWindow;
    JsPaintIntegration.setupHooks(jspaint);

  }, [trait, traitValue]);


  function Canvas({ hidden }) {
    return <iframe src="jspaint/index.html" width="100%" height="800" id="jspaint-iframe"
      style={hidden ? { display: 'none' } : {}} />;
  }
  return trait && traitValue ? (
    <><h4>draw a {traitValue} {trait}</h4>
      <button >save</button>
      <Canvas hidden={false} />
    </>
  ) : (
    <>

      <h4>select a trait </h4>
      <Canvas hidden={true} />
    </>
  );
}


export default CanvasEditor