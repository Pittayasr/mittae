declare module "pdfjs-dist/webpack.mjs" {
  import {
    PDFDocumentProxy,
    PDFPageProxy,
    
    PDFDataRangeTransport,
    PDFWorker,
  } from "pdfjs-dist";

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(
    src: string | Uint8Array | PDFDataRangeTransport | { url: string }
  ): Promise<PDFDocumentProxy>;

  export { PDFDocumentProxy, PDFPageProxy, PDFWorker };
}
