import { useEffect, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";
import TraitEditor from "./TraitEditor";
import TraitValueKey from "../module/TraitValueKey";
import { ImageUrl } from "../module/ImageUrl";
import ConfirmDialog from "../module/ConfirmDialog";

function Preview({
  trait,
  traitValue,
  setTrait,
  setTraitValue,
  traits,
  setTraits,
  onUpdate,
  updatedAt,
  toggleLocked,
  isLocked,
}) {
  var [numCombos, setNumCombos] = useState(7);
  var [scale, setScale] = useState(1);
  var [previewingCombos, setPreviewingCombos] = useState([]);
  const [autoShuffle, setAutoShuffle] = useState(true);

  function combineTraits(traitsToCombine) {
    //return [];
    var [first] = _.pullAt(traitsToCombine, [0]);
    //console.log("first in new combo", first);
    if (!_.isArray(_.get(first, "values"))) {
      return [];
    } else if (_.size(traitsToCombine) === 1) {
      var valuesToMix = first.values;
      if (_.size(first.locked) > 0) {
        valuesToMix = first.locked;
      }
      var arrs = _.map(valuesToMix, (val1) => {
        var valuesToMix2 = traitsToCombine[0].values;
        if (_.size(traitsToCombine[0].locked) > 0) {
          valuesToMix2 = traitsToCombine[0].locked;
        }

        return _.map(valuesToMix2, (val2) => {
          var obj1 = _.set({}, "trait", first.name);
          _.set(obj1, "value", val1); //, val1);
          var obj2 = _.set({}, "trait", traitsToCombine[0].name);
          _.set(obj2, "value", val2);
          return [obj1, obj2];
        });
      });
      var result = _.flatten(arrs);
      //console.log("1 trait combo result", result);
      return result;
    } else {
      var combinations = combineTraits(traitsToCombine);
      var result = [];
      var valuesToMix3 = first.values;
      if (_.size(first.locked) > 0) {
        valuesToMix3 = first.locked;
      }

      _.each(valuesToMix3, (val) => {
        var newArr = _.map(combinations, (c) => {
          c = [{ trait: first.name, value: val }, ...c];
          //          var obj = _.set(c, first.name, val);
          //console.log("found for combo", c);
          return c;
        });

        result = [...result, newArr];
      });
      var result = _.flatten(result);
      //console.log("combination result", result);
      return result;
    }
  }

  function shuffle() {
    var t = combineTraits([...traits]);
    var sampled = _.sampleSize(t, numCombos);
    setPreviewingCombos(sampled);
  }

  useEffect(() => {
    if (autoShuffle) {
      shuffle();
    }
  }, [traits, numCombos, updatedAt]);
  //  shuffle();

  function numberLocked() {
    return _.size(_.flatten(_.map(traits, "locked")));
  }

  function unlockAll() {
    setTraits((traits) => {
      var newTraits = _.map(traits, (trait) => {
        return { ...trait, locked: [] };
      });
      return newTraits;
    });
  }

  var width = scale * localStorage.getItem("width") + "px";
  var height = scale * localStorage.getItem("height") + "px";
  var aspectRatio =
    localStorage.getItem("width") / localStorage.getItem("height");
  return (
    <>
      <div style={{ margin: "1em" }}>
        <TraitEditor
          trait={trait}
          traits={traits}
          setTraits={setTraits}
          setTrait={setTrait}
          setTraitValue={setTraitValue}
          onUpdate={onUpdate}
          isLocked={isLocked}
          toggleLocked={toggleLocked}
          style={{ width: "49%", display: "inline" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "1em",
          margin: "1em",
          gap: "1em",
          border: "1px dashed black",
        }}
      >
        <button
          style={{ border: "2px solid pink", fontSize: "1.2em" }}
          onClick={shuffle}
        >
          (re)generate previews
        </button>

        <label>
          auto-generate
          <input
            type="checkbox"
            checked={autoShuffle}
            onChange={(e) => setAutoShuffle(e.target.checked)}
          />
        </label>
        <label>
          number of previews:
          <input
            type="number"
            style={{ width: "4em" }}
            value={numCombos}
            onChange={(e) => setNumCombos(e.target.value)}
          />
        </label>
        {numberLocked() > 0 && (
          <label>
            {numberLocked()} locked
            <button onClick={unlockAll}>unlock all</button>
          </label>
        )}
      </div>
      {previewingCombos.map((combo, i) => {
        var layers = _.map(combo, ({ trait, value }) => {
          var key = TraitValueKey(trait, value);

          return { key, trait, value, url: ImageUrl(key) };
        });
        //<pre>{JSON.stringify(urls, null, 2)}</pre>;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "1em",
              gap: "0.5em",
            }}
          >
            <div
              style={{
                position: "relative",
                width,
                maxWidth: "100%",
                aspectRatio,
                flexShrink: "1",
              }}
            >
              {layers.map((layer) => {
                return (
                  <img
                    key={layer.key}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                    }}
                    src={layer.url}
                  />
                );
              })}
            </div>
            <div>
              {layers.map((layer) => {
                return (
                  <div
                    key={layer.key}
                    style={{
                      display: "flex",
                      gap: "0.5em",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setTrait(layer.trait);
                        setTraitValue(layer.value);
                      }}
                    >
                      🎨
                    </button>
                    <div
                      style={{
                        cursor: "pointer",
                        ...(isLocked(
                          _.find(traits, (t) => t.name === layer.trait),
                          layer.value
                        )
                          ? {
                              fontWeight: "bold",
                            }
                          : {}),
                      }}
                      onClick={() => {
                        toggleLocked(
                          _.find(traits, (t) => t.name === layer.trait),
                          layer.value
                        );
                      }}
                    >
                      {layer.trait}: {layer.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <button
        style={{ marginTop: "50em", color: "red" }}
        onClick={() => {
          ConfirmDialog("This will delete all your images and traits.", () => {
            traits.map((trait) => {
              trait.values.map((val) => {
                var key = TraitValueKey(trait.name, val);
                localStorage.removeItem("image#" + key);
              });
            });
            setTimeout(() => {
              setTraits([]);
            }, 1000);
          });
        }}
      >
        clear all
      </button>
      <pre>(c) 2023 Blue-Green Crypto version 0.01</pre>
    </>
  );
}

export default Preview;
