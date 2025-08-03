// Page Transition on Scroll/Slide
document.addEventListener('DOMContentLoaded', function() {
  // Define the page sequence
  const pages = [
    'index.html',
    'features.html',
    'about.html',
    'contact.html'
  ];
  
  // Get current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set up scroll detection variables
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollTop = 0;
  let scrollDirection = null;
  let scrollThreshold = 100; // How much to scroll before triggering page change
  let scrollExcess = 0;
  
  // Handle scroll events
  window.addEventListener('scroll', function() {
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Determine scroll direction
    scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollTop;
    
    // Check if we're at the bottom of the page
    if (scrollDirection === 'down' && scrollTop + clientHeight >= scrollHeight) {
      scrollExcess += 10; // Increment excess scroll
      
      if (scrollExcess > scrollThreshold) {
        // Navigate to next page based on current page
        if (currentPage === 'index.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'features.html') {
          navigateWithTransition('about.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('contact.html');
        }
      }
    }
    // Check if we're at the top of the page
    else if (scrollDirection === 'up' && scrollTop <= 0) {
      scrollExcess += 10; // Increment excess scroll
      
      if (scrollExcess > scrollThreshold) {
        // Navigate to previous page based on current page
        if (currentPage === 'features.html') {
          navigateWithTransition('index.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'contact.html') {
          navigateWithTransition('about.html');
        }
      }
    } else {
      scrollExcess = 0; // Reset excess scroll if not at top or bottom
    }
    
    // Reset scroll detection after a delay
    scrollTimeout = setTimeout(function() {
      scrollExcess = 0;
    }, 200);
  });
  
  // Handle mousewheel events for more responsive detection
  window.addEventListener('wheel', function(e) {
    if (isScrolling) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // At bottom of page and scrolling down
    if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) {
      scrollExcess += Math.abs(e.deltaY);
      
      if (scrollExcess > scrollThreshold) {
        if (currentPage === 'index.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'features.html') {
          navigateWithTransition('about.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('contact.html');
        }
      }
    }
    // At top of page and scrolling up
    else if (e.deltaY < 0 && scrollTop <= 5) {
      scrollExcess += Math.abs(e.deltaY);
      
      if (scrollExcess > scrollThreshold) {
        if (currentPage === 'features.html') {
          navigateWithTransition('index.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'contact.html') {
          navigateWithTransition('about.html');
        }
      }
    } else {
      scrollExcess = 0;
    }
  });
  
  // Handle touch events for mobile
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;
  let touchExcess = 0;
  let touchThreshold = 80; // Lower threshold for touch devices
  let touchTimeThreshold = 200; // Lower time threshold in ms
  
  window.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchStartTime = new Date().getTime();
    touchExcess = 0;
  });
  
  window.addEventListener('touchmove', function(e) {
    if (isScrolling) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    
    // Only accumulate excess when at boundaries
    if ((deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) || 
        (deltaY < 0 && scrollTop <= 5)) {
      touchExcess += Math.abs(deltaY) / 10; // Divide by 10 to add resistance
    } else {
      touchExcess = 0;
    }
  });
  
  window.addEventListener('touchend', function(e) {
    if (isScrolling) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Check if horizontal or vertical swipe
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    // Handle horizontal swipes
    if (isHorizontalSwipe && Math.abs(deltaX) > 100 && touchDuration > touchTimeThreshold) {
      // Swipe left (next page)
      if (deltaX > 0) {
        if (currentPage === 'index.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'features.html') {
          navigateWithTransition('about.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('contact.html');
        }
      }
      // Swipe right (previous page)
      else if (deltaX < 0) {
        if (currentPage === 'features.html') {
          navigateWithTransition('index.html');
        } else if (currentPage === 'about.html') {
          navigateWithTransition('features.html');
        } else if (currentPage === 'contact.html') {
          navigateWithTransition('about.html');
        }
      }
      return;
    }
    
    // Handle vertical swipes
    // Minimum swipe distance and not too fast (to prevent accidental swipes)
    if (Math.abs(deltaY) < 100 || touchDuration < touchTimeThreshold) return;
    
    // Check if we've accumulated enough excess scroll
    if (touchExcess < touchThreshold) return;
    
    // Swipe down at top of page
    if (deltaY < 0 && scrollTop <= 5) {
      if (currentPage === 'features.html') {
        navigateWithTransition('index.html');
      } else if (currentPage === 'about.html') {
        navigateWithTransition('features.html');
      } else if (currentPage === 'contact.html') {
        navigateWithTransition('about.html');
      }
    }
    // Swipe up at bottom of page
    else if (deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) {
      if (currentPage === 'index.html') {
        navigateWithTransition('features.html');
      } else if (currentPage === 'features.html') {
        navigateWithTransition('about.html');
      } else if (currentPage === 'about.html') {
        navigateWithTransition('contact.html');
      }
    }
  });
  
  // Function to navigate with transition effect
  function navigateWithTransition(targetPage) {
    if (isScrolling) return;
    isScrolling = true;
    
    // Add exit animation class
    document.body.classList.add('page-exit');
    
    // Navigate after animation completes
    setTimeout(function() {
      window.location.href = targetPage;
    }, 500);
  }
  
  // Make the function globally available
  window.navigateWithTransition = navigateWithTransition;
});