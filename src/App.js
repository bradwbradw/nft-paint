import "./App.css";
import _ from "lodash";

import CanvasEditor from "./components/CanvasEditor";
import Preview from "./components/Preview";
import Pane from "./components/Pane";
import Persistance from "./module/Persistance";
import Panels from "./components/Panels";

import { useState, useEffect } from "react";

console.clear();
function App() {
  const [traits, setTraits] = useState(Persistance.load("traits", []));
  const [trait, setTrait] = useState("000demo000");
  const [traitValue, setTraitValue] = useState(null);
  const [width, setWidth] = useState(Persistance.load("width", 500));
  const [height, setHeight] = useState(Persistance.load("height", 500));

  //  const [imageMap, setImageMap] = useState(Persistance.load("imageMap", {}));
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    Persistance.save("traits", traits);
  }, [traits]);

  useEffect(() => {
    Persistance.save("width", width * 1);
  }, [width]);

  useEffect(() => {
    Persistance.save("height", height * 1);
  }, [height]);

  function notifyUpdated() {
    console.log("updated");
    setUpdatedAt(new Date());
  }

  function toggleLocked(trait, val) {
    var i = _.findIndex(traits, (t) => t.name === trait.name);
    trait.locked = [..._.get(trait, "locked", [])];
    if (isLocked(trait, val)) {
      setTraits((traits) => {
        console.log(traits);
        var newTraits = [...traits];
        newTraits.splice(i, 1, {
          ...trait,
          values: trait.values,
          locked: _.without(trait.locked, val),
        });
        console.log("newTraits", newTraits);
        return newTraits;
      });
    } else {
      setTraits((traits) => {
        console.log(traits);
        var newTraits = [...traits];
        newTraits.splice(i, 1, {
          ...trait,
          values: trait.values,
          locked: _.uniq([...trait.locked, val]),
        });
        console.log("newTraits", newTraits);
        return newTraits;
      });
    }
  }

  function isLocked(trait, value) {
    return _.includes(_.get(trait, "locked", []), value);
  }

  function TraitObj(name) {
    return _.find(traits, (t) => t.name === name);
  }

  return (
    <Panels
      left={
        <CanvasEditor
          trait={trait}
          traitValue={traitValue}
          onUpdate={notifyUpdated}
          below={
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <button
                  onClick={() => {
                    toggleLocked(TraitObj(trait), traitValue);
                  }}
                >
                  {isLocked(TraitObj(trait), traitValue) ? "unlock" : "lock"}
                  {`${trait}:${traitValue}`}
                </button>
              </div>
              <label>
                height
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </label>
              <label>
                width
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </label>
              <label>
                n combinations
                <input type="number" />
              </label>
            </div>
          }
        />
      }
      right={
        <Preview
          traits={traits}
          traitValue={traitValue}
          setTraits={setTraits}
          setTrait={setTrait}
          setTraitValue={setTraitValue}
          onUpdate={notifyUpdated}
          updatedAt={updatedAt}
          toggleLocked={toggleLocked}
          isLocked={isLocked}
        />
      }
    />
  );
}

export default App;
