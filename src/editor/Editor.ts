import Brush from '../tools/Brush';
import Tool from '../tools/Tool';
import imageService from '../sarvices/imageService';
import { IpcRendererEvent } from 'electron/renderer';

export default class Editor {
  xs: number = 0;
  xf: number = 0;
  ys: number = 0;
  yf: number = 0;
  setSize: Function | null = null; 
  redraw: Function | null = null;
  currentTool: Tool = new Brush();
  isDrawing: boolean = false;
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  savedImg: string;
  restoredImage: HTMLImageElement = new Image();
  openedImg: HTMLImageElement = new Image();
  unDoList: string[] = [];
  reDoList: string[] = [];

  constructor() {
    this.savedImg = '';
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.openImage = this.openImage.bind(this);
  }

  chooseTool(tool: Tool) {
    this.currentTool = tool;
  }

  setCanvas(canvas: HTMLCanvasElement, setSize: Function, redraw: Function) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.setSize = setSize;
    this.redraw = redraw;
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mouseup', this.onMouseUp);
    window.electron.onSaveAs((event: IpcRendererEvent, path: string) => {
      if(!this.canvas) return;
      imageService.saveCanvasImage(event, this.canvas, path);
    });
    window.electron.onOpenFile((event: IpcRendererEvent, data: string, extantion:string) => {
      const openedImg: HTMLImageElement = imageService.openImage(event, data, extantion);
      openedImg.onload = () => {
        this.openImage(openedImg.width, openedImg.height, openedImg);
      }
    });
  }

  openImage(width: number, height: number, image: HTMLImageElement){
    if (!this.canvas) return;
    if (width > 2000) width = 2000;
    if (height > 2000) height = 2000;
    this.ctx = this.canvas.getContext('2d');
    if (this.ctx && this.setSize) {
      this.setSize({
        width,
        height,
      });
    }
    this.openedImg = image;
    if(!this.redraw) return;
    this.redraw();
  }

  drawImage(){
    if(!this.openedImg.src) return;
    if(!this.canvas) return;
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx?.drawImage(this.openedImg, 0, 0);
  }

  openBlank(width: number, height: number){
    if(!this.setSize) return;
    const w = width || 1000;
    const h = height || 600;
    this.setSize({ height: h, width: w });
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      this.ctx = ctx;
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.openedImg.src = '';
  }

  onMouseDown(e: MouseEvent) {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    if (!this.currentTool) return;
    this.savedImg = this.canvas.toDataURL();
    this.restoredImage.src = this.savedImg;
    this.unDoList.push(this.savedImg);
    this.reDoList = [];
    this.isDrawing = true;
    this.ctx.beginPath();
    const target: any = e.target;
    const [x, y] = [e.pageX - target.offsetLeft, e.pageY - target.offsetTop];
    this.xs = x;
    this.ys = y;
  }
  onMouseMove(e: MouseEvent) {
    if (!this.canvas) return;
    if (!this.ctx) return;
    if (!this.isDrawing) return;
    const target: any = e.target;
    const [x, y] = [e.pageX - target.offsetLeft, e.pageY - target.offsetTop];
    this.xf = x;
    this.yf = y;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restoreImage();
    this.currentTool.set(this.xs, this.ys, this.xf, this.yf);
    this.currentTool.draw(this.ctx as CanvasRenderingContext2D);
  }

  onClick(e: MouseEvent) {
    if(this.currentTool instanceof Text){
      
    }
  }

  restoreImage() {
    if (!this.canvas) return;
    this.ctx?.drawImage(
      this.restoredImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  onMouseUp(e: MouseEvent) {
    if (!this.canvas) return;
    this.isDrawing = false;
  }

  reDo() {
    if (!this.canvas) return;
    const imgSrc = this.reDoList.pop();
    if (!imgSrc) return;
    const img = new Image();
    img.src = imgSrc;
    this.unDoList.push(this.canvas.toDataURL());
    img.onload = () => {
      if (!this.canvas) return;
      const ctx = this.canvas.getContext('2d');
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  unDo() {
    if (!this.canvas) return;
    const imgSrc = this.unDoList.pop();
    if (!imgSrc) return;
    const img = new Image();
    img.src = imgSrc;
    this.reDoList.push(this.canvas.toDataURL());
    img.onload = () => {
      if (!this.canvas) return;
      const ctx = this.canvas.getContext('2d');
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }
}
