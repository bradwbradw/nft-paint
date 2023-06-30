import { useEffect, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";
import TraitValueKey from "../module/TraitValueKey";

function Preview({ traits, updatedAt }) {
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
      <label>
        number of previews
        <input
          type="number"
          value={numCombos}
          onChange={(e) => setNumCombos(e.target.value)}
        />
      </label>
      <pre>
        updated at:{" "}
        {new DateTime(updatedAt).toLocaleString(
          DateTime.DATETIME_FULL_WITH_SECONDS
        )}
      </pre>
      <button onClick={shuffle}>shuffle</button>
      num combos:{numCombos}
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
              width: "100%",
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
