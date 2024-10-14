declare module "jquery" {
    const $: any;
    export default $;
  }
  
  declare module "bootstrap-datepicker" {
    export default function datepicker(element: any, options?: any): any;
  }
  