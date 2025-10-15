import { BrowserMultiFormatReader } from '@zxing/library';

export class BarcodeScanner {
  private reader: BrowserMultiFormatReader;
  private stream: MediaStream | null = null;

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  

  async startScanning(videoElement: HTMLVideoElement, onResult: (result: string) => void, onError: (error: Error) => void) {
    try {
      // Get user media
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Use back camera if available
        }
      });

      videoElement.srcObject = this.stream;
      await videoElement.play();

      // Start decoding
      this.reader.decodeFromVideoDevice(undefined, videoElement, (result, error) => {
        if (result) {
          onResult(result.getText());
        }
        if (error && error.name !== 'NotFoundException' && !error.message.includes('No MultiFormat Readers were able to detect the code')) {
          onError(new Error(error.message));
        }
      });
    } catch (error) {
      onError(error as Error);
    }
  }

  stopScanning() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.reader.reset();
  }
}

export const barcodeScanner = new BarcodeScanner();