// Navbar scroll effect
let lastScrollY = window.scrollY;
const navbar = document.getElementById('main-navbar');
let ticking = false;

function handleNavbarScroll() {
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    navbar.classList.remove('relative', 'bg-white/40', 'dark:bg-white/10', 'backdrop-blur-md', 'mx-4', 'rounded-full', 'max-w-6xl');
    navbar.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'bg-white/80', 'dark:bg-gray-900/80', 'backdrop-blur-xl', 'shadow-lg', 'mx-0', 'rounded-none', 'w-full');
  } else {
    navbar.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'bg-white/80', 'dark:bg-gray-900/80', 'backdrop-blur-xl', 'shadow-lg', 'mx-0', 'rounded-none', 'w-full');
    navbar.classList.add('relative', 'bg-white/40', 'dark:bg-white/10', 'backdrop-blur-md', 'mx-4', 'rounded-full', 'max-w-6xl');
  }
  
  ticking = false;
}

function requestNavbarTick() {
  if (!ticking) {
    window.requestAnimationFrame(handleNavbarScroll);
    ticking = true;
  }
}

window.addEventListener('scroll', requestNavbarTick);

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  });
}

if (mobileMenuClose && mobileMenu) {
  mobileMenuClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = ''; // Restore body scroll
  });
  
  // Close on background click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = ''; // Restore body scroll
    }
  });
}

// Add to cart forms
document.querySelectorAll('.add-to-cart-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update cart count
        const cartResponse = await fetch('/cart.js');
        const cart = await cartResponse.json();
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
          cartCount.textContent = cart.item_count;
        }
        
        button.innerHTML = '<svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-blue-600');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('bg-green-600');
          button.classList.add('bg-blue-600');
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error('Error al agregar al carrito');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      button.innerHTML = '❌ Error';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 2000);
    }
  });
});

// Wishlist button (placeholder functionality)
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const svg = btn.querySelector('svg');
    const isFilled = svg.getAttribute('fill') !== 'none';
    
    if (isFilled) {
      svg.setAttribute('fill', 'none');
    } else {
      svg.setAttribute('fill', 'currentColor');
    }
  });
});

// Sort functionality for collection page
const sortSelect = document.getElementById('SortBy');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.target.value);
    window.location.href = url.toString();
  });
  
  // Set current sort value
  const urlParams = new URLSearchParams(window.location.search);
  const currentSort = urlParams.get('sort_by');
  if (currentSort) {
    sortSelect.value = currentSort;
  }
}
