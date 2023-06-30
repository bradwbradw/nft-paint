
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import JsPaintIntegration from '../module/jsPaintIntegration';
import TraitValueKey from '../module/TraitValueKey';

var jspaint;
function CanvasEditor({ trait, traitValue, imageMap, setImageMap }) {

  const [id, setId] = useState(null);
  const jsPaintRef = useRef(null);

  useEffect(() => {

    var iframe = document.getElementById('jspaint-iframe');
    jspaint = iframe?.contentWindow;
    if (jspaint) {
      //JsPaintIntegration.setupHooks(jspaint);
      console.log('jspaint', jspaint);
      window.jspaint = jspaint;
    } else {
      console.log('no jspaint.');
    }
    var key = TraitValueKey(trait, traitValue);

    if (key && key.length > 3) {
      setId(key);
    }

  }, [trait, traitValue]);


  function Canvas({ hidden }) {
    var url = 'jspaint/index.html';
    if (id && id.length > 3) {
      url = url + "#local:" + id;
    }
    return <iframe
      ref={jsPaintRef}
      src={url}
      width="600"
      height="500"
      id="jspaint-iframe"
      style={hidden ? { display: 'none' } : {}} />;
  }


  function save() {
    var id = jspaint.get_url_param('local');

    setImageMap(map => {
      map = { ...map, ..._.set({}, `${trait}-${traitValue}`, id) };
      console.log('set image map', map);
      return map;
    }
    );
  }
  return trait && traitValue ? (
    <><h4>draw a {traitValue} {trait}</h4>
      <button onClick={save}>
        save {TraitValueKey(trait, traitValue)}
      </button> <pre>{id}</pre>
      <br />
      <Canvas hidden={false} />
    </>
  ) : (
    <>

      <h4>select a trait </h4>
    </>
  );
}


export default CanvasEditor