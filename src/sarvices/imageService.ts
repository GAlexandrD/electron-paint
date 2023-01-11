import { IpcRendererEvent } from 'electron';

class ImageService {
  saveCanvasImage(event: IpcRendererEvent, canvas: HTMLCanvasElement, path: string) {
    if(!canvas) return;
    let data;
    const extantion = path.split('.')[1];
    if (extantion === 'png') {
      data = canvas.toDataURL('image/png');
      data = data.replace('data:image/png;base64,', '');
      event.sender.send('image-data', data, path);
    }
    if (extantion === 'jpg') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgJpeg = new Image();
        const restoredImage = canvas.toDataURL();
        imgJpeg.src = restoredImage;
        imgJpeg.onload = () => {
          ctx.fillStyle = '#ffffff';
          if (!canvas) return;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgJpeg, 0, 0);
          data = canvas.toDataURL('image/jpeg');
          data = data.replace('data:image/jpeg;base64,', '');
          event.sender.send('image-data', data, path);
        };
      }
    }
  }

  openImage(
    event: IpcRendererEvent,
    data: string,
    extantion: string,
  ) {
    const image: HTMLImageElement = new Image(); 
    let ext = extantion === 'png' ? 'png' : 'jpeg';
    image.src = `data:image/${ext};base64,` + data;
    return image;
  }
}

export default new ImageService();
