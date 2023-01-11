import { FC, useState } from 'react';
import classes from '../styles/CreateModal.module.scss';
import { useEditor } from './EditorProvider';

interface ModalProps {
  closeModal: Function;
  setSize: Function;
}

const CreateModal: FC<ModalProps> = ({ closeModal }) => {
  const { editor } = useEditor();
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(600);
  const onOkClick = () => {
    editor.openBlank(width, height);
    closeModal();
  };
  const onCancel = () => {
    closeModal();
  };

  const onHeight = (e: any) => {
    if (e.target.value > 2000) {
      setHeight(2000);
    } else if (e.target.value < 0) {
      setHeight(0);
    } else setHeight(e.target.value);
  };
  const onWidth = (e: any) => {
    if (e.target.value > 2000) {
      setWidth(2000);
    } else if (e.target.value < 0) {
      setHeight(0);
    } else setWidth(e.target.value);
  };
  return (
    <div
      className={classes.container}
      onClick={(e) => {
        closeModal();
        e.stopPropagation();
      }}
    >
      <div className={classes.content} onClick={(e) => e.stopPropagation()}>
        <div className={classes.size}>
          <div className={classes.width}>
            Height{' '}
            <input value={height} type={'number'} onChange={onHeight}></input>
          </div>
          <div className={classes.height}>
            Width{' '}
            <input value={width} type={'number'} onChange={onWidth}></input>
          </div>
        </div>
        <div className={classes.btns}>
          <button className={classes.btn} onClick={onCancel}>
            Cancel
          </button>
          <button className={classes.btn} onClick={onOkClick}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
