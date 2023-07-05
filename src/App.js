import "./App.css";
import _ from "lodash";

import CanvasEditor from "./components/CanvasEditor";
import Preview from "./components/Preview";
import Pane from "./components/Pane";
import Persistance from "./module/Persistance";

import { useState, useEffect } from "react";

console.clear();
function App() {
  const [traits, setTraits] = useState(Persistance.load("traits", []));
  const [trait, setTrait] = useState("000demo000");
  const [traitValue, setTraitValue] = useState(null);
  //  const [imageMap, setImageMap] = useState(Persistance.load("imageMap", {}));
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    Persistance.save("traits", traits);
  }, [traits]);

  function notifyUpdated() {
    console.log("updated");
    setUpdatedAt(new Date());
  }

  return (
    <>
      <h2>nft paint</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          //        justifyContent: 'space-evenly',
          width: "100%",
          background: "green",
        }}
      >
        <Pane style={{ position: "fixed" }}>
          <CanvasEditor
            trait={trait}
            traitValue={traitValue}
            onUpdate={notifyUpdated}
          />
        </Pane>
        <Pane>
          <Preview
            traits={traits}
            traitValue={traitValue}
            setTraits={setTraits}
            setTrait={setTrait}
            setTraitValue={setTraitValue}
            onUpdate={notifyUpdated}
            updatedAt={updatedAt}
          />
        </Pane>
      </div>
    </>
  );
}

export default App;
