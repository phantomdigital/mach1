declare module "gsap/SplitText" {
  export interface SplitTextVars {
    type?: string;
    linesClass?: string;
    autoSplit?: boolean;
    mask?: string;
    onSplit?: (self: SplitTextInstance) => void | gsap.core.Tween;
  }

  export interface SplitTextInstance {
    lines: HTMLElement[];
    words: HTMLElement[];
    chars: HTMLElement[];
    revert: () => void;
  }

  export class SplitText {
    constructor(target: gsap.TweenTarget, vars?: SplitTextVars);
    static create(target: gsap.TweenTarget, vars?: SplitTextVars): SplitTextInstance;
    lines: HTMLElement[];
    words: HTMLElement[];
    chars: HTMLElement[];
    revert(): void;
  }
}

