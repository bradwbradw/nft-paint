
import { useEffect, useState } from 'react';
import _ from '../_';

function Traits({ trait, setTrait, traitValue, setTraitValue }) {

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
          {trait.name} <br /> {trait.values.map(val => {
            return <div key={trait.name + '-' + val}>
              <span style={{ marginLeft: '1em' }}>{val}</span> <button onClick={() => {
                setTrait(trait.name);
                setTraitValue(val);
              }}>🖌️</button><br />
            </div>
          })}
          <button onClick={() => {

          }}>
            ✏️
          </button>
          <button
            onClick={() => { deleteTrait(trait) }}
          > 🗑️
          </button>
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
          <input value={newTrait.name} placeholder="new trait name"
            onChange={(event) => {
              setNewTrait({
                name: event.target.value,
                values: newTrait.values
              })
            }}>
          </input>
          <br />
          {newTrait.values.map((val, i) => {
            return <input key={i} value={val} onChange={
              (event) => {
                newTrait.values[i] = event.target.value;
                setNewTrait({
                  ...newTrait
                })
              }
            }></input>
          })}
          <button onClick={() => {
            setNewTrait({
              ...newTrait,
              values: [...newTrait.values, ""]
            })
          }}>add trait value</button>
          <button onClick={() => {
            if (canCreateNewTrait()) {
              addTrait(newTrait);
            }
          }}
            disabled={!canCreateNewTrait()}>finish: {newTrait.name}</button>
        </>
        : null}






    </>
  )

}

export default Traits