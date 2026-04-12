import { productsData, specDefinitions } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle mock
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      // Toggle logic would go here
      const isHidden = navLinks.style.display === 'none' || navLinks.style.display === '';
      navLinks.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(7, 11, 20, 0.95)';
        navLinks.style.padding = '1rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      }
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(7, 11, 20, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(7, 11, 20, 0.8)';
      header.style.boxShadow = 'none';
    }
  });

  // Form submission handling
  const form = document.getElementById('aiRigForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // In a real app, this would be sent to an API endpoint
      console.log('Lead Generation Data:', data);

      // Simulate API call
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;

        // Show success message
        successMsg.classList.remove('hidden');

        // Hide after 5 seconds
        setTimeout(() => {
          successMsg.classList.add('hidden');
        }, 5000);
      }, 1500);
    });
  }

  function renderProducts(data) {
    const grid = document.getElementById('products-grid');
    const template = document.getElementById('product-card-template');
    const specTemplate = document.getElementById('spec-tooltip-template');
    if (!grid || !template) return;

    grid.innerHTML = '';
    data.forEach(product => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector('.product-card');

      card.dataset.price = product.price;
      card.dataset.modality = product.modality;
      card.dataset.deployment = product.deployment;

      const imgWrapper = clone.querySelector('.product-image');
      if (product.isChipLogo) imgWrapper.classList.add('chip-logo');

      const img = clone.querySelector('.product-img');
      img.src = product.image;
      img.alt = product.imageAlt;

      clone.querySelector('.product-title').textContent = product.title;
      clone.querySelector('.product-description').textContent = product.description;

      // Render specs dynamically using the spec template
      const specList = clone.querySelector('.product-specs');
      Object.keys(specDefinitions).forEach(specKey => {
        const specItem = specList.querySelector(`[data-spec="${specKey}"]`);
        if (specItem && specTemplate) {
          const specClone = specTemplate.content.cloneNode(true);
          const def = specDefinitions[specKey];

          specClone.querySelector('.spec-label').textContent = def.label;
          specClone.querySelector('.tooltip-content').textContent = def.tooltip;
          specClone.querySelector('.spec-value').textContent = product.specs[specKey];

          specItem.appendChild(specClone);
        }
      });

      clone.querySelector('.price-tag').textContent = `From €${product.price.toLocaleString()}`;

      grid.appendChild(clone);
    });
  }


  // --- Catalog Filter & Sort Logic ---
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    // Initial render
    renderProducts(productsData);

    let products = Array.from(productsGrid.querySelectorAll('.product-card'));

    // Sort logic
    const sortSelect = document.getElementById('sort-by');

    // Filter controls
    const minBudgetInput = document.getElementById('min-budget');
    const maxBudgetInput = document.getElementById('max-budget');
    const budgetSliderMin = document.getElementById('budget-slider-min');
    const budgetSliderMax = document.getElementById('budget-slider-max');
    const sliderTrack = document.getElementById('slider-track');
    const modalityCheckboxes = document.querySelectorAll('.use-case-cb');

    // Dynamically set minimum budget based on the cheapest product
    const minPrice = products.length > 0 ? Math.min(...products.map(p => parseInt(p.dataset.price) || 0)) : 0;

    if (minBudgetInput) {
      minBudgetInput.min = minPrice;
      minBudgetInput.value = minPrice;
      minBudgetInput.step = 500;
    }
    if (maxBudgetInput) {
      maxBudgetInput.min = minPrice;
      maxBudgetInput.step = 500;
    }
    if (budgetSliderMin) {
      budgetSliderMin.min = minPrice;
      budgetSliderMin.value = minPrice;
      budgetSliderMin.step = 500;
    }
    if (budgetSliderMax) {
      budgetSliderMax.min = minPrice;
      budgetSliderMax.step = 500;
    }

    function updateSliderTrack() {
      if (!budgetSliderMin || !budgetSliderMax || !sliderTrack) return;
      const minVal = parseInt(budgetSliderMin.value);
      const maxVal = parseInt(budgetSliderMax.value);
      const limitMin = parseInt(budgetSliderMin.min) || 0;
      const limitMax = parseInt(budgetSliderMax.max) || 50000;

      const range = limitMax - limitMin;
      const leftPercent = ((minVal - limitMin) / range) * 100;
      const rightPercent = 100 - ((maxVal - limitMin) / range) * 100;

      sliderTrack.style.left = leftPercent + '%';
      sliderTrack.style.right = rightPercent + '%';
    }

    function handleSliderChange(e) {
      let minVal = parseInt(budgetSliderMin.value);
      let maxVal = parseInt(budgetSliderMax.value);

      if (minVal > maxVal) {
        if (e.target.id === 'budget-slider-min') {
          budgetSliderMin.value = maxVal;
          minVal = maxVal;
        } else {
          budgetSliderMax.value = minVal;
          maxVal = minVal;
        }
      }

      minBudgetInput.value = minVal;
      maxBudgetInput.value = maxVal;

      updateSliderTrack();
      applyFiltersAndSort();
    }

    function handleInputChange(e) {
      const limitMin = parseInt(budgetSliderMin.min) || 0;
      let minVal = parseInt(minBudgetInput.value) || limitMin;
      let maxVal = parseInt(maxBudgetInput.value) || limitMin;
      const maxRange = parseInt(budgetSliderMax.max) || 50000;

      if (minVal > maxVal) {
        if (e.target.id === 'min-budget') {
          minBudgetInput.value = maxVal;
          minVal = maxVal;
        } else {
          maxBudgetInput.value = minVal;
          maxVal = minVal;
        }
      }

      if (minVal < limitMin) minVal = limitMin;
      if (maxVal > maxRange) maxVal = maxRange;

      budgetSliderMin.value = minVal;
      budgetSliderMax.value = maxVal;

      updateSliderTrack();
      applyFiltersAndSort();
    }

    if (budgetSliderMin && budgetSliderMax) {
      budgetSliderMin.addEventListener('input', handleSliderChange);
      budgetSliderMax.addEventListener('input', handleSliderChange);
      minBudgetInput.addEventListener('change', handleInputChange);
      maxBudgetInput.addEventListener('change', handleInputChange);
      updateSliderTrack();
    }

    modalityCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        applyFiltersAndSort();
      });
    });

    const resetUseCasesBtn = document.getElementById('reset-use-cases');
    if (resetUseCasesBtn) {
      resetUseCasesBtn.addEventListener('click', () => {
        modalityCheckboxes.forEach(cb => cb.checked = false);
        applyFiltersAndSort();
      });
    }

    const deploymentSelect = document.getElementById('concurrent-users');
    if (deploymentSelect) {
      deploymentSelect.addEventListener('change', applyFiltersAndSort);
    }

    sortSelect.addEventListener('change', applyFiltersAndSort);

    function applyFiltersAndSort() {
      const limitMin = parseInt(budgetSliderMin.min) || 0;
      const minBudget = parseInt(minBudgetInput.value) || limitMin;
      const maxBudget = parseInt(maxBudgetInput.value) || Infinity;

      const selectedMods = Array.from(modalityCheckboxes)
        .filter(cb => cb.checked);

      const selectedModValues = selectedMods.flatMap(cb => cb.value.split(','));

      const sortBy = sortSelect.value;
      const deploymentType = deploymentSelect ? deploymentSelect.value : 'single';

      // Update active filters UI
      updateActiveFiltersUI(selectedMods, minBudget, maxBudget, deploymentType);

      const productData = products.map(el => {
        return {
          element: el,
          price: parseInt(el.dataset.price) || 0,
          modalities: (el.dataset.modality || '').split(',').map(s => s.trim()),
          deployment: el.dataset.deployment || ''
        };
      });

      // Filter
      const filtered = productData.filter(p => {
        const inBudget = p.price >= minBudget && p.price <= maxBudget;
        let inModality = true;
        if (selectedModValues.length > 0) {
          inModality = p.modalities.some(m => selectedModValues.includes(m));
        }

        let inDeployment = true;
        if (deploymentType === 'multiple') {
          inDeployment = p.deployment !== 'poc-only';
        }

        return inBudget && inModality && inDeployment;
      });

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // Default no-op if no match
      });

      // Hide all products first
      products.forEach(p => p.classList.add('hidden'));

      // Re-append filtered products to change their visual order
      filtered.forEach(p => {
        p.element.classList.remove('hidden');
        productsGrid.appendChild(p.element);
      });
    }

    function updateActiveFiltersUI(selectedMods, minBudget, maxBudget, deploymentType) {
      const bar = document.getElementById('active-filters-bar');
      if (!bar) return;

      bar.innerHTML = '<span class="active-filters-label">Active filters:</span>';

      // If no quick filters are selected, show "Unspecified AI Workload"
      if (selectedMods.length === 0) {
        const span = document.createElement('span');
        span.className = 'filter-tag default-tag';
        span.textContent = 'Unspecified AI workload';
        bar.appendChild(span);
      } else {
        selectedMods.forEach(cb => {
          const label = cb.nextElementSibling.textContent;
          const tag = document.createElement('div');
          tag.className = 'filter-tag';
          tag.innerHTML = `
            ${label}
            <button class="remove-filter">×</button>
          `;
          tag.addEventListener('click', () => {
            cb.checked = false;
            applyFiltersAndSort();
          });
          bar.appendChild(tag);
        });
      }

      // Budget filter tag (only if changed from default)
      const limitMin = parseInt(budgetSliderMin.min) || 2500;
      const limitMax = parseInt(budgetSliderMax.max) || 50000;

      if (minBudget > limitMin || maxBudget < limitMax) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
          Budget: €${minBudget} - €${maxBudget}
          <button class="remove-filter">×</button>
        `;
        tag.addEventListener('click', () => {
          minBudgetInput.value = limitMin;
          maxBudgetInput.value = limitMax;
          budgetSliderMin.value = limitMin;
          budgetSliderMax.value = limitMax;
          updateSliderTrack();
          applyFiltersAndSort();
        });
        bar.appendChild(tag);
      }

      // Deployment type
      if (deploymentType === 'multiple') {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
          Production
          <button class="remove-filter">×</button>
        `;
        tag.addEventListener('click', () => {
          deploymentSelect.value = 'single';
          applyFiltersAndSort();
        });
        bar.appendChild(tag);
      } else {
        const span = document.createElement('span');
        span.className = 'filter-tag status-tag';
        span.textContent = 'Experimentation/POC';
        bar.appendChild(span);
      }
    }

    // Initial sort
    applyFiltersAndSort();
  }

  // --- Banner Word Animation ---
  const bannerX = document.getElementById('banner-x');
  const bannerY = document.getElementById('banner-y');

  if (bannerX && bannerY) {
    const xValues = [
      "vendor lock-in",
      "changing terms and conditions",
      "shrinking rate limits",
      "model regression",
      "high congestion times"
    ];
    const yValues = [
      "build environment",
      "digital footprint",
      "bottom line",
      "process flow"
    ];

    let xIndex = 0;
    let yIndex = 0;

    // Set initial values instantly
    bannerX.textContent = xValues[xIndex];
    bannerY.textContent = yValues[yIndex];

    function nextX() {
      bannerX.classList.add('switching');
      setTimeout(() => {
        xIndex = (xIndex + 1) % xValues.length;
        bannerX.textContent = xValues[xIndex];
        bannerX.classList.remove('switching');
      }, 400);
    }

    function nextY() {
      bannerY.classList.add('switching');
      setTimeout(() => {
        yIndex = (yIndex + 1) % yValues.length;
        bannerY.textContent = yValues[yIndex];
        bannerY.classList.remove('switching');
      }, 400);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let lastTransitionTime = 0;
    const minGap = 2500;

    function nextXWithCoordination() {
      const now = Date.now();
      if (now - lastTransitionTime < minGap) {
        // If too close, wait a bit and try again
        setTimeout(nextXWithCoordination, 1000);
        return;
      }
      nextX();
      lastTransitionTime = Date.now();
    }

    function nextYWithCoordination() {
      const now = Date.now();
      if (now - lastTransitionTime < minGap) {
        // If too close, wait a bit and try again
        setTimeout(nextYWithCoordination, 1000);
        return;
      }
      nextY();
      lastTransitionTime = Date.now();
    }

    function scheduleX() {
      const delay = getRandomInt(7000, 8000);
      setTimeout(() => {
        nextXWithCoordination();
        scheduleX();
      }, delay);
    }

    function scheduleY() {
      const delay = getRandomInt(7000, 9500);
      setTimeout(() => {
        nextYWithCoordination();
        scheduleY();
      }, delay);
    }

    // Start the randomized cycles
    scheduleX();
    // Offset Y's first run slightly to ensure they don't start together
    setTimeout(scheduleY, 2000);
  }

  const hardwareBg = document.getElementById('hardware-images-bg');
  if (hardwareBg) {
    // Fixed arrangement to ensure consistency and no clipping/overlap
    // Fixed arrangement for all 5 logos in the folder
    const layout = [
      { src: 'assets/images/Hardware/intel-arc-logo.webp', x: 36, y: 52 },
      { src: 'assets/images/Hardware/ryzen-ai-max-logo.png', x: 80, y: 53 },
      { src: 'assets/images/Hardware/mx_ultra__b7zrsiv2zomq_large.jpg', x: 58, y: 66 },
      { src: 'assets/images/Hardware/nvidia-logo-vert-wht.png', x: 34, y: 78 },
      { src: 'assets/images/Hardware/radeon-ai-pro-logo.avif', x: 78, y: 77 }
    ];

    layout.forEach((item) => {
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'floating-hardware-img';

      img.style.left = `${item.x}%`;
      img.style.top = `${item.y}%`;
      // Fully static
      img.style.transform = 'none';
      img.style.animation = 'none';

      hardwareBg.appendChild(img);
    });
  }

  const softwareBg = document.getElementById('software-images-bg');
  if (softwareBg) {
    const layout = [
      { src: 'assets/images/Software/comfy-ui-logo.png', x: 35, y: 52 },
      { src: 'assets/images/Software/vLLM-Logo.png', x: 79, y: 52 },
      { src: 'assets/images/Software/unsloth-studio-logo.avif', x: 57, y: 61 },
      { src: 'assets/images/Software/openclaw-dark.png', x: 32, y: 76 },
      { src: 'assets/images/Software/ollama-logo.png', x: 82, y: 76 },
      { src: 'assets/images/Software/kilocode-logo.png', x: 57, y: 84 }
    ];

    layout.forEach((item) => {
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'floating-software-img';

      img.style.left = `${item.x}%`;
      img.style.top = `${item.y}%`;
      img.style.transform = 'none';
      img.style.animation = 'none';

      softwareBg.appendChild(img);
    });
  }
});
