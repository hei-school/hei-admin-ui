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

  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;

  const domtoimage: {
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toBlob: typeof toBlob;
    toSvg: typeof toSvg;
  };

  export default domtoimage;
}
