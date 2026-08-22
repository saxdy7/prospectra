# Module 04: Real-Time Voice AI Studio & Testbed

## 1. Overview
The Voice AI Studio (modeled after Smallest.ai, Screenshots 11–15) provides an end-to-end environment for creating, configuring, and testing conversational voice agents capable of conducting human-like telephone calls in real-time.

---

## 2. Voice Agent Studio Components

### 2.1 Prompt & Behavior Configuration
- **Role & Objective**: Detailed system prompt defining the agent persona, goals, escalation policies, and tone (e.g. Loan Recovery, Demo Booking, Customer Support).
- **Customer Context (Pre-Loaded Variables)**: Dynamic parameters injected from table columns:
  - `{{customer_name}}`: Contact's full name.
  - `{{company_name}}`: Scraped business name.
  - `{{overdue_amount}}` or `{{job_title}}`: Custom contextual attributes.
- **First Message**: Initial spoken phrase when the call connects (e.g. *"नमस्ते, आप कैसे हैं?"* or *"Hi there, I noticed your business on Google Maps..."*).

### 2.2 Model & Multilingual Switching
- **Language Models**: GPT 4.1, Gemini 2.5 Flash, Claude 3.7 Sonnet.
- **Multilingual Support**: Real-time language switching (Primary: Hindi, English, Spanish, French, etc.) with automatic language detection during live conversation.
- **Voice Library**: Selection of neural voices (*Rhea, Quinn, Magnus, Ella, Jessica*).

---

## 3. Interactive Slide-Out Testing Drawer

```
┌────────────────────────────────────────────────────────┐
│ [ Telephony ]      [ Webcall ]         [ Chat ]        │
├────────────────────────────────────────────────────────┤
│                                                        │
│   ┌──────────────────────────────────────────────┐     │
│   │                 ( Voice Orb )                │     │
│   │             Glowing 3D Animated              │     │
│   │              Audio Sphere                    │     │
│   └──────────────────────────────────────────────┘     │
│                                                        │
│   Country: [ 🇮🇳 India (+91) ▾ ]                        │
│   Phone:   [ +91 98050 47905         ]                 │
│                                                        │
│   [ 📞 Start Call ]              [ ⏹ End Call ]        │
│                                                        │
│   Live Transcript:                                     │
│   Agent: "नमस्ते, आप कैसे हैं?"                          │
│   User:  "Hello, I am good, who is this?"              │
│   Agent: "I'm calling from Smallest Bank regarding..." │
└────────────────────────────────────────────────────────┘
```

- **Webcall Simulator**: In-browser microphone call with real-time speech recognition, LLM reasoning, and ultra-low-latency voice synthesis.
- **Telephony Dialer**: Direct telephone calls to actual phone numbers in India (+91), USA (+1), UK (+44), France (+33), and Australia (+61).
