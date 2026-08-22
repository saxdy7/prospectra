# Clay Clone — Master Knowledge Base & System Architecture

This document synthesizes the visual design tokens, product screenshots, architectural requirements, and execution plan for building a production-grade clone of **Clay.com** (focused on GTM data orchestration, local business discovery, enrichment waterfalls, Claygent AI research, and automated campaigns).

---

## 1. Executive Summary & Product Vision

### What is Clay?
Clay is a modern **Go-To-Market (GTM) data orchestration and enrichment platform** disguised as a dynamic, reactive spreadsheet with supercharged AI agents and waterfall API connectors. 

Users can:
1. **Source Leads**: Search people, companies, job listings, local businesses (Google Maps/Places), and lookalike audiences.
2. **Waterfall Enrichment**: Chain 50+ data providers (Apollo, Hunter, Clearbit, Prospeo, Google Places, Serper, etc.) to discover verified emails, phone numbers, tech stacks, and company metrics with fallback failover.
3. **AI Agent (Claygent)**: An autonomous web-scraping AI agent that visits URLs, searches Google, parses company landing pages, and answers custom questions (e.g. *"Does this local dentist offer Invisalign?"*, *"What POS system does this restaurant use?"*).
4. **Outreach & Campaigns**: Multi-step cold email sequencing, personalizations generated with AI, inbox management, email warmup, and analytics.
5. **Signals & Alerts**: Track job postings, promotions, funding, and web intent triggers.

---

## 2. Visual Design System & Tokens (Extracted from Design Analysis & Screenshots)

### 2.1 Color Palette
- **Canvas / Floor**: `#fffaf0` (Warm cream-tinted canvas; distinguishes Clay from cold dark/gray dashboards)
- **Surface Soft**: `#faf5e8` (Top nav, CTA bands, footer)
- **Surface Card**: `#f5f0e0` (Neutral card backgrounds, testimonial cards)
- **Surface Strong**: `#ebe6d6` (Emphasized bands, borders, dividers)
- **Primary Ink**: `#0a0a0a` (Near-black with slight warm undertone for titles, buttons)
- **Body Text**: `#3a3a3a` (High legibility body copy)
- **Muted Text**: `#6a6a6a` (Subtitles, metadata, timestamps)
- **Hairline Borders**: `#e5e5e5` / `#f0f0f0` (1px clean outlines)

#### Vibrant Brand Card Accents (6-Color Signature Palette)
- **Brand Pink**: `#ff4d8b` (Sequencers, campaigns, high-energy actions)
- **Brand Teal**: `#1a3a3a` (Deep dark teal, featured tiers, ad modal accents)
- **Brand Lavender**: `#b8a4ed` (AI agent / Claygent features)
- **Brand Peach**: `#ffb084` (Data import, CSV/CRM sync)
- **Brand Ochre**: `#e8b94a` (Signals, filters, community)
- **Brand Mint**: `#a4d4c5` (Success badges, lead discovery)
- **Brand Coral**: `#ff6b5a` (Alerts, highlights)

### 2.2 Typography
- **Headlines / Display**: `Plain Black` (or `Inter` weight 500/600 with `-1px` to `-2.5px` letter spacing)
- **Body & Interface**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Scale**:
  - `display-xl`: 72px / 500 / -2.5px
  - `display-lg`: 56px / 500 / -2px
  - `display-md`: 40px / 500 / -1px
  - `title-lg`: 24px / 600 / -0.3px
  - `title-md`: 18px / 600 / 0px
  - `body-md`: 16px / 400 / 1.55 line-height
  - `body-sm`: 14px / 400 / 1.55 line-height
  - `caption`: 13px / 500

### 2.3 Geometry & Radius
- `rounded-xs`: 6px (Badges, small dropdown items)
- `rounded-sm`: 8px (Small buttons, input tags)
- `rounded-md`: 12px (Standard CTA buttons, search inputs, dialogs)
- `rounded-lg`: 16px (Table container, modal boxes, content cards)
- `rounded-xl`: 24px (Feature cards, hero banners)
- `rounded-pill`: 9999px (Filter pills, status tags, active tab indicators)

---

## 3. Deep Dive into Provided Screenshots & UI Analysis

### Image 1: Main Dashboard / Home Workspace (`/app/home`)
1. **Left Sidebar (Navigation & Orchestration)**:
   - Top: Clay logo (colored rainbow arc) + collapse icon.
   - Core links:
     - `Home` (Active state with light blue rounded pill highlight `#e0f2fe`)
     - `Find leads` (Expandable popover trigger)
   - Section **Orchestration**:
     - `Signals` (Track triggers like job change, promotion, web intent)
     - `Ads` (With glowing gold `✨ Upgrade` badge)
     - `Campaigns` (Cold email sequencers)
     - `Claygents` (Autonomous research agents)
     - `Functions` (Custom Javascript/Python formula columns)
     - `Workflows` (`Beta` badge)
     - `MCP` (Model Context Protocol client/server connectors — `Beta` badge)
   - Bottom Utility Links:
     - `Exports`, `Trash`, `Settings`, `AI context`
2. **Top Header & AI Command Center**:
   - Welcome text: `Hey [User], ready to get started?` with collapse toggle `Show less ^`
   - Universal Prompt Bar:
     - Icon with multi-color sparkle: *"Ask me anything about Clay or describe what you'd like to do..."* + up-arrow submit button.
   - Top Right Action Bar:
     - `✨ Upgrade your plan` (Bright blue primary pill button)
     - Quick tools: Integrations/API keys, Docs/University, Support/Help, Notifications, User Avatar / Workspace switch.
3. **Quick Action Grid (5 Saturated Action Cards)**:
   - 🔍 **Find leads**: *"Find people, companies, jobs and more."*
   - ⬆️ **Import data**: *"Import your existing list from CRM or CSV."*
   - 🧱 **Build a segment**: *"Define and enrich targeted lists of people and companies."*
   - 📢 **Create a campaign**: *"Build and automate your outreach campaigns."*
   - 🧩 **Start from template**: *"Choose from pre-built workflows to get started."*
4. **File & Table Explorer**:
   - Tabs: `All files` (Active white rounded card), `Recents`, `Favorites`
   - Search bar (`Search...`) + `+ New` blue button
   - Filter bar: `Owner: All ▾`, `Filters`
   - Data Table Columns:
     - File Name (e.g., *"Clay Starter Table"*, *"Find local businesses on Google Maps"*)
     - Favorite (Star icon toggle)
     - Tags (Pills)
     - Created at / Last opened
     - Owner & Access ("Edit" / "View")
     - More actions (`...`)

### Images 2 & 3: "Find Leads" Popover Dropdown
Clicking **Find leads** opens a dedicated lead generation modal/menu with 5 primary scrapers & sources:
1. 👤 **People**: Search LinkedIn, job titles, locations, seniorities, industries.
2. 🏢 **Companies**: Search B2B company database, headcount, revenue, technologies, keywords.
3. 💼 **Jobs**: Track companies with active job postings and hiring trends.
4. 📍 **Local businesses**: **(Target Focus)** Scrape Google Maps / Google Places for restaurants, plumbers, dentists, realtors, contractors, clinics by keyword and geolocation (city/zip/radius), extracting address, rating, review count, phone, website, Google Maps URL, opening hours.
5. 🔗 **Company lookalikes**: Find competitors or similar businesses based on seed domain/URL.

### Image 4: Feature Dialog ("Clay Ads")
- Modal featuring a deep dark-teal backdrop with 3D clay-styled graphic waves.
- Highlights:
  - *"Create segments from first- and third-party data"*
  - *"Always-on audiences update themselves"*
  - *"Higher match rates from more providers"*
  - Actions: "Learn more ↗" and "Upgrade plan".

### Image 5: Campaigns & Outreach Center (`/app/campaigns`)
- Top Navigation: `Sequences` (Active), `Email accounts` (SMTP/IMAP/OAuth connection & warmup), `Account orders`, `Blocklist`
- Top Actions: `Inbox` (Unified master inbox), `Analytics` (Open, click, reply, bounce metrics), `+ New campaign`
- Sequence Builder: Multi-day cadences, condition branches (If replied -> stop, If opened -> follow up), template variables populated directly from table columns (`{{first_name}}`, `{{custom_ai_icebreaker}}`).

### Image 6: Claygents Builder & Agent Library (`/app/claygents`)
- **Natural Language Prompt Interface**:
  - Main header: *"Start building your Claygent in natural language"* with Claygent icon.
  - Large prompt text area: *"Describe your task in natural language and we'll create an AI Agent for you... (Tip: Type "@" to mention files and business context)"*.
  - Bottom controls inside box: Model dropdown (*"Automatically assign model ▾"*), *"Upload files"* button, and `Build Agent →` (blue primary button).
- **Template Starter Cards**:
  - 🌲 **Prospecting**: *"Find and qualify leads at a target company."*
  - 🔮 **Account Scoring**: *"Score accounts by fit and intent."*
  - ✨ **Contact Scoring**: *"Score contacts by role and seniority."*
  - 🧱 **Copywriting**: *"Write personalized outreach emails."*
  - *"Start from scratch or use a saved template"* link.
- **Agent Directory**:
  - Filters: `Type: All ▾`, Search bar.
  - Empty state with cute tombstone/clay illustration: *"You haven't created any agents yet."*

### Image 7: Functions Directory (`/app/functions`)
- **Category Tabs**: `All`, `Clay managed`, `Recents`, `Favorites`
- **Actions**: Search bar, `How it works` info modal button, `+ New` blue action button.
- **Filters**: `Owner: All ▾`, `x Workspace managed`, `Filters`.
- **Purpose**: Allows users to write reusable Javascript/Python formula columns, custom webhooks, and API scrapers that can be added to any table.

### Image 8: MCP (Model Context Protocol) Server & Client Settings (`/app/mcp`)
- **Clay University Guide Link**: *"New to MCP? Visit Clay University for setup guides and best practices."*
- **Default Credit Limit**: Configurable monthly/per-user credit allocation (e.g. `1,000 credits` with edit pencil).
- **Security & Privacy Controls**: *"Hide default functions from MCP"* toggle to protect proprietary workspace enrichment data points (email, website traffic, tech stack, open jobs, funding) while exposing custom actions.
- **Client Access Whitelist**: Granular toggles for allowed AI assistants:
  - `ChatGPT` (OpenAI connection toggle)
  - `Claude` (Anthropic connection toggle)
  - `Grok` (xAI connection toggle)
  - `Unknown` (General external MCP clients)
- **Active Connections List**: Realtime list showing connected platforms (e.g. *"ChatGPT — 1 user connected"*, *"Claude — 1 user connected"*) with status badges and token management.

### Image 9: Interactive Spreadsheet / Table Engine (`/app/table/:id` — Live Google Maps Local Business Table)
- **Breadcrumb Navigation**: `Home` / 📁 `Find local businesses on Google Maps` / 📊 `Find local businesses on Google Maps Table ▾`
- **Table Control Ribbon**:
  - `⚡ Auto-run`: Live background execution toggle.
  - `0 [Queue counter]`: Active processing items.
  - `Default view` (View manager & switch).
  - `9/11 columns` (Column visibility & hide/show manager).
  - Filter (`Filter`), Sort (`Sort`), Search (`Search`).
  - Right tools: `Sandbox Mode`, `Sculptor` (AI Table Assistant), `Tools ▾` (Blue menu).
- **High-Performance Grid Columns**:
  1. `[Index & Progress]`: Checkbox selection, `%` calculation progress bar, Row number (`1` to `23+`).
  2. `📍 Find local businesses on Google Maps` (Source integration column with `✓ Up to date` header and `📍 Business Found` cell pills).
  3. `🔤 T Name`: Business Name (e.g. "The Manali Lodge", "Hotel Cherry Manali", "Afsana Homestay").
  4. `🔗 Google Maps URL`: Clickable Google Maps Place links (`https://www.google.com/maps/...`).
  5. `🔤 T Description`: Scraped business overview / category snippet ("Simple quarters in a relaxed hotel...").
  6. `🌐 Website`: Scraped business website link with domain favicon.
  7. `📞 T Phone`: Standardized phone numbers with country codes (e.g. `+91 99997 47620`).
  8. `📍 T Address`: Full street address & locality.
  9. `⭐ # Rating`: Numeric rating (`4.3`, `4.9`, `5.0`).
  10. `💬 # Reviews Count`: Total Google reviews count.
- **Bottom Multi-Table Tab Bar**:
  - `Overview`
  - `Find local businesses on...` (Active table tab)
  - `+ Add` (New table tab)
  - Bottom right status: `✓ Table up to date`, `⏹ Stop`, `🕒 History`.

### Image 10: Workflows Visual Builder (`/app/workflows`)
- **Canvas Interface**: Dot-grid background canvas for visual DAG workflow orchestration.
- **Workflow Header**: `Untitled workflow ▾` (Editable inline).
- **Natural Language Prompt Assistant**: *"Describe a workflow"* with attachment button and generate trigger.
- **3 Primary Starter Actions**:
  - ➡️ **Start with a trigger**: Webhook, schedule, row created, status changed.
  - 🧱 **Start with a segment**: Filtered audience trigger with `✨ Upgrade` pill.
  - 📊 **Import a table**: Trigger based on table data source.
- **Recommended Workflow Blueprints**:
  - *"Route & enrich MQLs from a form webhook"*
  - *"Score & route PQLs from product signals"*
  - *"Enrich, score & prioritize a target-account list for reps"*
  - *"Enrich & route inbound leads from a CSV/list import"*

### Image 11: Concurrency Hub (`/app/concurrency`)
- **Top Gauge**: `0 reserved of 20 concurrencies` with interactive progress/segment bar.
- **Reserved Concurrency Table**:
  - Header: *"Agents that have a fixed number of concurrencies always at their disposal. These will be prioritised during high traffic."*
  - Search bar + `+ Add` button.
  - Columns: `Agent`, `Webcall`, `Chat`, `Outbound`, `Inbound`, `Total`, `More`.

### Image 12: Knowledge Base Manager (`/app/knowledge-base`)
- **Split-View Master-Detail Architecture**:
  - Left pane: Knowledge base collections list with `+` create button.
  - Right pane: Document manager, file uploads (PDF, DOCX, TXT), website scraper links, and text snippets used by Voice Agents for RAG context during live calls.

### Image 13: Phone Numbers Hub (`/app/phone-numbers`)
- **Number Provisioning & Routing**:
  - Buy/rent local and toll-free numbers across US, India (+91), UK (+44), EU.
  - Inbound routing: Map phone number directly to specific Voice Agent.
  - Outbound caller ID assignment for batch calling campaigns.
  - Action: `Add a phone number` (Emerald green).

### Image 14: Voice Calling Campaigns (`/app/campaigns` - Voice Outbound)
- **Outbound Batch Dialer Engine**:
  - Pair scraped audience segments (e.g. from Google Maps or Jobs table) with specific Voice Agents and rented Caller IDs.
  - Schedule call windows, retry strategies, pacing, and automatic call recording.
  - Action: `Create a campaign`.

### Image 15: WhatsApp AI Agent Integration (`/app/whatsapp`)
- **Omni-channel Messaging**:
  - Deploy conversational voice and chat agents to WhatsApp Business API.
  - Features: Persistent Conversation Memory, WhatsApp Business profile integration, In-chat "Call to Agent" voice calls.
  - Status: *Coming Soon* notification badge.

---

## 4. Technical Architecture for Full Clone

### Recommended Modern Stack:
1. **Frontend**:
   - **Framework**: Next.js 14/15 (App Router) or Vite + React 18/19
   - **Styling**: Vanilla CSS / CSS Modules with precise Design System custom properties (`--canvas`, `--brand-pink`, etc.)
   - **Table Engine**: TanStack Table v8 / Canvas or Virtualized High-Performance Grid (handling 10,000+ rows smoothly with cell-level editing, formula evaluation, column resizing, reordering, and sticky headers)
   - **Icons**: Lucide React / Custom SVG clay icons
2. **Backend & Orchestration API**:
   - **Server / API**: Node.js (Fastify / Express / Next.js Route Handlers) or Python (FastAPI for AI & heavy scraping workers)
   - **Worker Queue**: BullMQ + Redis (for asynchronous waterfall enrichment, batch Google Maps scraping, and Claygent web lookups)
   - **Browser Automation / Scraping**: Puppeteer / Playwright / Cheerio / Serper API / Google Places API
3. **Database & Storage**:
   - **Primary Database**: PostgreSQL (Supabase / Neon / Local Postgres) with Prisma or Drizzle ORM
   - **Realtime / Caching**: Redis (for rate limits, job status, cell live updates)
   - **Object Storage**: S3 / Cloudflare R2 / Supabase Storage (for CSV/file exports and avatar uploads)

---

## 5. Details & Credentials Required from User (When Ready)

To configure the clone for your local business use cases and production deployment, here is the list of credentials/configurations we will collect:

### 1. Database & Authentication
- **Database**: PostgreSQL Connection URI (e.g. Supabase, Neon, Railway, or local Docker Postgres `postgresql://user:pass@host:5432/clay_clone`)
- **Authentication**: Choice of Auth (Supabase Auth, NextAuth / Auth.js, Clerk, or custom JWT/Email-Password)

### 2. Sourcing & Local Business APIs (Google Maps / Places)
- **Google Maps / Places API Key** OR **Outscraper / Serper / SerpAPI key** (for live Google Maps scraping of local businesses with phone, email, website, ratings)
- *(Optional)* Custom headless scraper setup if you prefer direct zero-cost scraping without external paid APIs.

### 3. AI & Enrichment Providers (For Claygent & Email Discovery)
- **OpenAI / Anthropic / Gemini API Key** (powers the Claygent web browsing agent, AI formula columns, and email personalization)
- **Email Discovery Providers** *(Optional, can be added per waterfall)*:
  - Apollo / Hunter / Prospeo / Anymail finder / NeverBounce API keys.

### 4. Cold Outreach & Email Delivery (For Campaigns)
- **SMTP/IMAP Settings** (Gmail Google App Password, Outlook 365, SendGrid, Resend, or custom SMTP) for sending sequences.

---

## 6. Next Steps & Execution Plan

1. **Awaiting Additional Screenshots**: You will upload more screenshots of specific screens (e.g. Table spreadsheet view, Column enrichment modal, Claygent builder, Settings, etc.).
2. **Interactive Prototype Initialization**: We will scaffold the complete Clay application with pixel-perfect UI matching the design specs.
3. **Local Business Discovery & Table Module**: Implement the interactive table with Google Maps local business finder and AI enrichment columns.
