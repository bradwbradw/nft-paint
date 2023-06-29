
import './App.css';
import _ from 'lodash';

import Traits from './components/Traits';
import CanvasEditor from './components/CanvasEditor';
import Preview from './components/Preview';
import Pane from './components/Pane';
import Persistance from './module/Persistance';

import { useState, useEffect } from 'react';

function App() {
  //Persistance.remove('imageMap');
  const [traits, setTraits] = useState(Persistance.load('traits', []));

  useEffect(() => {
    Persistance.save('traits', traits)
  }, [traits]);

  const [trait, setTrait] = useState(null);
  const [traitValue, setTraitValue] = useState(null);
  const [imageMap, setImageMap] = useState(Persistance.load('imageMap', {}));

  useEffect(() => {
    if (!_.isEmpty(imageMap)) {
      console.log('persist', _.keys(imageMap));
      Persistance.save('imageMap', imageMap);
    }
  }, [imageMap]);

  return (<>
    <h2>nft paint</h2>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        //        justifyContent: 'space-evenly',
        width: '100%',
        background: 'green'
      }}
    >
      <Pane>
        <Traits
          traits={traits}
          setTraits={setTraits}
          trait={trait}
          setTrait={setTrait}
          traitValue={traitValue}
          setTraitValue={setTraitValue}
          setImageMap={setImageMap}
        />
      </Pane>
      <Pane>
        <Preview imageMap={imageMap} traits={traits} />

      </Pane>
    </div>

    <CanvasEditor
      trait={trait}
      traitValue={traitValue}
      imageMap={imageMap}
      setImageMap={setImageMap}
    />
  </>);
}

export default App;