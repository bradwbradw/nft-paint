import "./App.css";
import _, { set } from "lodash";

import CanvasEditor from "./components/CanvasEditor";
import Preview from "./components/Preview";
import Persistance from "./module/Persistance";
import Panels from "./components/Panels";

import TraitValueKey from "./module/TraitValueKey";

// import localstoragekey and imageurl
import { ImageUrl, localStorageKey } from "./module/ImageUrl";

import JSZip from "jszip";
import { saveAs } from "file-saver";

import { useState, useEffect } from "react";

import ConfirmDialog from "./module/ConfirmDialog";

console.clear();
function App() {
  const [traits, setTraits] = useState(Persistance.load("traits", []));
  const [trait, setTrait] = useState(null);
  const [traitValue, setTraitValue] = useState(null);
  const [width, setWidth] = useState(Persistance.load("width", 150));
  const [height, setHeight] = useState(Persistance.load("height", 150));

  const [uploadVisible, setUploadVisible] = useState(false);

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

  function upload() {
    ConfirmDialog(
      "This will replace all your traits with your directory's subfolder names.",
      () => {
        setUploadVisible(true);
      }
    );
  }

  const onInputChange = (event) => {
    const files = event.target.files;
    var oldTraits = [...traits];
    var newTraits = [];
    setTraits([]);

    return Promise.all(
      _.map(files, (file) => {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();

          if (file.type === "image/png") {
            reader.onload = (event) => {
              var pathSegments = file.webkitRelativePath.split("/");
              var traitName = "trait-name-goes-here";
              var value = "unknown value";
              if (pathSegments.length === 2) {
                traitName = pathSegments[0];
                value = _.without(
                  pathSegments[1].split("."),
                  _.last(pathSegments[1].split("."))
                ).join(".");
              } else if (pathSegments.length === 3) {
                traitName = pathSegments[1];
                value = _.without(
                  pathSegments[2].split("."),
                  _.last(pathSegments[2].split("."))
                ).join(".");
              } else if (pathSegments.length === 1) {
                value = _.without(
                  pathSegments[0].split("."),
                  _.last(pathSegments[0].split("."))
                ).join(".");
              }

              console.log("adding", traitName, value);
              const dataURL = JSON.stringify(event.target.result);
              var key = TraitValueKey(traitName, value);
              localStorage.setItem(localStorageKey(key), dataURL);
              resolve({ traitName, value });
            };

            reader.onerror = (event) => {
              console.error(
                "File could not be read! Code " + event.target.error.code
              );
              setTraits(oldTraits);
            };
            reader.readAsDataURL(file);
          } else {
            reject("not a png");
          }
        });
      })
    )
      .then((results) => {
        console.log("results", results);
        var newTraits = [];
        _.each(results, (result) => {
          var trait = _.find(newTraits, (t) => t.name === result.traitName);
          if (!trait) {
            trait = {
              name: result.traitName,
              values: [],
            };
            newTraits.push(trait);
          }
          trait.values.push(result.value);
        });
        console.log("newTraits", newTraits);
        setTraits(newTraits);
      })
      .catch((err) => {
        console.error(err);
        setTraits(oldTraits);
      });
  };

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
                {/*}
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
                </label>{*/}
                <button
                  style={{ height: "2em", fontSize: "1.5em", margin: "0.5em" }}
                  onClick={() => setTrait(null)}
                >
                  I'm Done Drawing
                </button>
              </div>
            }
          />
        ) : (
          <div style={{ padding: "2em" }}>
            <h2>NFT paint</h2>
            <div>getting started:</div>
            <div>
              1. add traits by using the Trait Editor panel on the right
            </div>
            <div>2. click on 🎨 beside a trait's value to start painting!</div>
            <div>
              3. scroll down in the Trait Editor to view combination previews.
            </div>
            <br />
            <div>
              You can "lock" a trait's value so it is always shown in the
              previews: In the Trait Editor, click on one or more value names or
              images.
            </div>
            <div style={{ margin: "1em" }}>
              <p>
                Your NFT collection has {traits.length} traits,{" "}
                {traits.reduce((acc, trait) => acc + trait.values.length, 0)}{" "}
                unique values and{" "}
                {traits.reduce((acc, trait) => acc * trait.values.length, 1)}{" "}
                possible combinations.
              </p>

              {traits.length > 1 ? (
                <>
                  <button onClick={download}> Download art folder</button>
                  <button onClick={upload}> Import art folder</button>
                </>
              ) : (
                <> </>
              )}
              <div
                style={{
                  ...(uploadVisible
                    ? { display: "block" }
                    : { display: "none" }),
                  ...{
                    margin: "1em",
                  },
                }}
              >
                <input
                  type="file"
                  webkitdirectory=""
                  onChange={onInputChange}
                />
                <p>Select your art folder (PNG files)</p>
              </div>
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
