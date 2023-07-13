import React, { useState, useEffect } from "react";
import _, { shuffle } from "lodash";
import TraitValueKey from "../module/TraitValueKey";
import { ImageUrl } from "../module/ImageUrl";
import ConfirmDialog from "../module/ConfirmDialog";

function TraitEditor({
  trait,
  traits,
  setTraits,
  setTrait,
  setTraitValue,
  onUpdate,
  style,
  isLocked,
  toggleLocked,
}) {
  var defaultNewTrait = { name: null, values: [] };
  const [newTrait, setNewTrait] = useState(defaultNewTrait);
  const [modifyingTraitIndex, setModifyingTraitIndex] = useState(null);

  function addTrait(p) {
    setTraits((traits) => _.uniq([...traits, p]));
    setNewTrait(defaultNewTrait);
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
      !_.includes(newTrait.values, "") &&
      !_.some(traits, (t) => t.name === newTrait.name)
    );
  }

  function reorderTrait(traitIndex, up) {
    var trait = traits[traitIndex];
    var newTraits = [...traits];
    newTraits.splice(traitIndex, 1);
    newTraits.splice(traitIndex + (up ? -1 : 1), 0, trait);
    setTraits(newTraits);
  }

  function isExpanded(trait) {
    return _.get(trait, "expanded", true);
  }
  var changeTrait = null;
  function startEditing(t) {
    if (trait && trait.name === t.name) {
      changeTrait = trait.name;
    }
    setModifyingTraitIndex(_.indexOf(traits, t));
    setNewTrait(t);
  }

  function NewTrait() {
    return (
      <>
        {!_.isString(newTrait.name) ? (
          <button
            onClick={(e) => {
              setNewTrait(defaultNewTrait);
              e.preventDefault();
            }}
          >
            {" "}
            add new trait{" "}
          </button>
        ) : (
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
                      function deleteTraitValue() {
                        newTrait.values.splice(i, 1);
                        setNewTrait({
                          ...newTrait,
                        });
                      }
                      if (val.length === 0) {
                        deleteTraitValue();
                      } else {
                        ConfirmDialog("delete trait value " + val + "?", () => {
                          deleteTraitValue();
                        });
                      }
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
              add a value
            </button>
            {canCreateNewTrait() ? (
              <></>
            ) : (
              <button
                onClick={() => {
                  setNewTrait(defaultNewTrait);
                }}
              >
                nevermind
              </button>
            )}
            <br />
            <button
              onClick={() => {
                newTrait.values = _.uniq(newTrait.values);
                if (modifyingTraitIndex !== null) {
                  setTraits((traits) => {
                    var newTraits = [...traits];
                    newTraits[modifyingTraitIndex] = newTrait;

                    setModifyingTraitIndex(null);
                    return newTraits;
                  });
                  setNewTrait(defaultNewTrait);
                  if (changeTrait) {
                    setTrait(null);
                    changeTrait = null;
                  }
                } else if (canCreateNewTrait()) {
                  addTrait(newTrait);
                }
              }}
              disabled={!canCreateNewTrait()}
            >
              finish: {newTrait.name}
            </button>
          </>
        )}
      </>
    );
  }
  return (
    <>
      <div style={style}>
        {_.map(traits, (trait, i) => {
          if (_.isString(newTrait.name) && modifyingTraitIndex === i) {
            return <div key={"new trait"}>{NewTrait()}</div>;
          } else {
            return (
              <div key={trait.name} style={{ display: "flex" }}>
                <div
                  style={{
                    flexGrow: "2",
                    border: "1px solid green",
                    padding: "0.5em",
                    display: "flex",
                    gap: "1em",
                  }}
                >
                  <div style={{ minWidth: "10em" }}>
                    <div style={{ fontSize: "1.5em" }}>
                      {trait.name}
                      <button
                        style={{ marginLeft: "1em" }}
                        onClick={() => {
                          startEditing(trait);
                        }}
                      >
                        ✏️
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
                    </div>
                    <br />
                    {isExpanded(trait)
                      ? trait.values.map((val, i) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                marginBottom: "0.15em",
                                alignItems: "center",
                              }}
                              key={i}
                            >
                              <button
                                style={{ maxHeight: "2em" }}
                                onClick={() => {
                                  setTrait(trait.name);
                                  setTraitValue(val);
                                }}
                              >
                                🎨
                              </button>
                              <span
                                style={{
                                  marginLeft: "0.5em",
                                  cursor: "pointer",
                                  ...(isLocked(trait, val)
                                    ? { fontWeight: "bold" }
                                    : {}),
                                }}
                                onClick={() => {
                                  toggleLocked(trait, val);
                                }}
                              >
                                {val}
                              </span>
                            </div>
                          );
                        })
                      : null}
                  </div>
                  <div
                    style={{ display: "flex", gap: "1em", flexWrap: "wrap" }}
                  >
                    {isExpanded(trait)
                      ? trait.values.map((val, i) => {
                          var key = TraitValueKey(trait.name, val);
                          return (
                            <div
                              key={i}
                              style={{
                                padding: "5px",
                                ...(isLocked(trait, val)
                                  ? { border: "3px solid red" }
                                  : {}),
                              }}
                              onClick={() => {
                                toggleLocked(trait, val, i);
                              }}
                            >
                              <img src={ImageUrl(key)} width="50" />
                            </div>
                          );
                        })
                      : null}
                  </div>

                  <div
                    style={{
                      flexGrow: "5",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        if (isExpanded(trait)) {
                          trait.expanded = false;
                          setTraits([...traits]);
                        } else {
                          trait.expanded = true;
                          setTraits([...traits]);
                        }
                      }}
                    >
                      +/-
                    </button>

                    <button
                      style={{
                        height: "2em",
                        ...(isExpanded(trait) ? {} : { display: "none" }),
                      }}
                      onClick={() => {
                        ConfirmDialog(
                          "delete trait " + trait.name + "?",
                          () => {
                            deleteTrait(trait);
                          }
                        );
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      {modifyingTraitIndex === null && NewTrait()}
      <pre>new t: {JSON.stringify(newTrait, null, 2)}</pre>
      <pre>modifying index: {modifyingTraitIndex}</pre>
      <pre>{JSON.stringify(traits, null, 2)}</pre>
    </>
  );
}

export default TraitEditor;
