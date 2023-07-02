document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const prevArrow = document.querySelector('.arrow.prev');
    const nextArrow = document.querySelector('.arrow.next');
    const itemWidth = document.querySelector('.carousel-item').offsetWidth;
    const visibleItems = Math.floor(carousel.parentElement.offsetWidth / itemWidth);
  
    let currentIndex = 0;
  
    function moveCarousel(direction) {
      if (direction === 'prev') {
        currentIndex = Math.max(currentIndex - 1, 0);
      } else if (direction === 'next') {
        currentIndex = Math.min(currentIndex + 1, carousel.children.length - visibleItems);
      }
  
      carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
  
    prevArrow.addEventListener('click', () => moveCarousel('prev'));
    nextArrow.addEventListener('click', () => moveCarousel('next'));
  });