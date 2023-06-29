
import './App.css';
import _ from './_';

import Traits from './components/Traits';
import CanvasEditor from './components/CanvasEditor';
import Preview from './components/Preview';
import Pane from './components/Pane';
import Persistance from './modules/Persistance';

import { useState } from 'react';

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
        />
      </Pane>
      <Pane>
        <Preview imageMap={imageMap} traits={{}} />

      </Pane>
    </div>

    <CanvasEditor trait={trait} traitValue={traitValue} />
  </>);
}

export default App;