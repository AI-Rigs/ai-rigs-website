export const productsData = [
  {
    id: 'amd-strix-halo',
    title: 'AMD Ryzen AI Max+ 395 (Strix Halo)',
    description: 'Compact AI workstation featuring unified memory architecture, ideal for running local LLMs and daily operations.',
    price: 2800,
    modality: 'textual',
    deployment: 'poc-only',
    image: './assets/images/Products/GMKtec-evox2.png',
    imageAlt: 'AMD Ryzen AI Max+ 395 Strix Halo mini-PC',
    isChipLogo: false,
    specs: {
      memoryCapacity: 'Up to 128 GB unified memory',
      memoryBandwidth: '256 GB/s',
      performance: 'Up to 126 TOPS (INT8)'
    },
    specValues: {
      memoryCapacity: 128,
      memoryBandwidth: 256,
      performance: 126
    }
  },
  {
    id: 'mac-studio-m4-max',
    title: 'Mac Studio M4 Max',
    description: 'Exceptional single-user AI performance in a compact form factor with the M4 Max chip and high-Memory bandwidth unified memory.',
    price: 2500,
    modality: 'visual,textual,audio',
    deployment: 'poc-only',
    image: './assets/images/Products/m4-max-wide.png',
    imageAlt: 'Apple M4 Max',
    isChipLogo: true,
    specs: {
      memoryCapacity: 'Up to 128 GB unified memory',
      memoryBandwidth: '546 GB/s',
      performance: '38 TOPS INT8 (Neural Engine)'
    },
    specValues: {
      memoryCapacity: 128,
      memoryBandwidth: 546,
      performance: 38
    }
  },
  {
    id: 'mac-studio-m3-ultra',
    title: 'Mac Studio M3 Ultra',
    description: "Apple's most powerful desktop chip delivers workstation-class AI throughput with massive unified memory capacity.",
    price: 5000,
    modality: 'visual,textual,audio',
    deployment: 'poc-only',
    image: './assets/images/Products/m3-ultra-wide.png',
    imageAlt: 'Apple M3 Ultra',
    isChipLogo: true,
    specs: {
      memoryCapacity: 'Up to 256 GB Unified Memory',
      memoryBandwidth: '819 GB/s',
      performance: '36 TOPS INT8 (Neural Engine)'
    },
    specValues: {
      memoryCapacity: 256,
      memoryBandwidth: 819,
      performance: 36
    }
  },
  {
    id: 'nvidia-gb10',
    title: 'Nvidia GB10 (DGX Spark / Asus GX10)',
    description: 'Compact AI supercomputer powered by the Grace Blackwell architecture. Designed for uncompromised compute density.',
    price: 4000,
    modality: 'textual,visual',
    deployment: 'poc-only',
    image: './assets/images/Products/nvidia_gb10_dgx.png',
    imageAlt: 'Nvidia GB10 DGX Spark AI Supercomputer',
    isChipLogo: false,
    specs: {
      memoryCapacity: '128 GB unified memory (up to 256 GB via stacking)',
      memoryBandwidth: 'Up to 273 GB/s',
      performance: '~250 TOPS INT8 (dense, est.)'
    },
    specValues: {
      memoryCapacity: 256,
      memoryBandwidth: 273,
      performance: 250
    }
  },
  {
    id: 'single-gpu',
    title: 'Single-GPU Workstation',
    description: 'Highly customizable for any use case, with good future upgradability options. Suited for running small to medium sized AI models for individuals or a small team.',
    price: 3500,
    modality: 'visual,textual',
    deployment: '',
    image: './assets/images/Products/single_gpu_workstation.png',
    imageAlt: 'Entry-Level Single GPU Workstation',
    isChipLogo: false,
    specs: {
      memoryCapacity: 'Up to 96 GB GDDR7',
      memoryBandwidth: 'Up to 1792 GB/s',
      performance: 'Up to 4000 TOPS (FP4 with sparsity)'
    },
    specValues: {
      memoryCapacity: 96,
      memoryBandwidth: 1792,
      performance: 4000
    }
  },
  {
    id: 'dual-gpu',
    title: 'Dual-GPU Workstation',
    description: 'A cost-effective solution for more demanding tasks that don\'t require a full enterprise server. Suited for running medium to medium-large sized AI models for individuals or a small team.',
    price: 6500,
    modality: 'visual,textual,audio',
    deployment: '',
    image: './assets/images/Products/dual_gpu_workstation.png',
    imageAlt: 'Mid-Range Dual GPU Workstation',
    isChipLogo: false,
    specs: {
      memoryCapacity: 'Up to 192 GB GDDR7 (combined)',
      memoryBandwidth: 'Up to 3584 GB/s (combined)',
      performance: 'Up to 8000 TOPS (FP4 with sparsity, combined)'
    },
    specValues: {
      memoryCapacity: 192,
      memoryBandwidth: 3584,
      performance: 8000
    }
  }
];

export const specDefinitions = {
  memoryCapacity: {
    label: 'Memory capacity',
    tooltip: 'Higher memory capacity allows you to load larger models and have longer context windows. Bigger models are generally more capable and produce better outputs.'
  },
  memoryBandwidth: {
    label: 'Memory bandwidth',
    tooltip: 'Faster memory bandwidth improves the model output speed, measured in TPS (tokens per second).'
  },
  performance: {
    label: 'Compute power',
    tooltip: "Higher compute power reduces the \"Time to First Token\" (TTFT) when processing long prompts or large documents."
  }
};
