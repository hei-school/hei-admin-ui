declare module "dom-to-image-more" {
  export interface Options {
    bgcolor?: string;
    height?: number;
    width?: number;
    quality?: number;
    style?: Record<string, string>;
    filter?: (node: HTMLElement) => boolean;
    imagePlaceholder?: string;
    cacheBust?: boolean;
  }

  export const toPng: (node: HTMLElement, options?: Options) => Promise<string>;
  export const toJpeg: (
    node: HTMLElement,
    options?: Options
  ) => Promise<string>;
  export const toBlob: (node: HTMLElement, options?: Options) => Promise<Blob>;
  export const toSvg: (node: HTMLElement, options?: Options) => Promise<string>;

  const domtoimage: {
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toBlob: typeof toBlob;
    toSvg: typeof toSvg;
  };

  export default domtoimage;
}
