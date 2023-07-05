import { useEffect, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";
import TraitValueKey from "../module/TraitValueKey";

function Preview({
  trait,
  setTrait,
  traitValue,
  setTraitValue,
  traits,
  setTraits,
  onUpdate,
  updatedAt,
}) {
  const [newTrait, setNewTrait] = useState({ name: null, values: [] });

  function addTrait(p) {
    setTraits((traits) => _.uniq([...traits, p]));
    setNewTrait("");
  }
  function deleteTrait(p) {
    setTraits((traits) => _.without(traits, p));
  }
  useEffect(() => {
    localStorage.setItem("traits", JSON.stringify(traits));
    onUpdate();
  }, [traits]);

  function canCreateNewTrait() {
    return (
      _.isString(newTrait.name) &&
      !_.isEmpty(newTrait.name) &&
      _.isArray(newTrait.values) &&
      _.size(newTrait.values) > 0 &&
      !_.includes(newTrait.values, "")
    );
  }

  function reorderTrait(traitIndex, up) {
    var trait = traits[traitIndex];
    var newTraits = [...traits];
    newTraits.splice(traitIndex, 1);
    newTraits.splice(traitIndex + (up ? -1 : 1), 0, trait);
    setTraits(newTraits);
  }

  function TraitEditor({ style }) {
    return (
      <>
        <div style={style}>
          <h4>traits</h4>
          NEW:[{newTrait.name}]<br />
          NEWVAL:[{newTrait.values}]<br />
          {_.map(traits, (trait, i) => {
            return (
              <div key={trait.name} style={{ border: "1px solid orange" }}>
                {trait.name}
                <button
                  style={{ marginLeft: "1em" }}
                  onClick={() => {
                    setNewTrait(trait);
                    deleteTrait(trait);
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    deleteTrait(trait);
                  }}
                >
                  {" "}
                  🗑️
                </button>
                {i > 0 ? (
                  <button
                    onClick={() => {
                      reorderTrait(i, true);
                    }}
                  >
                    ⬆️
                  </button>
                ) : null}
                {i < _.size(traits) - 1 ? (
                  <button
                    onClick={() => {
                      reorderTrait(i, false);
                    }}
                  >
                    ⬇️
                  </button>
                ) : null}
                <br />{" "}
                {trait.values.map((val) => {
                  return (
                    <div key={trait.name + "-" + val}>
                      <span style={{ marginLeft: "1em" }}>{val}</span>{" "}
                      <button
                        onClick={() => {
                          setTrait(trait.name);
                          setTraitValue(val);
                        }}
                      >
                        🖌️
                      </button>
                      <br />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {_.isObject(newTrait) && _.isString(newTrait.name) ? null : (
          <button
            onClick={(e) => {
              setNewTrait({
                name: "",
                values: [],
              });
              e.preventDefault();
            }}
          >
            {" "}
            add new trait{" "}
          </button>
        )}
        {_.isObject(newTrait) && _.isString(newTrait.name) ? (
          <>
            <input
              autoFocus
              value={newTrait.name}
              placeholder="new trait name"
              onChange={(event) => {
                setNewTrait({
                  name: event.target.value,
                  values: newTrait.values,
                });
              }}
              onKeyUp={(event) => {
                console.log(event.key);
                if (event.key === "Enter") {
                  if (canCreateNewTrait()) {
                    addTrait(newTrait);
                  } else {
                    console.log("cannot create new trait", newTrait);

                    setNewTrait({
                      ...newTrait,
                      values: [...newTrait.values, ""],
                    });
                  }
                }
              }}
            ></input>
            <br />
            {newTrait.values.map((val, i) => {
              return (
                <label key={i} style={{ marginLeft: "2em", display: "block" }}>
                  trait value:{" "}
                  <input
                    autoFocus
                    value={val}
                    onChange={(event) => {
                      newTrait.values[i] = event.target.value;
                      setNewTrait({
                        ...newTrait,
                      });
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setNewTrait({
                          ...newTrait,
                          values: [...newTrait.values, ""],
                        });
                      }
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      newTrait.values.splice(i, 1);
                      setNewTrait({
                        ...newTrait,
                      });
                    }}
                  >
                    🗑️
                  </button>
                </label>
              );
            })}
            <button
              style={{
                marginLeft: "2em",
              }}
              onClick={() => {
                setNewTrait({
                  ...newTrait,
                  values: [...newTrait.values, ""],
                });
              }}
            >
              add
            </button>
            <br />
            <button
              onClick={() => {
                if (canCreateNewTrait()) {
                  addTrait(newTrait);
                }
              }}
              disabled={!canCreateNewTrait()}
            >
              finish: {newTrait.name}
            </button>
          </>
        ) : null}
      </>
    );
  }
  var [numCombos, setNumCombos] = useState(7);
  var [scale, setScale] = useState(1);
  var [previewingCombos, setPreviewingCombos] = useState([]);

  function combineTraits(traitsToCombine) {
    //return [];
    var [first] = _.pullAt(traitsToCombine, [0]);
    //console.log("first in new combo", first);
    if (!_.isArray(_.get(first, "values"))) {
      return [];
    } else if (_.size(traitsToCombine) === 1) {
      var arrs = _.map(first.values, (val1) => {
        return _.map(traitsToCombine[0].values, (val2) => {
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
      _.each(first.values, (val) => {
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

  function imageUrl(id) {
    var url = localStorage.getItem("image#" + id);
    // it's json
    return JSON.parse(url);
  }

  function shuffle() {
    var t = combineTraits([...traits]);
    var sampled = _.sampleSize(t, numCombos);
    setPreviewingCombos(sampled);
  }

  useEffect(() => {
    shuffle();
  }, [traits, numCombos, updatedAt]);
  //  shuffle();

  var width = scale * localStorage.getItem("width") + "px";
  var height = scale * localStorage.getItem("height") + "px";
  return (
    <>
      <div>
        <TraitEditor style={{ width: "49%", display: "inline" }} />

        <div style={{ width: "49%", float: "right", display: "inline" }}>
          {_.map(traits, (trait) => {
            return _.map(trait.values, (val) => {
              var traitKey = TraitValueKey(trait.name, val);

              return (
                <div key={traitKey}>
                  {trait.name}-{val}
                  <img src={imageUrl(traitKey)} height="50" width="50" />
                </div>
              );
            });
          })}
        </div>
      </div>
      <label>
        number of previews
        <input
          type="number"
          value={numCombos}
          onChange={(e) => setNumCombos(e.target.value)}
        />
      </label>
      <button onClick={shuffle}>shuffle</button>
      <pre>
        updated at:{" "}
        {new DateTime(updatedAt).toLocaleString(
          DateTime.DATETIME_FULL_WITH_SECONDS
        )}
      </pre>
      {previewingCombos.map((combo, i) => {
        var layers = _.map(combo, ({ trait, value }) => {
          var key = TraitValueKey(trait, value);
          return { key, trait, value, url: imageUrl(key) };
        });
        //<pre>{JSON.stringify(urls, null, 2)}</pre>;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              width: "45vw",
              border: "1px solid green",
            }}
          >
            <div style={{ border: "1px solid blue", width, height }}>
              {layers.map((layer) => {
                return (
                  <img
                    key={layer.key}
                    style={{ position: "absolute" }}
                    src={layer.url}
                  />
                );
              })}
            </div>
            <ul>
              {layers.map((layer) => {
                return (
                  <li key={layer.key}>
                    {layer.trait}: {layer.value}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <button
        onClick={() => {
          traits.map((trait) => {
            trait.values.map((val) => {
              var key = TraitValueKey(trait.name, val);
              localStorage.removeItem("image#" + key);
            });
          });
        }}
      >
        clear all
      </button>
    </>
  );
}

export default Preview;
