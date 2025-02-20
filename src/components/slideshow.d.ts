// slideshow.d.ts
declare module "../components/slideshow.js" {
    export class Slideshow {
        constructor(DOM_el: HTMLElement);
        navigate(direction: number): void;
        goToSlide(index: number): void;
        showContent(): void;
        hideContent(): void;
        initEvents(): void;
    }
}

export {};