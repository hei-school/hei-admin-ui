// missing typings workaround

declare module "cypress-sonarqube-reporter/mergeReports" {
  export default function mergeReports(results: any, options?: any): any;
}

declare module "cypress-vite" {
  export default function vitePreprocessor(): any;
}
