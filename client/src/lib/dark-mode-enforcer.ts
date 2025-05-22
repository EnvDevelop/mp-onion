/**
 * This utility forces dark mode across the entire application
 * It injects styles and adds necessary classes to ensure dark theme is always applied
 */

// Function to add dark mode classes to the document
export function enforceDarkMode() {
  // Set the HTML element class
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Ensure body has dark background
  document.body.style.backgroundColor = '#121212';
  document.body.style.color = '#ffffff';
  document.body.classList.add('dark-mode', 'bg-background', 'text-foreground');
  
  // Set color scheme at CSS level
  document.documentElement.style.colorScheme = 'dark';
  
  // Create and inject a style element to enforce dark mode globally
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :root {
      color-scheme: dark !important;
    }
    html, body, #root {
      background-color: #121212 !important;
      color: #ffffff !important;
    }
    .bg-white, .bg-gray-50, .bg-gray-100 {
      background-color: #1e1e1e !important;
    }
    .text-black, .text-gray-900, .text-gray-800 {
      color: #ffffff !important;
    }
    input, select, textarea {
      background-color: #2d2d2d !important;
      color: #ffffff !important;
      border-color: #333333 !important;
    }
    /* Override any inline white backgrounds */
    [style*="background-color: white"], 
    [style*="background-color: #fff"],
    [style*="background:#fff"] {
      background-color: #1e1e1e !important;
    }
  `;
  document.head.appendChild(styleEl);
  
  // Observer to ensure dark mode stays enabled if DOM changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const htmlEl = document.documentElement;
        if (!htmlEl.classList.contains('dark')) {
          htmlEl.classList.add('dark');
        }
      }
    }
  });
  
  // Start observing the document for class changes
  observer.observe(document.documentElement, { attributes: true });
  
  // Handle any light theme applications in existing elements
  document.querySelectorAll('[class*="light"], [class*="white"]').forEach(el => {
    el.classList.add('dark');
    (el as HTMLElement).style.backgroundColor = '#1e1e1e';
    (el as HTMLElement).style.color = '#ffffff';
  });
}

// Execute the function when imported
enforceDarkMode(); 