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
      memoryCapacity: 'Up to 128GB unified memory',
      memoryBandwidth: '256 GB/s',
      performance: 'Up to 126 TOPS (INT8)'
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
      memoryCapacity: 'Up to 128GB unified memory',
      memoryBandwidth: '546 GB/s',
      performance: '38 TOPS INT8 (Neural Engine)'
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
      memoryCapacity: 'Up to 256GB Unified Memory',
      memoryBandwidth: '819 GB/s',
      performance: '36 TOPS INT8 (Neural Engine)'
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
      memoryCapacity: '128 GB unified memory (up to 256GB via stacking)',
      memoryBandwidth: '273 GB/s',
      performance: '~250 TOPS INT8 (dense, est.)'
    }
  },
  {
    id: 'single-gpu',
    title: 'Single-GPU Workstation',
    description: 'The most flexible choice with a wide range of customization options for any use case. Suitable for running small to medium sized models for individuals or a small team.',
    price: 3500,
    modality: 'visual,textual',
    deployment: '',
    image: './assets/images/Products/single_gpu_workstation.png',
    imageAlt: 'Entry-Level Single GPU Workstation',
    isChipLogo: false,
    specs: {
      memoryCapacity: 'Up to 96GB GDDR7',
      memoryBandwidth: 'Up to 1792 GB/s',
      performance: 'Up to 4000 TOPS (FP4 with sparsity)'
    }
  },
  {
    id: 'dual-gpu',
    title: 'Dual-GPU Workstation',
    description: 'Accelerate training times and handle larger data operations effortlessly with dual GPU compute capabilities.',
    price: 6500,
    modality: 'visual,textual,audio',
    deployment: '',
    image: './assets/images/Products/dual_gpu_workstation.png',
    imageAlt: 'Mid-Range Dual GPU Workstation',
    isChipLogo: false,
    specs: {
      memoryCapacity: 'Up to 192GB GDDR7 (combined)',
      memoryBandwidth: 'Up to 3584 GB/s (combined)',
      performance: 'Up to 8000 TOPS (FP4 with sparsity, combined)'
    }
  }
];

export const specDefinitions = {
  memoryCapacity: {
    label: 'Memory capacity',
    tooltip: 'Dictates the maximum model size (e.g., 8B vs. 70B) and maximum context length you can load into the system.'
  },
  memoryBandwidth: {
    label: 'Memory bandwidth',
    tooltip: 'The primary factor determining how many tokens per second (TPS) the model generates'
  },
  performance: {
    label: 'Performance',
    tooltip: "The system's raw computational power - higher TOPS reduce the \"Time to First Token\" when processing long prompts."
  }
};
