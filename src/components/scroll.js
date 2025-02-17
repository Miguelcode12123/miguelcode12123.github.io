import { preloadImages } from '../utils.js'; // Utility function to preload images
import { Slideshow } from './slideshow.js';

const slideshow = new Slideshow(document.querySelector('.slideshow'));

// Select all navigation buttons
const navButtons = document.querySelectorAll('.frame__nav-button');

// Attach event listeners to navigation buttons
navButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const targetIndex = parseInt(button.dataset.slide, 10); // Get slide index from data attribute
        slideshow.setCurrentSlide(targetIndex); // Update slideshow to the selected slide
    });
});

// Maintain GSAP Observer functionality for wheel & touch-based navigation
gsap.registerPlugin(Observer);

Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onUp: () => slideshow.navigate(1),   // Move forward
    onDown: () => slideshow.navigate(-1) // Move backward
});