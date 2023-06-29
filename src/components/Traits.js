
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { set } from 'lodash';

function Traits({ trait, setTrait, traitValue, setTraitValue, setImageMap }) {

  //  localStorage.clear('traits');
  const [traits, setTraits] = useState(JSON.parse(localStorage.getItem('traits') || "[]"));
  const [newTrait, setNewTrait] = useState({ name: null, values: [] });

  function addTrait(p) {
    setTraits(_.uniq([...traits, p]));
    setNewTrait("");
  }
  function deleteTrait(p) {
    setTraits(_.without(traits, p))
  }
  useEffect(() => {
    localStorage.setItem('traits', JSON.stringify(traits));
  }, [traits]);

  function canCreateNewTrait() {
    return _.isString(newTrait.name) &&
      !_.isEmpty(newTrait.name) &&
      _.isArray(newTrait.values) &&
      _.size(newTrait.values) > 0 &&
      !_.includes(newTrait.values, "");
  }
  return (
    <>
      <h4>traits</h4>
      NEW:[{newTrait.name}]<br />
      NEWVAL:[{newTrait.values}]<br />
      {_.map(traits, (trait) => {
        return <div key={trait.name}>
          {trait.name}
          <button style={{ marginLeft: '1em' }} onClick={() => {
            setNewTrait(trait);
            deleteTrait(trait);
          }}>
            ✏️
          </button>
          <button
            onClick={() => { deleteTrait(trait) }}
          > 🗑️
          </button>
          <br /> {trait.values.map(val => {
            return <div key={trait.name + '-' + val}>
              <span style={{ marginLeft: '1em' }}>{val}</span> <button onClick={() => {
                setTrait(trait.name);
                setTraitValue(val);
              }}>🖌️</button><br />
            </div>
          })}
        </div>
      })}
      {_.isObject(newTrait) && _.isString(newTrait.name) ? null :
        <button onClick={(e) => {
          setNewTrait({
            name: "",
            values: []
          })
          e.preventDefault();
        }}> add new trait </button>}


      {_.isObject(newTrait) && _.isString(newTrait.name) ?
        <>
          <input autoFocus value={newTrait.name} placeholder="new trait name"
            onChange={(event) => {
              setNewTrait({
                name: event.target.value,
                values: newTrait.values
              })
            }}
            onKeyUp={(event) => {
              console.log(event.key);
              if (event.key === "Enter") {
                if (canCreateNewTrait()) {
                  addTrait(newTrait);
                } else {
                  console.log('cannot create new trait', newTrait)

                  setNewTrait({
                    ...newTrait,
                    values: [...newTrait.values, ""]
                  })
                }
              }

            }}>
          </input>
          <br />
          {newTrait.values.map((val, i) => {
            return <label
              key={i}
              style={{ marginLeft: '2em', display: 'block' }}>
              trait value: <input autoFocus value={val} onChange={
                (event) => {
                  newTrait.values[i] = event.target.value;
                  setNewTrait({
                    ...newTrait
                  })
                }
              }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setNewTrait({
                      ...newTrait,
                      values: [...newTrait.values, ""]
                    });
                  }
                }}
              ></input>
              <button onClick={
                () => {
                  newTrait.values.splice(i, 1);
                  setNewTrait({
                    ...newTrait
                  });
                }
              }>🗑️</button>
            </label>
          })}
          <button style={{
            marginLeft: '2em'
          }} onClick={() => {
            setNewTrait({
              ...newTrait,
              values: [...newTrait.values, ""]
            })
          }}>add</button>
          <br />
          <button onClick={() => {
            if (canCreateNewTrait()) {
              addTrait(newTrait);
            }
          }}
            disabled={!canCreateNewTrait()}>finish: {newTrait.name}</button>
        </>
        : null
      }






    </>
  )

}

export default Traits