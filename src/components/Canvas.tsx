import React, { FC, MutableRefObject, useEffect, useRef } from 'react';
import classes from '../styles/Canvas.module.scss';
import { useEditor } from './EditorProvider';

interface CanvasProps {
  width: number;
  height: number;
  setSize: Function;
  redrawFlag: boolean;
  redraw: Function;
}

const Canvas: FC<CanvasProps> = ({ width, height, setSize, redrawFlag, redraw  }) => {
  const { editor } = useEditor();
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>; 
  useEffect(() => {
    editor.setCanvas(canvasRef.current, setSize, redraw);
  }, []);

  useEffect(() => {
    editor.drawImage();
    console.log('redraw')
  }, [height, width, redrawFlag]);
  return (
    <div className={classes.container}>
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        width={width || 1000}
        height={height || 600}
      ></canvas>
      <div></div>
    </div>
  );
};

export default Canvas;
