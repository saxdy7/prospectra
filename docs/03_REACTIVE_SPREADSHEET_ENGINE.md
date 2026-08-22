# Module 03: Reactive Spreadsheet & Table Engine

## 1. Overview
The Spreadsheet Engine is a high-performance, virtualized data grid matching the Clay.com interface (based on Screenshot 9: *Find local businesses on Google Maps Table*). It supports cell-level live statuses, custom formula execution, and waterfall enrichment providers.

---

## 2. Table Anatomy & Column Specifications

```
┌────┬──────────────────────┬──────────────────────┬──────────────────────┬─────────────┬─────────────┬──────────┬───────────┐
│ #  │ 📍 Source (Maps)     │ 🔤 T Name            │ 🔗 Maps URL          │ 🌐 Website  │ 📞 Phone    │ ⭐ Rating│ 💬 Reviews│
├────┼──────────────────────┼──────────────────────┼──────────────────────┼─────────────┼─────────────┼──────────┼───────────┤
│ 1  │ 📍 Business Found    │ The Manali Lodge     │ https://maps.goo...  │ https://... │ +91 99997...│ 4.3      │ 315       │
│ 2  │ 📍 Business Found    │ Hotel Cherry Manali  │ https://maps.goo...  │ https://... │ +91 99582...│ 4.9      │ 520       │
└────┴──────────────────────┴──────────────────────┴──────────────────────┴─────────────┴─────────────┴──────────┴───────────┘
```

### 2.1 Column Types Supported
1. **Source / Integration Column**: Displays integration state with header `✓ Up to date` and cell status pills (e.g. `📍 Business Found`).
2. **Text (`T`)**: High-speed text editing with inline search.
3. **URL (`🔗`)**: Formatted clickable external links.
4. **Phone (`📞`)**: Formatted international numbers with direct 1-click `Call with Voice Agent` action.
5. **Email (`✉️`)**: Verified email addresses with deliverability health indicator.
6. **Number (`#`)**: Ratings (3.9 - 5.0), review counts, prices, headcount.
7. **AI Formula / Claygent**: Natural language prompt evaluated per row (e.g. *"Summarize top 3 customer complaints from Google reviews"*).
8. **Waterfall Enrichment**: Sequential multi-provider fallback (Apollo -> Hunter -> Clearbit -> Prospeo).

---

## 3. Ribbon Controls & Toolbar
- **Auto-run**: Toggle live background execution for incoming rows.
- **Queue Counter**: Shows number of active enrichment/scraping jobs (e.g. `0`).
- **View Selector**: Switch between `Default view`, `High Rating Only`, `Pending Outreach`.
- **Column Manager**: Hide, show, and reorder columns (e.g. `9/11 columns`).
- **Filter, Sort & Search**: Fast client-side filtering and multi-column sorting.
- **Sculptor AI & Tools**: AI assistant to generate formulas, clean data, and format phone numbers.
- **Bottom Multi-Table Tab Bar**: Switch between multiple tables in the same workbook (`Overview`, `Find local businesses on...`, `+ Add`).
