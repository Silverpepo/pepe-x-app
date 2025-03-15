// Type definitions for GSAP and ScrollTrigger

interface GSAPStatic {
  to: (target: any, vars: any) => GSAPTween;
  from: (target: any, vars: any) => GSAPTween;
  fromTo: (target: any, fromVars: any, toVars: any) => GSAPTween;
  set: (target: any, vars: any) => GSAPTween;
  timeline: (vars?: any) => GSAPTimeline;
  registerPlugin: (...args: any[]) => void;
  utils: {
    toArray: (selector: string | any | any[]) => any[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface GSAPTween {
  to: (target: any, vars: any) => GSAPTween;
  from: (target: any, vars: any) => GSAPTween;
  fromTo: (target: any, fromVars: any, toVars: any) => GSAPTween;
  set: (target: any, vars: any) => GSAPTween;
  kill: () => void;
  pause: () => GSAPTween;
  play: () => GSAPTween;
  progress: (value?: number) => number | GSAPTween;
  restart: (includeDelay?: boolean, suppressEvents?: boolean) => GSAPTween;
  resume: () => GSAPTween;
  reverse: (from?: boolean) => GSAPTween;
  timeScale: (value?: number) => number | GSAPTween;
  [key: string]: any;
}

interface GSAPTimeline extends GSAPTween {
  to: (target: any, vars: any, position?: any) => GSAPTimeline;
  from: (target: any, vars: any, position?: any) => GSAPTimeline;
  fromTo: (target: any, fromVars: any, toVars: any, position?: any) => GSAPTimeline;
  add: (child: any, position?: any) => GSAPTimeline;
  set: (target: any, vars: any, position?: any) => GSAPTimeline;
  [key: string]: any;
}

interface ScrollTriggerStatic {
  create: (vars: any) => ScrollTriggerInstance;
  getAll: () => ScrollTriggerInstance[];
  refresh: (hard?: boolean) => void;
  update: (forceRefresh?: boolean) => void;
  killAll: (silent?: boolean) => void;
  addEventListener: (type: string, callback: Function) => void;
  removeEventListener: (type: string, callback: Function) => void;
}

interface ScrollTriggerInstance {
  kill: (reset?: boolean) => void;
  refresh: () => void;
  disable: (reset?: boolean) => void;
  enable: (reset?: boolean, suppressEvents?: boolean) => void;
  update: (recordVelocity?: boolean) => void;
  [key: string]: any;
}

interface Window {
  gsap: GSAPStatic;
  ScrollTrigger: ScrollTriggerStatic;
  dispatchEvent(event: Event): boolean;
}

// Add SVG element types
interface SVGGraphicsElement extends SVGElement {
  getBBox(options?: {
    fill?: boolean;
    stroke?: boolean;
    markers?: boolean;
    clipped?: boolean;
  }): DOMRect;
}
