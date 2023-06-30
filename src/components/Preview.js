import { useEffect, useState } from "react";
import _ from "lodash";
import TraitValueKey from "../module/TraitValueKey";

function Preview({ traits }) {
  var [numCombos, setNumCombos] = useState(1);

  const [combinations, setCombinations] = useState([]);

  useEffect(() => {
    var traitsCopy = [...traits];
  }, [traits]);

  function combineTraits(traits) {
    var [first] = _.pullAt(traits, [0]);
    if (!_.isArray(_.get(first, "values"))) {
      return { initializing: true };
    } else if (_.size(traits) === 1) {
      var arrs = _.map(first.values, (val1) => {
        return _.map(traits[0].values, (val2) => {
          var obj1 = _.set({}, first.name, val1);
          var obj2 = _.set({}, traits[0].name, val2);
          return { ...obj1, ...obj2 };
        });
      });
      return _.flatten(arrs);
    } else {
      var combinations = combineTraits([...traits]);

      var f = combinations; //_.flatten(combinations);
      var result = [];
      _.each(first.values, (val) => {
        var newArr = _.map([...combinations], (c) => {
          var obj = { ..._.set(c, first.name, val) };
          console.log(obj);
          return obj;
        });

        result = [...result, newArr];
      });
      return _.flatten(result);
    }
  }

  function traitsCombined() {
    return combineTraits([...traits]);
  }

  function imageUrl(id) {
    var url = localStorage.getItem("image#" + id);
    // it's json
    return JSON.parse(url);
  }

  return (
    <>
      num combos:{numCombos}
      {/*}
    <pre> {JSON.stringify(traitsCombined(), null, 2)}</pre>
    {*/}
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
