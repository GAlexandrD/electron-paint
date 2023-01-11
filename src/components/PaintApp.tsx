import React, { useState } from 'react';
import EditorProvider from './EditorProvider';
import Canvas from './Canvas';
import Settings from './Settings';
import Toolbar from './Toolbar';
import classes from './../styles/App.module.scss';
import CreateModal from './CreateModal';

function PaintApp() {
  const [isCreate, setIsCreate] = useState(false);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [val, setVal] = useState(false);
  const redraw = () => setVal(prev => !prev);
  window.electron.onCreate(() => {
    setIsCreate(true);
  });
  return (
    <EditorProvider>
      {isCreate && (
        <CreateModal
          closeModal={() => setIsCreate(false)}
          setSize={setSize}
        ></CreateModal>
      )}
      <div className={classes.App}>
        <Toolbar />
        <Settings />
        <Canvas
          redrawFlag= {val}
          width={size.width}
          height={size.height}
          setSize={setSize}
          redraw={redraw}
        />
      </div>
    </EditorProvider>
  );
}

export default PaintApp;
