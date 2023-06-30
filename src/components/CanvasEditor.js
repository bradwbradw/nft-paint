import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import JsPaintIntegration from "../module/jsPaintIntegration";
import TraitValueKey from "../module/TraitValueKey";

var jspaint;
function CanvasEditor({ trait, traitValue, onUpdate }) {
  const [id, setId] = useState(null);
  const jsPaintRef = useRef(null);

  useEffect(() => {
    var iframe = document.getElementById("jspaint-iframe");
    jspaint = iframe?.contentWindow;
    if (jspaint && jspaint.$G) {
      //JsPaintIntegration.setupHooks(jspaint);
      console.log("jspaint", jspaint);
      window.jspaint = jspaint;

      jspaint.$G.on("session-update", onUpdate);
    } else {
      console.log("no jspaint.");
    }
    var key = TraitValueKey(trait, traitValue);

    if (key && key.length > 0) {
      setId(key);
    }
  }, [trait, traitValue]);

  function makeJsPaintUrl() {
    var url = "jspaint/index.html";

    if (id && id.length > 0) {
      url = url + "#local:" + id; // + "-" + session;
    }
    return url;
  }

  function save() {
    var id = jspaint.get_url_param("local");
  }
  return trait && traitValue ? (
    <>
      <h4>
        draw a {traitValue} {trait}
      </h4>
      <button onClick={save}>save {TraitValueKey(trait, traitValue)}</button>{" "}
      <pre>{makeJsPaintUrl()}</pre>
      <br />
      <iframe
        ref={jsPaintRef}
        src={makeJsPaintUrl()}
        width="600"
        height="500"
        id="jspaint-iframe"
      />
    </>
  ) : (
    <>
      <h4>select a trait </h4>
    </>
  );
}

export default CanvasEditor;
