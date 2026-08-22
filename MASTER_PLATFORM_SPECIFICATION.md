# MASTER PLATFORM SPECIFICATION & UNIFIED ARCHITECTURE
## Autonomous Lead Scraping, Reactive Data Tables, AI Job Hunter & Real-Time Conversational Voice AI Platform
*(The Ultimate Fusion of Clay.com + Smallest.ai)*

---

## 1. Executive Summary & Core Identity

This platform is a unified, full-stack **Autonomous Client Acquisition, Data Orchestration, and Conversational Voice AI Ecosystem**. It bridges the high-performance reactive spreadsheet engine, lead scraping, and waterfall enrichment of **Clay.com** with the real-time multilingual voice agents, telephony calling, and speech infrastructure of **Smallest.ai**.

### Primary Pillars of the Platform:
1. **Live Internet Data Scraping Engine**:
   - **Google Maps Local Businesses Scraper**: Discover hotels, restaurants, clinics, contractors, dentists, plumbers, etc., with verified phone numbers, addresses, ratings, review counts, and websites.
   - **Job Board Scraper & 1-Click Auto-Apply**: Scrape open job listings, extract recruiter contacts, auto-generate tailored pitches/resumes, and trigger automated email or conversational voice introduction calls.
   - **People & Companies Search**: Sourcing tools for decision-makers, LinkedIn profiles, employee headcount, tech stacks, and lookalike audiences.
2. **High-Performance Reactive Data Engine (Clay Table)**:
   - Spreadsheet engine supporting thousands of rows with live cell-level status, custom formulas, waterfall enrichment, and auto-run queues.
   - **Claygent AI**: Autonomous web-browsing agent that visits target URLs, identifies decision-makers, detects tech stacks, and writes hyper-personalized icebreakers.
   - **Functions & Reusable Scripts**: Custom JavaScript/Python formula columns and webhooks.
   - **Model Context Protocol (MCP)**: Native client/server integration for ChatGPT, Claude, and Grok.
3. **Real-Time Voice AI Studio & Telephony (Smallest.ai Engine)**:
   - **Conversational Voice Agent Studio**: Build bots with customizable Role & Objective, customer context variables (`{{name}}`, `{{company}}`), first messages, and real-time multilingual switching (e.g. Hindi, English, Spanish).
   - **Interactive Slide-Out Testing Drawer**: Live in-browser **Webcall simulator** (with an animated 3D pulsing Voice Orb), **International Telephony dialer** (+91 India, +1 US, +44 UK, +33 France, +61 Australia), and live **Chat**.
   - **Voice Playground**: Multi-voice Text-to-Speech (TTS), real-time Speech-to-Text (STT) with vocabulary boosting & PII/PCI redaction, and 10-second instant Voice Cloning.
   - **Telephony & Infrastructure Hub**: 20-slot Concurrency allocator, Phone number rental/routing, RAG Knowledge Base for agent context, and Webhook event subscriptions.
4. **Multi-Channel Outreach & Call Analytics**:
   - Outbound batch campaigns combining Cold Email Sequences + Automated Voice Dialing + WhatsApp triggers.
   - Deep-dive Call Analytics with heatmaps, answer rate trends, agent leaderboards, and daily concurrency charts.
5. **Rentable & Multi-Tenant Ready**:
   - Built to be deployed as a rentable SaaS platform for local business owners, agencies, and hackathon demonstrations.

---

## 2. Complete Summary of All User Requirements & System Instructions

| ID | Module / Requirement | Description & Technical Scope |
|---|---|---|
| **REQ-01** | **Local Business Scraping** | Extract local businesses from Google Maps by category and location with live data (name, Google Maps URL, description, website, phone, address, rating, reviews count). |
| **REQ-02** | **Job Seeker & Auto-Apply Suite** | Search job openings, scrape hiring manager details, auto-write cover letters, and send email applications or initiate automated voice screening calls. |
| **REQ-03** | **Reactive Spreadsheet Grid** | Virtualized table matching Clay UI with column types (Text, Link, Number, Status, Rating, Waterfall, AI Formula), multi-table tabs, and auto-run toggle. |
| **REQ-04** | **Claygent AI Web Researcher** | Natural language agent creator with starter templates (*Prospecting, Account Scoring, Contact Scoring, Copywriting*). |
| **REQ-05** | **Conversational Voice Agent Studio** | Prompt editor with Role & Objective, dynamic variable injection, model selection (GPT 4.1, Gemini Flash, Claude 3.7), and neural voice selection (*Quinn, Magnus, Ella, Rhea, Jessica*). |
| **REQ-06** | **Interactive Voice Testing Drawer** | Slide-out drawer with Webcall simulator, animated 3D Voice Orb, Telephony country dialer (+91, +1, +44), and live transcripts. |
| **REQ-07** | **Voice Playground** | TTS studio (speed/sample rate/voice selector), STT studio (microphone recorder, custom key terms, PII/PCI redaction), and Voice Cloning. |
| **REQ-08** | **Telephony & Infrastructure** | Concurrency manager (20 shared/reserved slots), Phone Number rental, RAG Knowledge Base, and Webhooks. |
| **REQ-09** | **Call Analytics Dashboard** | Overview, Phone Numbers performance, Call Patterns heatmap, and Daily Stats. |
| **REQ-10** | **Rentable Multi-Tenant Architecture** | Credit usage balance (Enrichment Credits + Voice PAYG Balance), multi-workspace switcher, and client management. |

---

## 3. Comprehensive Breakdown of All 20 Provided Screenshots

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 20 SCREENSHOT TEARDOWN & RECON                                  │
├────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│ CLAY.COM SCREENS (1 - 10)                      │ SMALLEST.AI SCREENS (11 - 20)                  │
├────────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 1. Home Dashboard & AI Prompt Bar              │ 11. Real-Time Voice AI Landing Page & Orb      │
│ 2. Find Leads: People & Companies              │ 12. Voice Workspace Dashboard                  │
│ 3. Find Leads: Local Businesses & Jobs         │ 13. Agents Directory & Call Counts             │
│ 4. Clay Ads Feature Dialog                     │ 14. Voice Agent Prompt & Multilingual Studio   │
│ 5. Campaigns & Email Sequences                 │ 15. Slide-Out Webcall & Telephony Dialer Drawer│
│ 6. Claygents Natural Language Builder          │ 16. Concurrency Allocation & Reservation Hub   │
│ 7. Functions & Custom Formulas Registry        │ 17. Split-View RAG Knowledge Base Manager      │
│ 8. MCP (Model Context Protocol) Server Admin   │ 18. Phone Numbers Rental & Routing Hub         │
│ 9. High-Perf Google Maps Spreadsheet Grid      │ 19. Voice Outbound Calling Campaigns           │
│ 10. Workflows Visual DAG Orchestrator          │ 20. WhatsApp Voice/Chat Integration            │
│                                                │ 21. Call Analytics (Overview, Heatmaps, Daily) │
│                                                │ 22. Text to Speech Playground                  │
│                                                │ 23. Speech to Text Studio with Redaction       │
│                                                │ 24. Instant Voice Cloning Studio               │
│                                                │ 25. Webhooks Event Subscriptions               │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Detailed Screen Teardowns:
1. **Screenshot 1 — Clay Main Dashboard (`/app/home`)**:
   - Sidebar: Collapsible with logo, Home, Find leads, Orchestration (Signals, Ads, Campaigns, Claygents, Functions, Workflows, MCP), Utility (Exports, Trash, Settings, AI context).
   - Header: Greeting (*"Hey sandeep, ready to get started?"*), `Show less ^` toggle, Universal AI prompt bar (*"Ask me anything about Clay or describe what you'd like to do..."*), Blue `Upgrade your plan` button.
   - Quick Action Cards: *Find leads* (green), *Import data* (purple), *Build a segment* (orange), *Create a campaign* (red), *Start from template* (blue).
   - File Explorer: Tabs for *All files*, *Recents*, *Favorites*, filter row (*Owner: All*, *Filters*), and table list with columns for Name, Favorite star, Tags, Created at, Last opened, Owner, Access, and More options.
2. **Screenshots 2 & 3 — Find Leads Popover Menu**:
   - Sub-items: *People* (LinkedIn/seniority), *Companies* (B2B/firmographics), *Jobs* (hiring trends), *Local businesses* (Google Maps scraper), *Company lookalikes* (competitor finder).
3. **Screenshot 4 — Clay Ads Feature Modal**:
   - Dark teal modal featuring 3D clay graphics, benefits list, and action buttons (*Learn more*, *Upgrade plan*).
4. **Screenshot 5 — Campaigns Center (`/app/campaigns`)**:
   - Tabs: *Sequences*, *Email accounts*, *Account orders*, *Blocklist*.
   - Actions: *Inbox*, *Analytics*, `+ New campaign`.
5. **Screenshot 6 — Claygents Builder (`/app/claygents`)**:
   - Natural language prompt textarea, model selector dropdown, file uploader, and 4 starter template cards (*Prospecting, Account Scoring, Contact Scoring, Copywriting*).
6. **Screenshot 7 — Functions Hub (`/app/functions`)**:
   - Directory of workspace formulas and API scrapers with *All*, *Clay managed*, *Recents*, *Favorites* tabs.
7. **Screenshot 8 — MCP Management (`/app/mcp`)**:
   - Default credit limit setting (1,000 credits), *Hide default functions* toggle, allowed client switches (*ChatGPT, Claude, Grok, Unknown*), and active connections list.
8. **Screenshot 9 — Spreadsheet Grid (`/app/table/:id` — Manali Hotels Table)**:
   - Ribbon: Auto-run toggle (ON), 0 queue counter, view selector, column manager (9/11 columns), filters, sort, search, Sandbox Mode, Sculptor AI, and Tools menu.
   - Columns: Status pill (*📍 Business Found*), Business Name, Google Maps URL, Description snippet, Website link, Standardized Phone, Full Address, Numeric Rating (*3.9 to 5.0*), Review Count.
   - Footer: Multi-table tab bar (*Overview, Find local businesses on..., + Add*), Table up to date indicator, Stop button, History log.
9. **Screenshot 10 — Workflows Canvas (`/app/workflows`)**:
   - Dot-grid visual DAG designer with natural language prompt, 3 starter triggers (*Start with a trigger, Start with a segment, Import a table*), and suggested blueprints.
10. **Screenshot 11 — Smallest.ai Landing Page & Voice Hero**:
    - "Real-time Voice AI. Built to Scale.", interactive 3D voice agent orb ("Sales Agent Leo"), TTS/STT switcher.
11. **Screenshot 12 — Voice Dashboard**:
    - Sidebar with Playground (TTS, STT, Voice Cloning), Create (Agents, Concurrency, Knowledge Base), Deploy (Audiences, Phone Numbers, Campaigns, WhatsApp), Monitor (Analytics, Evaluations), Billing ($9.76 PAYG left).
    - Quick actions: *Build an Agent*, *Read Docs*, *Get API Keys*, *Clone a voice*, and Featured voices (*Quinn, Magnus, Ella*).
12. **Screenshot 13 — Voice Agents List (`/app/agents`)**:
    - Table showing configured agents (*Car Loan EMI Collections, Local Business Booker, etc.*), last updated dates, and total call counts.
13. **Screenshots 14 & 15 — Voice Agent Studio & Testing Drawer**:
    - Prompt Editor: Role & Objective textarea, Customer Context preloaded variables (`{{customer_name}}`), First message input with Hindi/English greeting.
    - Right Config: Model (GPT 4.1), Multilingual switcher (Hindi Primary, English, Language switching enabled toggle), Voice selector (*Rhea*).
    - Slide-Out Drawer: Telephony tab with country selector (+91 India, +1 US, +44 UK, +33 France, +61 Australia), Phone number input, `Start call` button, Webcall tab with 3D Voice Orb, and Chat tab.
14. **Screenshot 16 — Concurrency Manager (`/app/concurrency`)**:
    - Progress gauge (0 reserved of 20 concurrencies) and per-agent priority allocation table across Webcall, Chat, Outbound, and Inbound.
15. **Screenshot 17 — RAG Knowledge Base Manager (`/app/knowledge-base`)**:
    - Split-view interface with collections on the left and document/URL management on the right.
16. **Screenshot 18 — Phone Numbers Hub (`/app/phone-numbers`)**:
    - Number provisioning, carrier import, and inbound/outbound agent mapping.
17. **Screenshot 19 — Voice Outbound Campaigns (`/app/campaigns`)**:
    - Batch automated phone calling campaigns powered by voice agents and audience segments.
18. **Screenshot 20 — WhatsApp Integration (`/app/whatsapp`)**:
    - WhatsApp Business voice & chat deployment with persistent conversation memory.
19. **Screenshot 21 — Call Analytics (`/app/analytics`)**:
    - 4 Analysis Section Cards: *Overview* (volume & answer rates), *Phone Numbers* (pickup rates & alerts), *Call Patterns* (hourly heatmaps & WoW trends), and *Daily Stats* (per-minute concurrency).
20. **Screenshots 22, 23, 24, 25 — Voice Playground & Webhooks**:
    - TTS Studio with speed slider (1.0x) and sample rate (24000 Hz).
    - STT Studio with real-time audio waveform, key terms vocabulary boosting, and PII/PCI redaction toggles.
    - Voice Cloning Studio for 10-second reference audio uploads.
    - Webhooks hub for signed HTTPS event payloads.

---

## 4. Visual Design System & Tokens

### 4.1 Color Palette
- **Canvas Floor**: `#fffaf0` (Signature warm cream background)
- **Surface Soft**: `#faf5e8` (Top nav, sub-headers, cards)
- **Surface Card**: `#f5f0e0` (Neutral card backgrounds)
- **Surface Dark**: `#0a1a1a` (Dark feature cards & modal backdrops)
- **Primary Ink**: `#0a0a0a` (Near-black with warm tone for typography)
- **Saturated Feature Card Palette**:
  - `Brand Pink`: `#ff4d8b` (Campaigns & sequencers)
  - `Brand Teal`: `#1a3a3a` (Deep enterprise teal)
  - `Brand Lavender`: `#b8a4ed` (AI & Claygent tools)
  - `Brand Peach`: `#ffb084` (Data import & CSV sync)
  - `Brand Ochre`: `#e8b94a` (Signals & filters)
  - `Brand Mint`: `#a4d4c5` (Lead discovery & success badges)
  - `Voice Gold / Amber`: `#f59e0b` (Pulsing 3D Voice Orb)
  - `Emerald Accent`: `#10b981` (Voice action buttons)
  - `Blue Primary`: `#2563eb` (Data grid actions & upgrade buttons)

### 4.2 Typography & Radii
- **Display Font**: `Plain Black` (or `Inter` weight 500/600 with `-1px` to `-2.5px` tracking)
- **Body & UI Font**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Border Radii**: `6px` (xs), `8px` (sm), `12px` (md for buttons/inputs), `16px` (lg for cards/tables), `24px` (xl for feature banners), `9999px` (pills).

---

## 5. Internet Scraping & Automated Outreach Architecture

```
                               ┌────────────────────────────────┐
                               │   LIVE DATA SCRAPING ENGINE    │
                               └───────────────┬────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
     [ Google Maps Places ]           [ Job Boards / Recruiter ]          [ Claygent Web R&D ]
     - Local Business name            - Tech job listings                 - Website URL crawler
     - Google Maps URL                - Recruiter name & email            - Tech stack detector
     - Address & City                 - Recruiter phone number            - Decision maker extractor
     - Phone with country code        - Required skills & salary          - AI icebreaker writer
     - Star rating & reviews count    - Remote / On-site status           - Pain point analysis
               │                               │                               │
               └───────────────────────────────┼───────────────────────────────┘
                                               │
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │   REACTIVE SPREADSHEET (CLAY DATA GRID)   │
                         │  - Auto-streaming incoming rows           │
                         │  - Cell formula calculation               │
                         │  - 10+ live column types                  │
                         └─────────────────────┬─────────────────────┘
                                               │
                               ┌───────────────┴───────────────┐
                               ▼                               ▼
                 [ ✉️ Email Outreach Sequencer ]    [ 📞 Conversational Voice AI Dialer ]
                 - Personalized cold emails        - Real-time phone calls via Telephony
                 - Dynamic column variables        - Multilingual neural voices (Hindi/EN)
                 - Multi-day cadence triggers      - Appointment booking & qualification
                 - Open/click/reply tracking       - Instant Webcall testbed with 3D Orb
```

---

## 6. Phased Implementation Roadmap

- **Phase 1 — Master Layout & Unified Design System**:
  - Implement full CSS design tokens, collapsible dual-mode sidebar (Data & Tables + Voice AI Studio), and top navigation header with universal AI prompt bar and dual credit tracker.
- **Phase 2 — Home Dashboard & Universal AI Command Center**:
  - Dynamic greeting, 6 multi-colored action starter cards, recent files table, and featured voice agents.
- **Phase 3 — Internet Scraping Studio & Job Seeker Hub**:
  - Live Google Maps scraper with city/category parameters.
  - Job board search with recruiter contact extractor and 1-click tailored application generator.
- **Phase 4 — Reactive Spreadsheet Engine (`/app/table/:id`)**:
  - High-performance data grid matching the Manali hotel table screenshot, complete with auto-run toggle, status pills, phone links, Google Maps links, and action buttons.
- **Phase 5 — Smallest.ai Voice Agent Studio & Interactive Testing Drawer**:
  - Multi-tab prompt editor with role/objective, context variables, Hindi/English multilingual toggle, and voice selector.
  - Slide-out testing drawer with live Webcall (featuring the 3D animated Voice Orb), International Telephony dialer (+91, +1, +44), and live Chat.
- **Phase 6 — Voice Playground Studio**:
  - Text-to-Speech synthesizer with speed/sample rate controls.
  - Speech-to-Text transcriber with key terms boosting and PII/PCI redaction.
  - Voice Cloning studio with reference audio preview.
- **Phase 7 — Concurrency, Phone Numbers & Knowledge Base**:
  - 20-slot concurrency allocation gauge and priority slots.
  - Inbound/outbound phone number rental and RAG document manager.
- **Phase 8 — Multi-Channel Campaigns & Call Analytics**:
  - Unified outreach campaigns (Email Sequences + Automated Phone Calls + WhatsApp).
  - Deep-dive Call Analytics with heatmaps, answer rate trends, and daily concurrency charts.
- **Phase 9 — Verification & Polish**:
  - End-to-end user flow testing across all breakpoints and complete documentation update.
