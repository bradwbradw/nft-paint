import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import JsPaintIntegration from "../module/jsPaintIntegration";
import TraitValueKey from "../module/TraitValueKey";

var jspaint;
function CanvasEditor({ trait, traitValue, onUpdate, below }) {
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

        jspaint.$G.on("persisted-image", () => {
          console.log("got persisted-image");
          onUpdate();
        });
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
    <div
      style={{
        width: "100%",
        height: "40em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>
        {trait}: {traitValue} ~ time to draw!
      </h2>
      <br />
      <iframe
        ref={jsPaintRef}
        src={makeJsPaintUrl()}
        id="jspaint-iframe"
        style={{ width: "100%", height: "100%" }}
      />

      <pre>{makeJsPaintUrl()}</pre>

      {below}
    </div>
  );
}

export default CanvasEditor;
