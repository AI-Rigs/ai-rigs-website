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

  // --- Catalog Filter & Sort Logic ---
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));

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
        .filter(cb => cb.checked)
        .flatMap(cb => cb.value.split(','));

      const sortBy = sortSelect.value;
      const deploymentType = deploymentSelect ? deploymentSelect.value : 'single';

      const productData = products.map(el => {
        return {
          element: el,
          price: parseInt(el.dataset.price) || 0,
          relevance: parseInt(el.dataset.relevance) || 0,
          modalities: (el.dataset.modality || '').split(',').map(s => s.trim()),
          deployment: el.dataset.deployment || ''
        };
      });

      // Filter
      const filtered = productData.filter(p => {
        const inBudget = p.price >= minBudget && p.price <= maxBudget;
        let inModality = true;
        if (selectedMods.length > 0) {
          inModality = p.modalities.some(m => selectedMods.includes(m));
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
        // relevance (default)
        return b.relevance - a.relevance;
      });

      // Hide all products first
      products.forEach(p => p.classList.add('hidden'));

      // Re-append filtered products to change their visual order
      filtered.forEach(p => {
        p.element.classList.remove('hidden');
        productsGrid.appendChild(p.element);
      });
    }

    // Initial sort
    applyFiltersAndSort();
  }
});
