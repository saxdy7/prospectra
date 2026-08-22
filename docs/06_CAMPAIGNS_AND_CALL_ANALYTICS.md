# Module 06: Multi-Channel Campaigns & Call Analytics

## 1. Overview
The Campaigns & Analytics module manages unified multi-channel outbound campaigns (combining Cold Email Sequences, Batch AI Voice Calling, and WhatsApp messages) alongside comprehensive real-time Call Analytics.

---

## 2. Multi-Channel Outreach Engine

### 2.1 Campaign Setup Flow
1. **Target Audience**: Select rows from the Google Maps Scraper or Job Hunter tables.
2. **Channel Sequence**:
   - **Step 1 (Day 1)**: Personalized Cold Email with dynamic variables (`{{first_name}}`, `{{company}}`, `{{icebreaker}}`).
   - **Step 2 (Day 3)**: Automated Conversational Voice Call via Telephony bot. If answered -> record outcome; if busy -> leave custom voicemail.
   - **Step 3 (Day 5)**: WhatsApp follow-up with calendar booking link.
3. **Delivery Rules**: Custom sending windows, time-zone alignment, and rate limiting.

---

## 3. Call Analytics Dashboard (`/app/analytics`)

Based on Screenshot 16, the analytics suite is divided into 4 specialized views:

### 3.1 Overview *(Best for Ops Leads & Managers)*
- Total call volume, connection rates, answer rate trends.
- Cost per completed call and top-performing voice agent leaderboard.
- Peak concurrency usage graphs.

### 3.2 Phone Numbers *(Best for Campaign Managers & Telephony Ops)*
- Per-number pickup rates and answer distribution.
- Low-performing number alerts and spam flag detection.

### 3.3 Call Patterns *(Best for Analysts & Team Leads)*
- Hourly heatmap showing best times to call by region.
- Call duration percentiles (median vs. top 10%).
- Week-over-week (WoW) performance trends and AI-generated call insights.

### 3.4 Daily Stats *(Best for Engineering & Infrastructure)*
- Per-minute concurrency timeline.
- Call start volume distribution and per-agent concurrency load table.
