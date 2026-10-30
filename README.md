# Nirmaan Aluminium House — Architectural Fabrication Portfolio & Consultation Platform

> **Crafting Spaces. Building Trust.**
> Premium aluminium & stainless steel fabrication solutions based in Anand, Gujarat, India.

---

## 🏗️ Architecture & Features

This platform is a modern, responsive corporate showcase and enquiry website built with **React 19 + Vite**, **Tailwind CSS v4**, and **Framer Motion**.

### Key Capabilities
- **Architectural Product Showcase (`src/pages/Products.jsx`, `src/pages/ProductDetail.jsx`)**:
  - Detailed product catalog for stainless steel railings, aluminium balconies, gates, PVD work, and CNC laser-cut panels.
  - Interactive finish and material grade selector.
  - Interactive multi-view image gallery with zoom preview and recent installation carousels.
  - Direct **Custom Quote Request Modal** and pre-filled **WhatsApp Consultation CTA**.
- **Company Portfolio & Pages**:
  - **Home**: Dynamic hero showcase with responsive slider, values, featured fabrication solutions, projects carousel, client testimonials, and quick consultation CTA.
  - **About Us**: Company story, 10-year milestones, and core values.
  - **Services**: Custom design & 3D consultation, CNC/laser cutting, PVD titanium coating, turnkey site installation, weatherproofing, and maintenance.
  - **Projects Gallery**: Real-world portfolio of residential villas, commercial complexes, and industrial sites across Gujarat.
  - **Why Choose Us**: Key differentiators (10+ years experience, certified SS 304/316 alloys, expert craftsmen, after-sales service).
  - **Contact & Measurements**: Complete enquiry form with field validations and direct technical team links.
- **Floating Contact Integrations**:
  - Direct WhatsApp floating button pre-configured with quotation enquiry message.
  - Phone call and email shortcuts throughout headers, navigation, and footers.
- **Performance & Code Quality**:
  - Route-level lazy loading (`React.lazy` + `Suspense`) for optimal chunking and minimal load latency.
  - Centralized single source of truth for business contact details (`src/config/business.js`).
  - Strict linting verified with zero errors or warnings via `oxlint`.

---

## 🚀 Getting Started

### Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### Production Build & Lint
```bash
# Code quality check
npm run lint

# Production build (optimized bundle)
npm run build

# Preview production build locally
npm run preview
```
