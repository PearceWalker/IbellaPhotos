// Function to check if an element is in the viewport
function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to add a class when the element is in the viewport
function addClassOnScroll() {
    var textHero = document.querySelector('.text-hero');
    if (isInViewport(textHero)) {
        textHero.classList.add('show');
    }
}

// Add event listener for scroll event
window.addEventListener('scroll', addClassOnScroll);

// Initially call the function in case the element is already in view when the page loads
addClassOnScroll();
