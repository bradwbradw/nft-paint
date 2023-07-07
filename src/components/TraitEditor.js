import React, { useState, useEffect } from "react";
import _, { shuffle } from "lodash";
import TraitValueKey from "../module/TraitValueKey";
import ImageUrl from "../module/ImageUrl";
import ConfirmDialog from "../module/ConfirmDialog";

function TraitEditor({
  traits,
  setTraits,
  setTrait,
  setTraitValue,
  onUpdate,
  style,
  isLocked,
  toggleLocked,
}) {
  const [newTrait, setNewTrait] = useState({ name: null, values: [] });
  const [modifyingTraitIndex, setModifyingTraitIndex] = useState(null);

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

  function isExpanded(trait) {
    return _.get(trait, "expanded", true);
  }
  return (
    <>
      <div style={style}>
        {_.map(traits, (trait, i) => {
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
                        setNewTrait(trait);
                        deleteTrait(trait);
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
                    ? trait.values.map((val) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              marginBottom: "0.15em",
                              alignItems: "center",
                            }}
                            key={trait.name + "-" + val}
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
                <div style={{ display: "flex", gap: "1em", flexWrap: "wrap" }}>
                  {isExpanded(trait)
                    ? trait.values.map((val) => {
                        var key = TraitValueKey(trait.name, val);
                        return (
                          <div
                            key={key}
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
                      ConfirmDialog("delete trait " + trait.name + "?", () => {
                        deleteTrait(trait);
                      });
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
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
                    ConfirmDialog("delete trait value " + val + "?", () => {
                      newTrait.values.splice(i, 1);
                      setNewTrait({
                        ...newTrait,
                      });
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
          <button
            onClick={() => {
              setNewTrait({ name: null, values: [] });
            }}
          >
            nevermind
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

export default TraitEditor;
