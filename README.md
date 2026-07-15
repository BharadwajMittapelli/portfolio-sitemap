# Technical Portfolio Sitemap

A premium, interactive portfolio sitemap web application built to showcase advanced backend architecture, systems engineering, and integration engineering capabilities.

**Live Demo:** [https://bharadwajmittapelli.github.io/portfolio-sitemap/](https://bharadwajmittapelli.github.io/portfolio-sitemap/)

---

## 📂 Project Structure

*   **`index.html`** - Core markup structure featuring a clean, responsive navigation layout, dynamic viewports, and action node modals.
*   **`style.css`** - Premium "cyber-dark" design system with modern custom properties, custom animations (pulsing nodes, sliding transitions), and grid layouts.
*   **`app.js`** - Client-side single-page app (SPA) router handling page transitions, mock code directory tree explorer, and interactive simulators.
*   **`server.js`** - Lightweight, zero-dependency local static file server built with Node.js.

---

## 🛠️ Key Features & Interactive Simulators

### 1. `/` (The Landing Node)
*   **The Claim:** A bold engineering thesis outlining competencies in API contracts, concurrent webhooks, and vector database orchestration.
*   **Gateway Explorer:** An interactive directory explorer allowing users to inspect mockup source code files (`locking.py`, `sandbox.go`, `instagram_stream.js`) inside a mock code console.
*   **Action Node:** A scheduler modal mimicking Calendly. Submitting details prints a mock transaction receipt (with custom `REF_ID` and committed timestamp) in a terminal window.

### 2. `/systems` (The Proof Engine / Case Studies)
Structured like an engineering whitepaper, with three interactive case studies:
*   **CrednPay (Async Financial Pipeline):** Deep dive into PostgreSQL row-level locking (`SELECT FOR UPDATE`). Features an **interactive transaction simulator** showing how parallel writes block and queue to isolate race conditions.
*   **CodeCheck (Isolated Security Sandbox):** Exploration of Firecracker microVM structures and memory boundary isolation. Features an **interactive memory/CPU monitor** simulating code compilation and security isolation limits.
*   **E-Commerce Webhooks (High-Throughput API Ingestion):** Detail of token-bucket rate limiting on Instagram Graph API webhooks. Features a **live stream simulator** buffering 30 parallel event emissions.

### 3. `/runtime` (The Engineering Matrix)
*   **Enterprise Validations:** Showcases verified Salesforce Agentforce Specialist credentials, equipped with a custom prompt-grounding JSON schema.
*   **Infrastructure Stack:** A granular, tabular review of active proficiency across Languages, Runtimes, Datastores, DevOps containers, and Vector search.
*   **Academic Base:** Timeline of milestones and distributed systems research publications at the Institute of Aeronautical Engineering (IARE).

---

## 🚀 Running Locally

You can spin up a local development server using Node.js without downloading any dependencies:

1.  Clone this repository:
    ```bash
    git clone https://github.com/BharadwajMittapelli/portfolio-sitemap.git
    cd portfolio-sitemap
    ```
2.  Start the static file server:
    ```bash
    node server.js
    ```
3.  Open your browser and navigate to:
    [http://localhost:8000/](http://localhost:8000/)
