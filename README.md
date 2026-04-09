# AI Rigs - Custom AI Workstations Landing Page

## Overview
AI Rigs is a sleek, modern landing page designed to showcase and capture leads for custom-built AI workstations. The core selling point is providing hardware heavily customized to perfectly match the customer's unique workflows (such as LLM fine-tuning, audio/video generation, and computer vision). 

The platform features a highly aesthetic dark-mode design with AI-inspired neon accents and a fully designed lead-generation form to capture user requirements, including pre-configured software stacks and ongoing support preferences.

## Tech Stack
Built using entirely vanilla technologies for maximum flexibility and control:
- **HTML5** (semantic structure)
- **CSS3** (modern vanilla CSS, custom variables, grid/flexbox, animations)
- **JavaScript** (vanilla form handling and interactions)
- **Vite** (build tool and development server)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Setup
1. Open your terminal in the project directory (`e:\Dev\ai-rigs.eu`).
2. Install the necessary dependencies:
    ```bash
    npm install
    ```

### Development Server
To run the website locally with hot true module replacement (HMR), run:
```bash
npm run dev
```
Visit the URL provided in the terminal (usually `http://localhost:5173/`).

### Building for Production
To generate a production-ready optimized bundle, run:
```bash
npm run build
```
The optimized files will be output to a `dist/` folder, ready to be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

### Preview Production Build
If you wish to test your production build locally before deploying, you can run:
```bash
npm run preview
```
