/**
 * Demo analytics dataset — every number here is illustrative. Consuming
 * pages must render the "Demo data" label alongside anything sourced from
 * this file; see docs/MOCK_DATA_BOUNDARIES.md.
 */

export interface DemoDailyStat {
  date: string;
  calls: number;
  connected: number;
  avgDurationS: number;
}

export const DEMO_DAILY_STATS: DemoDailyStat[] = [
  { date: '2026-08-18', calls: 142, connected: 96, avgDurationS: 187 },
  { date: '2026-08-19', calls: 168, connected: 114, avgDurationS: 201 },
  { date: '2026-08-20', calls: 155, connected: 101, avgDurationS: 176 },
  { date: '2026-08-21', calls: 190, connected: 138, avgDurationS: 213 },
  { date: '2026-08-22', calls: 176, connected: 122, avgDurationS: 195 },
  { date: '2026-08-23', calls: 132, connected: 88, avgDurationS: 168 },
  { date: '2026-08-24', calls: 121, connected: 79, avgDurationS: 159 }
];

export interface DemoAgentLeaderboardRow {
  agentName: string;
  calls: number;
  connectRate: number;
  avgDurationS: number;
  bookedMeetings: number;
}

export const DEMO_AGENT_LEADERBOARD: DemoAgentLeaderboardRow[] = [
  { agentName: 'Inbound Qualifier — Hindi/English', calls: 412, connectRate: 0.71, avgDurationS: 198, bookedMeetings: 58 },
  { agentName: 'Outbound SDR — English', calls: 380, connectRate: 0.64, avgDurationS: 172, bookedMeetings: 41 },
  { agentName: 'Renewal Reminder — English', calls: 210, connectRate: 0.58, avgDurationS: 94, bookedMeetings: 12 },
  { agentName: 'Job Applicant Screener', calls: 96, connectRate: 0.69, avgDurationS: 240, bookedMeetings: 21 }
];

export interface DemoPhoneNumberStat {
  e164: string;
  label: string;
  calls: number;
  connectRate: number;
}

export const DEMO_PHONE_PERFORMANCE: DemoPhoneNumberStat[] = [
  { e164: '+1 415 555 0111', label: 'US — Sales line', calls: 512, connectRate: 0.68 },
  { e164: '+91 80 4611 2200', label: 'India — Support line', calls: 340, connectRate: 0.61 },
  { e164: '+44 20 3966 0177', label: 'UK — Renewals line', calls: 128, connectRate: 0.55 }
];

export const DEMO_CALL_PATTERNS = {
  byHour: [4, 6, 9, 18, 32, 41, 38, 44, 52, 47, 39, 28, 22, 30, 41, 36, 24, 15, 9, 6, 4, 2, 1, 1],
  byWeekday: [62, 74, 81, 79, 68, 22, 14]
};

export const DEMO_ANALYTICS_OVERVIEW = {
  totalCalls: 1214,
  connectRate: 0.66,
  avgDurationS: 189,
  bookedMeetings: 132,
  totalMinutes: 3824
};
