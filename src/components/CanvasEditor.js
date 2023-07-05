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
    setTimeout(() => {
      if (jspaint && jspaint.$G) {
        //JsPaintIntegration.setupHooks(jspaint);
        console.log("jspaint", jspaint);
        window.jspaint = jspaint;

        jspaint.$G.on("session-update", onUpdate);
        jspaint.$G.on("persisted-image", onUpdate);
      } else {
        console.log("no jspaint.");
      }
      var key = TraitValueKey(trait, traitValue);

      if (key && key.length > 0) {
        setId(key);
      }
    }, 1000);
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
  if (!_.isString(traitValue)) {
    traitValue = "000demo000";
  }

  return (
    <div style={{ position: "fixed" }}>
      <h4>
        draw a {traitValue} {trait}
      </h4>
      <br />
      <iframe
        ref={jsPaintRef}
        src={makeJsPaintUrl()}
        width="600"
        height="500"
        id="jspaint-iframe"
      />
      <pre>{makeJsPaintUrl()}</pre>
    </div>
  );
}

export default CanvasEditor;
