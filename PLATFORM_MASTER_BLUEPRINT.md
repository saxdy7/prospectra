# Master System Blueprint & Product Specification: Autonomous Data, Scraping & Voice AI Platform

---

## 1. Executive Summary & Vision

This platform combines the best of **Clay.com** (Data Orchestration, Scraping, Reactive Spreadsheet, Waterfall Enrichment, Claygent AI) with **Smallest.ai** (Real-Time Voice AI, Conversational Voice Agents, Telephony Calling, Webcall Testing, TTS/STT, Voice Cloning, Concurrency & Call Analytics) into a single, powerhouse **Autonomous Go-To-Market (GTM) & Client Acquisition System**.

### Primary Value Proposition
1. **Scrape Any Client or Local Business**: Live-scrape Google Maps, websites, directories, and job boards to extract verified company details, phone numbers, owner emails, and ratings.
2. **Enrich & Research with AI**: Autonomous Claygent bots research each target website, finding pain points, technology stacks, and personalized icebreakers.
3. **Autonomous Outreach via Email & Real-Time Voice Calls**: Launch multi-step cold email sequences AND conversational AI phone calls (using realistic neural voices with multilingual capabilities like Hindi/English) to qualify leads, book appointments, or collect payments.
4. **Job Discovery & 1-Click Application**: Job seekers can discover open positions, scrape recruiter emails/phones, auto-generate tailored resumes/pitches, and trigger automated email or voice introductory pitches.
5. **Rentable & Multi-Tenant**: Built so you can rent access out to local business owners, agencies, and clients.

---

## 2. Complete Summary of User Instructions & Requirements Received

| # | Requirement / Instruction | Implementation Strategy |
|---|---|---|
| 1 | **Rentable for Local Businesses & Clients** | Multi-workspace architecture, customizable branding, usage credit system (Enrichment Credits + Voice Balance like PAYG $9.76). |
| 2 | **Internet Data Scraping** | Integrated zero-cost Google Maps scraper, Google Places / Serper API hooks, Web crawler, and Job board scrapers. |
| 3 | **Job Sourcing & Auto-Apply** | Dedicated Job Finder module with recruiter contact extraction, AI resume/pitch writer, and automated email/voice applications. |
| 4 | **Clay.com Spreadsheet Engine** | High-performance virtualized data grid with 10+ column types, formulas, auto-run toggles, and waterfall enrichment. |
| 5 | **Claygent AI Web Researcher** | Natural language AI agent builder with template starter cards (*Prospecting, Account Scoring, Contact Scoring, Copywriting*). |
| 6 | **Smallest.ai Real-Time Voice Studio** | Voice Agent Studio with Role/Objective prompt editor, customer context variables (`{{name}}`), multilingual switching (Hindi/English), and voice selection. |
| 7 | **Telephony & Webcall Testing Drawer** | Slide-out interactive drawer with live in-browser Webcall (featuring the 3D animated Voice Orb), International Telephony dialer (+91, +1, +44), and Chat. |
| 8 | **Voice Playground** | Text-to-Speech (speed/sample rate/voice selector), Speech-to-Text (real-time recording, key terms, PII/PCI redaction), and Voice Cloning. |
| 9 | **Infrastructure & Telephony Management** | Concurrency manager (20 shared/reserved slots), Phone Number rental/routing, RAG Knowledge Base, Webhooks, and Call Analytics. |
| 10 | **Next-Level Hackathon-Ready UI** | Warm cream canvas (`#fffaf0`) + Clay 6-color saturated palette + Smallest.ai glowing 3D Voice Orb. |

---

## 3. Comprehensive Breakdown of All 20 Provided Screenshots

### Part A: Clay.com Suite (Screenshots 1 – 10)
1. **Home / Dashboard (`/app/home`)**: Collapsible navigation sidebar, dynamic greeting, universal AI prompt bar (*"Ask me anything about Clay..."*), 5 multi-color action cards (*Find leads, Import data, Build a segment, Create a campaign, Start from template*), file explorer table with favorites, tags, and ownership.
2. **Find Leads Popover (People & Companies)**: Sourcing menus for People, Companies, and Lookalikes.
3. **Find Leads Popover (Local Businesses & Jobs)**: Direct triggers for Google Maps local business scraper and Job board search.
4. **Clay Ads Feature Modal**: Dark-teal dialog with 3D clay graphics and benefit points.
5. **Campaigns Screen (`/app/campaigns`)**: Sequences, Email accounts, Blocklist, Unified Inbox, and Analytics.
6. **Claygents Builder (`/app/claygents`)**: Natural language prompt input, model selector, file uploader, and 4 starter templates (*Prospecting, Account Scoring, Contact Scoring, Copywriting*).
7. **Functions Hub (`/app/functions`)**: Custom formula/webhook execution registry and filters.
8. **MCP Settings (`/app/mcp`)**: Model Context Protocol configuration, default credit limits, security switches, and client whitelist (*ChatGPT, Claude, Grok*).
9. **Interactive Table Engine (`/app/table/:id`)**: High-performance grid showing scraped Google Maps local businesses (Hotel Manali dataset) with columns for *Status, Name, Google Maps URL, Description, Website, Phone, Address, Rating, and Review Count*, auto-run toggle, Sculptor AI assistant, and multi-tab footer.
10. **Workflows Canvas (`/app/workflows`)**: Visual DAG workflow builder with trigger, segment, and table import nodes.

### Part B: Smallest.ai Voice Suite (Screenshots 11 – 20)
11. **Smallest.ai Landing Page & Voice Orb**: Real-time Voice AI hero with interactive voice agent orb and speed/multimodal model highlights.
12. **Voice Home Dashboard**: Clean organization workspace with quick actions (*Build an Agent, Read Docs, API Keys, Clone Voice*) and featured neural voices (*Quinn, Magnus, Ella*).
13. **Agents List (`/app/agents`)**: Directory of configured conversational voice bots showing call counts and status.
14. **Voice Agent Prompt Studio**: Editor for Role & Objective, Customer Context variables, first message, language switcher (Hindi/English), and voice selection.
15. **Slide-Out Testing Drawer**: Live Webcall simulator, International Telephony dialer (+91 India, +1 US, +44 UK, +33 France, +61 Australia), and Chat.
16. **Concurrency Manager (`/app/concurrency`)**: 20-slot concurrency allocation gauge and per-agent priority slot reservations across Webcall, Chat, Outbound, and Inbound.
17. **Knowledge Base Manager (`/app/knowledge-base`)**: Split-view document/URL library that equips voice agents with RAG context during live calls.
18. **Phone Numbers Hub (`/app/phone-numbers`)**: Inbound and outbound number rental and agent routing.
19. **Voice Outbound Campaigns (`/app/campaigns` - Voice Outbound)**: Batch automated dialer linking audience segments with voice agents and caller IDs.
20. **WhatsApp AI Agent Integration (`/app/whatsapp`)**: Conversational memory and direct WhatsApp voice calling capabilities.
21. **Call Analytics (`/app/analytics`)**: 4 deep-dive cards (*Overview, Phone Numbers, Call Patterns, Daily Stats*) with heatmaps, answer rate trends, and agent leaderboards.
22. **Text to Speech Playground (`/app/playground/tts`)**: Multi-voice synthesizer with speed control, custom sample rates, and scenario prompt starters.
23. **Speech to Text Studio (`/app/playground/stt`)**: Real-time microphone audio transcription with vocabulary boosting and PII/PCI redaction.
24. **Voice Cloning Studio (`/app/voice-cloning`)**: 10-second reference audio voice clone generator.
25. **Webhooks Hub (`/app/webhooks`)**: Signed JSON event subscriptions for call start, end, and analytics completion.

---

## 4. Internet Scraping Engine Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                     LIVE INTERNET SCRAPING ENGINE                      │
├────────────────────────┬───────────────────────┬───────────────────────┤
│ 1. LOCAL BUSINESSES    │ 2. JOB BOARDS         │ 3. CLAYGENT WEB R&D   │
│  - Google Maps Places  │  - Tech Job Postings  │  - Website Crawler    │
│  - Category & Geo-zip  │  - Recruiter Discovery│  - Tech Stack Sniffer │
│  - Phone & Website     │  - Salary & Skills    │  - Email Waterfall    │
│  - Ratings & Reviews   │  - 1-Click Auto Pitch │  - Icebreaker LLM     │
└────────────────────────┴───────────────────────┴───────────────────────┘
                                   │
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │     REACTIVE SPREADSHEET (TABLE GRID ENGINE)    │
          │  - Real-time row streaming                      │
          │  - Direct 1-Click Action: "Call with Voice Bot" │
          │  - Direct 1-Click Action: "Send AI Email Pitch" │
          └─────────────────────────────────────────────────┘
```

### 1. Local Businesses Scraper (Google Maps)
- **Input**: Keyword/Category (e.g. *"Hotels"*, *"Dentists"*, *"Plumbers"*) + Location (e.g. *"Manali, India"*, *"Austin, TX"*, *"London, UK"*).
- **Extracted Fields**:
  - `name`: Business name
  - `googleMapsUrl`: Direct link to Google Maps profile
  - `description`: Overview summary
  - `website`: Official website URL
  - `phone`: Direct contact number (formatted with country code)
  - `address`: Street address, city, postal code
  - `rating`: Star rating (1.0 to 5.0)
  - `reviewsCount`: Total Google reviews count
  - `status`: *"Business Found"*

### 2. Job Board Scraper & 1-Click Auto-Apply
- **Input**: Job Title (e.g. *"Full Stack AI Engineer"*, *"Growth Lead"*) + Location/Remote.
- **Extracted Fields**:
  - `title`, `company`, `location`, `salary`, `postedAt`
  - `recruiterName`, `recruiterEmail`, `recruiterPhone`
  - `skills`: Extracted requirements
- **Action**:
  - 📝 Auto-generate tailored pitch & cover letter.
  - ✉️ Send cold application email sequence.
  - 📞 Schedule automated voice introductory call with candidate pre-screening bot!

### 3. Claygent AI Autonomous Web Researcher
- Crawls target company website to extract:
  - Is the business B2B or B2C?
  - What software/tools are they using?
  - Who are the key executives?
  - High-converting personalized icebreaker sentence for outreach.

---

## 5. Master Screen Inventory

1. **Dashboard / Home Workspace (`/`)**: Dual Clay & Smallest.ai action hub, universal AI prompt bar, recent tables, and featured voice agents.
2. **Local Business Scraper Studio (`/scraper/local`)**: Live Google Maps discovery with keyword/location search and direct import to table.
3. **Job Sourcing & Auto-Apply Hub (`/jobs`)**: Job board scraper with 1-click email/voice application.
4. **Reactive Spreadsheet Grid (`/tables/:id`)**: Full table view matching the Google Maps Manali hotel table screenshot, with column customization and action triggers.
5. **Claygents AI Builder (`/claygents`)**: Natural language agent creator and template directory.
6. **Functions Hub (`/functions`)**: Custom formula and webhook directory.
7. **Voice Agent Studio (`/voice/agents`)**: Agent builder matching Smallest.ai with role, context variables, Hindi/English multilingual toggle, and voice selector.
8. **Interactive Testing Drawer (`Slide-Out Drawer`)**: Live Webcall (with 3D animated Voice Orb), International Telephony dialer, and Chat.
9. **Voice Playground (`/voice/playground`)**: Text-to-Speech, Speech-to-Text, and Voice Cloning studio.
10. **Concurrency & Phone Numbers (`/voice/infrastructure`)**: 20-slot concurrency allocation and number rentals.
11. **Knowledge Base RAG (`/voice/knowledge-base`)**: Split-view document and link curation for voice agents.
12. **Outreach & Multi-Channel Campaigns (`/campaigns`)**: Email Sequences + Automated Voice Calls + WhatsApp in one workflow.
13. **Call Analytics Dashboard (`/analytics`)**: Overview, Phone Numbers, Call Patterns, and Daily Stats.
14. **Webhooks & MCP Integrations (`/integrations`)**: Signed webhook subscriptions and Model Context Protocol settings.

---

## 6. Phased Implementation Roadmap

- **Phase 1**: Master Layout, Navigation Sidebar, Top Header, and unified Design Tokens.
- **Phase 2**: Home Workspace & Universal AI Command Hub.
- **Phase 3**: Internet Scraping Engine (Google Maps local business finder & Job board scraper).
- **Phase 4**: Reactive Spreadsheet Table Engine with live column types and cell rendering.
- **Phase 5**: Smallest.ai Voice Agent Studio & Interactive Testing Drawer (Webcall with 3D Voice Orb + International Telephony).
- **Phase 6**: Voice Playground (TTS, STT, Voice Cloning).
- **Phase 7**: Outreach Campaigns (Email Sequences + Voice Dialing) & Call Analytics.
- **Phase 8**: Polishing, responsive verification, and complete end-to-end testing.
