import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Resizable } from "re-resizable";
import { ImageUrl } from "../module/ImageUrl";
import TraitValueKey from "../module/TraitValueKey";

var jspaint;
function CanvasEditor({ trait, traitValue, onUpdate, below }) {
  const [id, setId] = useState(null);

  useEffect(() => {
    var iframe = document.getElementById("jspaint-iframe");
    jspaint = iframe?.contentWindow;
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
  }, [trait, traitValue]);

  useEffect(() => {
    var url = ImageUrl(TraitValueKey(trait, traitValue));
    if (!url && jspaint && _.isFunction(jspaint.clear)) {
      console.log("no url. clear.");
      jspaint.clear();
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

  return (
    <div
      style={{
        width: "100%",
        height: "50em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: 0 }}>Time to Draw!</h3>
      <h2 style={{ margin: 0 }}>
        {trait}: {traitValue}
      </h2>
      <br />
      <Resizable defaultSize={{ width: "80%", height: "60%" }}>
        <iframe
          src={makeJsPaintUrl()}
          id="jspaint-iframe"
          width="100%"
          height="100%"
        />
      </Resizable>
      {below}
    </div>
  );
}

export default CanvasEditor;
