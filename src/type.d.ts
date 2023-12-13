declare interface Navigator {
  readonly connection?: EventTarget;
  readonly getBattery?: () => Promise<any>;
  readonly contacts?: any;
  readonly share?: any;
}

declare interface Window {
  readonly EyeDropper?: any;
}
