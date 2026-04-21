import { productsData, specDefinitions } from './products.js';
import { globalHeader, globalFooter, globalStars } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Inject global header and footer dynamically
  const headerElem = document.querySelector('.header');
  if (headerElem) headerElem.outerHTML = globalHeader;
  
  const footerElem = document.querySelector('.footer');
  if (footerElem) footerElem.outerHTML = globalFooter;

  const starsPlaceholders = document.querySelectorAll('.stars-placeholder');
  starsPlaceholders.forEach(el => el.outerHTML = globalStars);

  // Suppress all CSS transitions during initialization to prevent
  // visible jumps (e.g. budget slider value, filter dimming)
  document.body.classList.add('no-initial-transitions');

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
    data.forEach((product, index) => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector('.product-card');

      card.dataset.relevance = index;
      card.dataset.price = product.price;
      card.dataset.modality = product.modality;
      card.dataset.deployment = product.deployment;
      card.dataset.id = product.id;
      card.dataset.memoryCapacity = product.specValues.memoryCapacity;
      card.dataset.memoryBandwidth = product.specValues.memoryBandwidth;
      card.dataset.performance = product.specValues.performance;

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

    // Dynamically set budget boundaries based on products
    const prices = products.map(p => parseInt(p.dataset.price) || 0);
    const minPrice = products.length > 0 ? Math.min(...prices) : 2500;
    const maxPrice = products.length > 0 ? Math.max(...prices) : 50000;

    if (minBudgetInput) {
      minBudgetInput.min = minPrice;
      minBudgetInput.max = maxPrice;
      minBudgetInput.value = minPrice;
      minBudgetInput.step = 500;
    }
    if (maxBudgetInput) {
      maxBudgetInput.min = minPrice;
      maxBudgetInput.max = maxPrice;
      maxBudgetInput.value = maxPrice;
      maxBudgetInput.step = 500;
    }
    if (budgetSliderMin) {
      budgetSliderMin.min = minPrice;
      budgetSliderMin.max = maxPrice;
      budgetSliderMin.value = minPrice;
      budgetSliderMin.step = 500;
    }
    if (budgetSliderMax) {
      budgetSliderMax.min = minPrice;
      budgetSliderMax.max = maxPrice;
      budgetSliderMax.value = maxPrice;
      budgetSliderMax.step = 500;
    }

    let isInitialized = false;

    function updateSliderTrack() {
      if (!budgetSliderMin || !budgetSliderMax || !sliderTrack) return;
      const minVal = parseInt(budgetSliderMin.value);
      const maxVal = parseInt(budgetSliderMax.value);
      const limitMin = parseInt(budgetSliderMin.min) || 0;
      const limitMax = parseInt(budgetSliderMax.max) || 50000;

      const range = limitMax - limitMin;
      const leftPercent = ((minVal - limitMin) / range) * 100;
      const rightPercent = 100 - ((maxVal - limitMin) / range) * 100;

      if (isInitialized) {
        sliderTrack.style.left = leftPercent + '%';
        sliderTrack.style.right = rightPercent + '%';
      } else {
        sliderTrack.style.setProperty('left', leftPercent + '%', 'important');
        sliderTrack.style.setProperty('right', rightPercent + '%', 'important');
      }
    }

    function handleSliderChange(e) {
      let minVal = parseInt(budgetSliderMin.value);
      let maxVal = parseInt(budgetSliderMax.value);

      const minGap = 500;

      if (maxVal - minVal < minGap) {
        if (e.target.id === 'budget-slider-min') {
          budgetSliderMin.value = maxVal - minGap;
          minVal = maxVal - minGap;
        } else {
          budgetSliderMax.value = minVal + minGap;
          maxVal = minVal + minGap;
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

      const minGap = 500;

      if (maxVal - minVal < minGap) {
        if (e.target.id === 'min-budget') {
          minVal = maxVal - minGap;
        } else {
          maxVal = minVal + minGap;
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
      isInitialized = true;
      updateSliderTrack();
      const sliderWrapper = document.querySelector('.slider-pending');
      const track = document.getElementById('slider-track');
      if (sliderWrapper) sliderWrapper.classList.remove('slider-pending');
      if (track) track.style.opacity = '1';
    }

    modalityCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) {
          modalityCheckboxes.forEach(otherCb => {
            if (otherCb !== e.target) otherCb.checked = false;
          });
        }
        applyFiltersAndSort();
      });
    });



    const deploymentCheckboxes = document.querySelectorAll('.deployment-cb');
    let previousDeploymentType = null;
    let savedUseCaseStates = null;
    deploymentCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) {
          deploymentCheckboxes.forEach(otherCb => {
            if (otherCb !== e.target) otherCb.checked = false;
          });
        } else {
          const anyChecked = Array.from(deploymentCheckboxes).some(c => c.checked);
          if (!anyChecked) {
            e.target.checked = true;
          }
        }
        applyFiltersAndSort();
      });
    });

    sortSelect.addEventListener('change', applyFiltersAndSort);

    function calculateUseCaseRelevance(product, useCaseId) {
      const mem = product.memoryCapacity;
      const bw = product.memoryBandwidth;
      const comp = product.performance;

      switch (useCaseId) {
        case 'uc-finetune': // memory capacity > compute > bandwidth
          return mem * 1000000 + comp * 1000 + bw;
        case 'uc-agentic': // memory > bandwidth > compute
          return mem * 1000000 + bw * 1000 + comp;
        case 'uc-chatbot': // bandwidth > memory > compute
          return bw * 1000000 + mem * 1000 + comp;
        case 'uc-doc': // memory > bandwidth > compute
          return mem * 1000000 + bw * 1000 + comp;
        case 'uc-obj': // compute > bandwidth > memory
          return comp * 1000000 + bw * 1000 + mem;
        case 'uc-video': // compute > memory > bandwidth
          return comp * 1000000 + mem * 1000 + bw;
        default:
          return mem + bw + comp;
      }
    }

    function applyFiltersAndSort() {
      const limitMin = parseInt(budgetSliderMin.min) || 0;
      const minBudget = parseInt(minBudgetInput.value) || limitMin;
      const maxBudget = parseInt(maxBudgetInput.value) || Infinity;

      const sortBy = sortSelect.value;
      const checkedDep = Array.from(deploymentCheckboxes).find(cb => cb.checked);
      const deploymentType = checkedDep ? checkedDep.value : 'single';

      const isProduction = deploymentType === 'multiple';

      // If transitioning from Production to another deployment type, restore saved use case selections
      if (previousDeploymentType === 'multiple' && deploymentType !== 'multiple') {
        if (savedUseCaseStates) {
          savedUseCaseStates.forEach(({ id, checked }) => {
            const cb = document.getElementById(id);
            if (cb) cb.checked = checked;
          });
          savedUseCaseStates = null;
        } else {
          modalityCheckboxes.forEach(cb => {
            cb.checked = false;
          });
        }
      }

      // When Production is selected, save current use case states and check all
      if (isProduction && previousDeploymentType !== 'multiple') {
        savedUseCaseStates = Array.from(modalityCheckboxes).map(cb => ({
          id: cb.id,
          checked: cb.checked
        }));
      }

      // When Production is selected, check all use-case checkboxes and lock them
      modalityCheckboxes.forEach(cb => {
        if (isProduction) {
          cb.checked = true;
          cb.disabled = true;
          const group = cb.closest('.checkbox-group');
          if (group) {
            group.classList.add('locked');
            group.classList.remove('dimmed');
          }
        } else {
          cb.disabled = false;
          const group = cb.closest('.checkbox-group');
          if (group) {
            group.classList.remove('locked');
          }
        }
      });

      const selectedMods = Array.from(modalityCheckboxes)
        .filter(cb => cb.checked);

      // Gray out other options if one is selected (skip when Production is active)
      const anyModSelected = selectedMods.length > 0;
      if (!isProduction) {
        modalityCheckboxes.forEach(cb => {
          const group = cb.closest('.checkbox-group');
          if (group) {
            if (anyModSelected && !cb.checked) {
              group.classList.add('dimmed');
            } else {
              group.classList.remove('dimmed');
            }
          }
        });
      }

      const selectedModValues = selectedMods.flatMap(cb => cb.value.split(','));

      // Deployment type dimming
      const anyDepSelected = !!checkedDep;
      deploymentCheckboxes.forEach(cb => {
        const group = cb.closest('.checkbox-group');
        if (group) {
          if (anyDepSelected && !cb.checked) {
            group.classList.add('dimmed');
          } else {
            group.classList.remove('dimmed');
          }
        }
      });

      // Update active filters UI
      updateActiveFiltersUI(selectedMods, minBudget, maxBudget, deploymentType);

      const productData = products.map(el => {
        return {
          element: el,
          relevance: parseInt(el.dataset.relevance) || 0,
          price: parseInt(el.dataset.price) || 0,
          modalities: (el.dataset.modality || '').split(',').map(s => s.trim()),
          deployment: el.dataset.deployment || '',
          id: el.dataset.id || '',
          memoryCapacity: parseInt(el.dataset.memoryCapacity) || 0,
          memoryBandwidth: parseInt(el.dataset.memoryBandwidth) || 0,
          performance: parseInt(el.dataset.performance) || 0
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
        if (sortBy === 'relevance') {
          // Check if POC is selected without a primary use case
          const pocChecked = !!document.getElementById('dep-poc')?.checked;
          const anyUseCaseSelected = selectedMods.length > 0;

          if (pocChecked && !anyUseCaseSelected) {
            const pocOrder = ['nvidia-gb10', 'amd-strix-halo', 'mac-studio-m4-max', 'mac-studio-m3-ultra', 'single-gpu', 'dual-gpu'];
            return pocOrder.indexOf(a.id) - pocOrder.indexOf(b.id);
          }

          if (anyUseCaseSelected) {
            const useCaseId = selectedMods[0]?.id;
            const relA = calculateUseCaseRelevance(a, useCaseId);
            const relB = calculateUseCaseRelevance(b, useCaseId);
            return relB - relA;
          }

          // Default: sum of highest values per spec category
          const relA = a.memoryCapacity + a.memoryBandwidth + a.performance;
          const relB = b.memoryCapacity + b.memoryBandwidth + b.performance;
          return relB - relA;
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });

      // Hide all products first
      products.forEach(p => p.classList.add('hidden'));

      // Re-append filtered products to change their visual order
      filtered.forEach(p => {
        p.element.classList.remove('hidden');

        const btn = p.element.querySelector('.btn-primary');
        if (btn) {
          const params = new URLSearchParams();
          if (selectedMods.length > 0) {
            params.set('usecase', selectedMods[0].id);
          }
          const safeMax = maxBudget === Infinity ? 'max' : maxBudget;
          params.set('budget', `${minBudget}-${safeMax}`);
          params.set('deployment', deploymentType === 'single' ? 'poc' : 'production');
          params.set('hardware', p.id);
          btn.href = `contact.html?${params.toString()}`;
        }

        productsGrid.appendChild(p.element);
      });

      // Update previous deployment type for next iteration
      previousDeploymentType = deploymentType;
    }

    function updateActiveFiltersUI(selectedMods, minBudget, maxBudget, deploymentType) {
      // Logic removed as per user request to remove the active filters bar
    }

    // Handle URL parameters for pre-applied use case filters for hardware.html
    const useCaseParam = urlParams.get('use-case');
    if (useCaseParam) {
      const checkbox = document.getElementById(useCaseParam);
      if (checkbox && checkbox.classList.contains('use-case-cb')) {
        checkbox.checked = true;
        // The exclusive selection logic is in the 'change' listener, 
        // so we manually uncheck others since we're setting it before the initial call.
        const modalityCheckboxes = document.querySelectorAll('.use-case-cb');
        modalityCheckboxes.forEach(cb => {
          if (cb !== checkbox) cb.checked = false;
        });
      }
    }

    // Initial sort
    applyFiltersAndSort();
  }

  // Handle contact form pre-selection
  const contactUseCase = urlParams.get('usecase');
  const contactBudget = urlParams.get('budget');
  const contactDeployment = urlParams.get('deployment');
  const contactHardware = urlParams.get('hardware');

  if (contactUseCase) {
    const useCaseSelect = document.getElementById('usecase');
    if (useCaseSelect) useCaseSelect.value = contactUseCase;
  }
  if (contactBudget) {
    const budgetInput = document.getElementById('budget');
    if (budgetInput) budgetInput.value = contactBudget;
  }
  if (contactDeployment) {
    const deploymentInput = document.getElementById('deployment');
    if (deploymentInput) deploymentInput.value = contactDeployment;
  }
  if (contactHardware) {
    const hardwareInput = document.getElementById('hardware');
    if (hardwareInput) hardwareInput.value = contactHardware;
  }

  // --- Banner Word Animation ---
  const bannerX = document.getElementById('banner-x');
  const bannerY = document.getElementById('banner-y');

  if (bannerX && bannerY) {
    const xValues = [
      "vendor lock-in.",
      "changing terms and conditions.",
      "shrinking rate limits.",
      "high congestion times.",
      "cloud model degradation."
    ];
    const yValues = [
      "sensitive data.",
      "AI expense budget.",
      "process workflows.",
      "digital footprint.",
      "AI infrastructure."
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
      { src: 'assets/images/Hardware/intel-arc-logo.webp', x: 31, y: 53 },
      { src: 'assets/images/Hardware/ryzen-ai-max-logo.png', x: 81, y: 53 },
      { src: 'assets/images/Hardware/mx_ultra__b7zrsiv2zomq_large.jpg', x: 56, y: 57 },
      { src: 'assets/images/Hardware/nvidia-logo-vert-wht.png', x: 37, y: 79 },
      { src: 'assets/images/Hardware/radeon-ai-pro-logo.avif', x: 67, y: 79 }
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
      { src: 'assets/images/Software/openclaw-dark.png', x: 32, y: 76 },
      { src: 'assets/images/Software/unsloth-studio-logo.avif', x: 61, y: 61 },
      { src: 'assets/images/Software/lmstudio-logo.png', x: 86, y: 76 },
      { src: 'assets/images/Software/vLLM-Logo.png', x: 82, y: 52 },
      { src: 'assets/images/Software/ollama-logo.png', x: 59, y: 84 }
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

  // Re-enable CSS transitions now that initialization is complete
  requestAnimationFrame(() => {
    document.body.classList.remove('no-initial-transitions');
  });
});
