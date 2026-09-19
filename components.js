export const globalHeader = `
  <header class="header">
    <div class="container header-container">
      <a href="index.html" class="logo">
        <span>AI</span>RIGS
      </a>
      <nav class="nav">
        <ul class="nav-links">
          <li><a href="hardware.html">Hardware</a></li>
          <li><a href="software.html">Software</a></li>
          <li><a href="service.html">Services</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme" title="Toggle between Dark and Light mode">
          <!-- Sun Icon for switching to Light mode -->
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <!-- Moon Icon for switching to Dark mode -->
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        </button>
        <button class="mobile-menu-btn" aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>
`;

export const globalFooter = `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo"><span>AI</span>RIGS</a>
      </div>
      <div class="footer-links">
        <h4>Products</h4>
        <ul>
          <li><a href="hardware.html">Hardware</a></li>
          <li><a href="software.html">Software</a></li>
          <li><a href="service.html">Services</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>External links</h4>
        <ul>
          <li><a href="#" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="#" target="_blank" rel="noopener">Twitter</a></li>
          <li><a href="#" target="_blank" rel="noopener">GitHub</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 AI Rigs. All rights reserved.</p>
      </div>
    </div>
  </footer>
`;



