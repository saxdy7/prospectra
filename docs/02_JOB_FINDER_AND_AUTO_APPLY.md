# Module 02: Job Finder & Autonomous Auto-Apply Suite

## 1. Overview
The Job Seeker Suite allows users to scrape job openings from career portals and LinkedIn, extract recruiter contact information, auto-generate tailored pitches/resumes using AI, and trigger 1-click multi-step applications via email and automated voice calls.

---

## 2. Job Scraping Pipeline

### 2.1 Search Criteria
- **Job Title / Keywords**: E.g. *"Senior Full Stack AI Engineer"*, *"GTM Growth Lead"*, *"Voice ML Scientist"*.
- **Location**: Remote, Hybrid, or Specific City/Country.
- **Experience Level**: Junior, Mid, Senior, Lead, Executive.
- **Salary Range**: Filter by base compensation threshold.

### 2.2 Extracted Job Schema
```typescript
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  skills: string[];
  appliedStatus: 'Not Applied' | 'Pitch Emailed' | 'Voice Screened' | 'Interview Scheduled';
}
```

---

## 3. Autonomous 1-Click Application Flow

```
[ Scrape Job & Recruiter Details ]
               │
               ▼
[ AI Pitch & Cover Letter Generator ]
  - Analyzes candidate profile against job requirements
  - Generates 3 custom hooks tailored to the company
               │
               ├────────────────────────────────────────┐
               ▼                                        ▼
    [ ✉️ Cold Email Application ]             [ 📞 Automated Voice Intro Call ]
    - 3-step personalized sequence            - Recruiter screening bot calls recruiter
    - Dynamic resume attachment link          - Highlights top 3 candidate accomplishments
    - Tracks opens, clicks, and replies       - Offers automated interview scheduling
```

---

## 4. Recruiter Pre-Screening Voice Bot
- Enables candidates to configure a personal AI Voice Agent that answers initial recruiter screening calls:
  - Verifies years of experience with React, TypeScript, Python, LLMs, Voice AI.
  - Confirms availability and salary expectations.
  - Automatically books calendar slots for human interview rounds.
