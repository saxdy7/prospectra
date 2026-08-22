# Module 01: Scraping & Lead Sourcing Engine

## 1. Overview
The Lead Sourcing Engine is designed to scrape any target client, business sector, or local service from the public web and stream the verified records directly into reactive tables.

---

## 2. Google Maps Local Business Scraper

### 2.1 Inputs & Search Parameters
- **Category / Keyword**: E.g. *"Hotels"*, *"Restaurants"*, *"Plumbers"*, *"Dentists"*, *"Real Estate Agents"*, *"Contractors"*.
- **Location**: City, State, Country, or Postal Code (e.g. *"Manali, India"*, *"Austin, TX"*, *"London, UK"*).
- **Search Radius**: 5km to 50km radius.
- **Min Rating Filter**: E.g. `≥ 3.5 stars`, `≥ 4.0 stars`.
- **Max Results Limit**: 10 to 500 records per run.

### 2.2 Extracted Data Schema
```typescript
interface ScrapedLocalBusiness {
  id: string;
  name: string;              // e.g. "Oyo 7373 The Nirvana Retreat"
  googleMapsUrl: string;     // e.g. "https://www.google.com/maps/place/..."
  description: string;       // e.g. "Casual rooms & cottages with mountain views..."
  website: string;           // e.g. "https://www.oyorooms.com"
  phone: string;             // e.g. "+91 124 620 1184"
  address: string;           // e.g. "Village nasogi near DPS school, Manali, HP"
  rating: number;            // e.g. 3.9
  reviewsCount: number;      // e.g. 142
  category: string;          // e.g. "Hotel / Resort"
  city: string;              // e.g. "Manali, India"
  status: 'Business Found';  // Status indicator
}
```

### 2.3 Scraping Architecture
1. **Zero-Cost Headless Engine**: Built-in scraper that queries Google Places search results without requiring paid third-party APIs.
2. **API Connectors (Optional)**: Direct plug-and-play support for Serper API, SerpAPI, Outscraper, and Google Places API.
3. **Reactive Stream**: Scraped rows appear in real-time inside the data grid as they are fetched.

---

## 3. B2B People & Company Sourcing
- **People**: Search LinkedIn by Job Title, Seniority, Location, and Company Size.
- **Companies**: Filter by Technology Stack (e.g. *"Using Shopify & HubSpot"*), Headcount, and Industry.
- **Lookalikes**: Input a seed website (e.g. `linear.app`) to discover 20+ similar competitors.
