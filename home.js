const carouselImages = document.querySelector('.carousel-images');
let currentIndex = 0;

// Get the total number of images
const totalImages = document.querySelectorAll('.carousel-image').length;

// Set an interval for automatic image sliding
const autoSlideInterval = 5000; //  seconds

// Function to update the carousel position
function updateCarousel() {
    const offset = -currentIndex * 100; // Move images by 100% per slide
    carouselImages.style.transform = `translatex(${offset}%)`;
}

// Automatically move to the next image every 5 seconds
setInterval(() => {
    currentIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
    updateCarousel();
}, autoSlideInterval);

// Initial setup for smooth transitions
carouselImages.style.transition = 'transform 1.5s ease-in-out';
updateCarousel();
