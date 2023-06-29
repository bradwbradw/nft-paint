
import './App.css';
import _ from './_';

import Traits from './components/Traits';
import CanvasEditor from './components/CanvasEditor';
import Preview from './components/Preview';

import Pane from './components/Pane';
import { useState } from 'react';

function App() {

  const [trait, setTrait] = useState(null);
  const [traitValue, setTraitValue] = useState(null);

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
          trait={trait}
          setTrait={setTrait}
          traitValue={traitValue}
          setTraitValue={setTraitValue}
        />
      </Pane>
      <Pane>
        <Preview traits={{}} />

      </Pane>
    </div>

    <CanvasEditor trait={trait} traitValue={traitValue} />
  </>);
}

export default App;