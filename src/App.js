import "./App.css";
import _ from "lodash";

import CanvasEditor from "./components/CanvasEditor";
import Preview from "./components/Preview";
import Pane from "./components/Pane";
import Persistance from "./module/Persistance";
import Panels from "./components/Panels";

import TraitValueKey from "./module/TraitValueKey";
import ImageUrl from "./module/ImageUrl";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { useState, useEffect } from "react";

console.clear();
function App() {
  const [traits, setTraits] = useState(Persistance.load("traits", []));
  const [trait, setTrait] = useState(null);
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

  function download() {
    const zip = new JSZip();

    _.each(traits, (trait) => {
      var folder = zip.folder(trait.name);
      trait.values.map((value) => {
        var key = TraitValueKey(trait.name, value);
        var url = ImageUrl(key);
        if (url && url.split(",").length === 2) {
          var img = _.last(url.split(","));
          folder.file(`${value}.png`, img, { base64: true });
        }
      });
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "nft-paint-images.zip");
    });
  }

  return (
    <Panels
      left={
        trait ? (
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
                    {isLocked(TraitObj(trait), traitValue)
                      ? "unlock "
                      : "lock "}
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
                <button onClick={() => setTrait(null)}>Done Drawing!</button>
                <label>
                  n combinations
                  <input type="number" />
                </label>
              </div>
            }
          />
        ) : (
          <div style={{ padding: "2em" }}>
            <h2>NFT paint</h2>
            <div>getting started:</div>
            <div>1. add traits by using the panel on the right</div>
            <div>2. click on 🎨 beside a trait's value to start painting!</div>
            <div style={{ margin: "1em" }}>
              <p>
                Your NFT collection has {traits.length} traits,{" "}
                {traits.reduce((acc, trait) => acc + trait.values.length, 0)}{" "}
                unique values and{" "}
                {traits.reduce((acc, trait) => acc * trait.values.length, 1)}{" "}
                possible combinations.
              </p>
              <p>
                <button onClick={download}> Download art folder</button>
              </p>
            </div>
          </div>
        )
      }
      right={
        <Preview
          trait={trait}
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
