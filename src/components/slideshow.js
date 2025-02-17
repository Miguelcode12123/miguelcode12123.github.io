import gsap from "gsap";
import { Observer } from "gsap/Observer"; 

/** Direction constants */
const NEXT = 1;
const PREV = -1;

/**
 * Slideshow Class
 * Manages slideshow functionality including navigation and animations.
 * @export
 */
export class Slideshow {
    DOM = {
        el: null,
        slides: null,
        img: null,
		imgInner: null,
		content: null,
		contentImg: null,
		contentTexts: null,
        navButtons: null, 
		backButton: null,
    };

    current = 0;
    slidesTotal = 0;
    isAnimating = false;
	isContentOpen = false;

	constructor(DOM_el) {
        this.DOM.el = DOM_el;
        this.DOM.slides = [...this.DOM.el.querySelectorAll('.slide')];
		this.DOM.inner = this.DOM.el.querySelector('.slide__inner');
        this.DOM.img = this.DOM.slides.map(item => item.querySelector('.slide__img'));
		this.DOM.imgInner = this.DOM.el.querySelector('.slide__img-inner');
        this.DOM.content = this.DOM.el.querySelector('.slide__content');
        this.DOM.contentImg = this.DOM.content.querySelector('.slide__content-img');
		this.DOM.contentTexts = [...this.DOM.content.children].filter(item => item != this.DOM.contentImg);
        this.DOM.navButtons = document.querySelectorAll('.frame__nav > .frame__nav-button');
        this.DOM.backButton = document.querySelector('.frame__back');
		this.DOM.backChars = this.DOM.backButton.querySelectorAll('.word > .char, .whitespace');

        this.slidesTotal = this.DOM.slides.length;
        this.setCurrentSlide(0);
        this.initEvents();
    }

    setCurrentSlide(index) {
        this.DOM.slides.forEach(slide => slide.classList.remove('slide--current'));
        this.DOM.navButtons.forEach(button => button.classList.remove('frame__nav-button--current'));

        this.current = index;
        this.DOM.slides[this.current].classList.add('slide--current');
        this.DOM.navButtons[this.current].classList.add('frame__nav-button--current');
    }

    navigate(direction) {
        if (this.isAnimating || this.isContentOpen) return false;
        this.isAnimating = true;

        const previous = this.current;
        this.current = (this.current + direction + this.slidesTotal) % this.slidesTotal;

        const currentSlide = this.DOM.slides[previous];
        const currentInner = this.DOM.img[previous];
        const upcomingSlide = this.DOM.slides[this.current];
        const upcomingInner = this.DOM.img[this.current];

        gsap.timeline({
            defaults: { duration: 1.5, ease: 'power4.inOut' },
            onStart: () => {
                this.DOM.slides[this.current].classList.add('slide--current');
                this.updateNavButtons(); 
            },
            onComplete: () => {
                this.DOM.slides[previous].classList.remove('slide--current');
                this.isAnimating = false;
				this.setCurrentSlide(this.current);
            }
        })
        .addLabel('start', 0)
        .to(currentSlide, { yPercent: -direction * 100 }, 'start')
        .to(currentInner, {
            yPercent: direction * 30,
            startAt: { transformOrigin: direction === 1 ? '0% 100%' : '100% 0%', rotation: 0 },
            rotation: -direction * 10,
            scaleY: 2.5
        }, 'start')
        .to(upcomingSlide, { startAt: { yPercent: direction * 100 }, yPercent: 0 }, 'start')
        .to(upcomingInner, {
            startAt: { transformOrigin: direction === 1 ? '0% 0%' : '100% 100%', yPercent: -direction * 30, scaleY: 2.5, rotation: -direction * 10 },
            yPercent: 0,
            scaleY: 1,
            rotation: 0
        }, 'start');
    }

    updateNavButtons() {
        this.DOM.navButtons.forEach(button => button.classList.remove('frame__nav-button--current'));
        this.DOM.navButtons[this.current].classList.add('frame__nav-button--current');
    }

	goToSlide(index) {
        if (this.isAnimating || this.current === index) return;
        this.navigate(index - this.current);
    }

	toggleCursorBackTexts(isContentOpen = false) {
		gsap.timeline({
			onStart: () => {
				// Set initial opacity for cursor chars and back button chars
				gsap.to(this.DOM.backChars, { opacity: isContentOpen ? 1 : 0, ease: 'expo', duration: 0.1 });
				if (isContentOpen) {
					this.DOM.backButton.classList.add('frame__back--show');
				}
			},
			onComplete: () => {
				this.DOM.backButton.classList[isContentOpen ? 'add' : 'remove']('frame__back--show');
			}
		})
		.to(this.DOM.backChars, {
			duration: 0.1,
			ease: 'expo',
			opacity: isContentOpen ? 1 : 0,
			stagger: {
				amount: 0.5,
				grid: 'auto',
				from: 'random'
			}
		}, 0);
	}

	showContent() {
        if (this.isAnimating || this.isContentOpen) return;
        this.isAnimating = true;
        this.isContentOpen = true;
        const slide = this.DOM.slides[this.current];
        
        gsap.timeline({
            defaults: { duration: 1.6, ease: 'power3.inOut' },
            onComplete: () => {
				this.isAnimating = false;
				this.toggleCursorBackTexts(true);
			}
        })
		.addLabel('start', 0)
		.to(slide.querySelector('.slide__img'), { yPercent: -100 }, 'start')
		.set(slide.querySelector('.slide__img-inner'), {
			transformOrigin: '50% 100%'
		}, 'start')
		.to(slide.querySelector('.slide__img-inner'), {
			yPercent: 100,
			scaleY: 2
		}, 'start')
		.to(slide.querySelector('.slide__content-img'), {
			startAt: { transformOrigin: '50% 0%', scaleY: 1.5 },
			scaleY: 1
		}, 'start');
    }

	hideContent() {
        if (!this.isContentOpen) return;
        this.isAnimating = true;
        const slide = this.DOM.slides[this.current];
		this.toggleCursorBackTexts(false);

		const complete = () => {
			this.isAnimating = false;
			this.isContentOpen = false;
		};
	
		// If you want an animation
		if (this.isContentOpen) {
			gsap.timeline({
				defaults: { duration: 1.6, ease: 'power3.inOut' },
				onComplete: complete
			})
			.addLabel('start', 0)
			.to(slide.querySelector('.slide__img'), { yPercent: 0 }, 'start')
			.to(slide.querySelector('.slide__img-inner'), { yPercent: 0, scaleY: 1 }, 'start');
		} 
		// If no animation, reset immediately
		else {
			gsap.set(slide.querySelector('.slide__img'), { yPercent: 0 });
			gsap.set(slide.querySelector('.slide__img-inner'), { yPercent: 0, scaleY: 1 });
			complete();
		}
    }
	

    initEvents() {
        Observer.create({
            type: 'wheel,touch,pointer',
            onDown: () => this.navigate(PREV),
            onUp: () => this.navigate(NEXT),
            wheelSpeed: -1,
            tolerance: 10
        });

        this.DOM.navButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.goToSlide(index));
        });

        if (this.DOM.backButton) {
            this.DOM.backButton.addEventListener('click', () => this.hideContent());
        }

		this.DOM.slides.forEach((slide) => {
			const imgElement = slide.querySelector('.slide__img');
			if (imgElement) {
				imgElement.addEventListener('click', () => this.showContent());
			}
		});
    }
}