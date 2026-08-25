/**
 * Demo job listings and hiring signals — for the job-search builder and the
 * job-hunter surfaces referenced in docs/02_JOB_FINDER_AND_AUTO_APPLY.md.
 */

export interface DemoJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: 'remote' | 'hybrid' | 'onsite';
  seniority: 'entry' | 'mid' | 'senior' | 'lead' | 'exec';
  skills: string[];
  postedAt: string;
  salaryRange?: string;
}

export const DEMO_JOBS: DemoJobListing[] = [
  { id: 'job-1', title: 'Senior Backend Engineer', company: 'HyperScale Cloud', location: 'Bengaluru, IN', remote: 'hybrid', seniority: 'senior', skills: ['Go', 'Kubernetes', 'PostgreSQL'], postedAt: '2026-08-18T00:00:00.000Z', salaryRange: '₹32L – ₹45L' },
  { id: 'job-2', title: 'Growth Marketing Manager', company: 'NeuralGlow AI', location: 'San Francisco, US', remote: 'remote', seniority: 'mid', skills: ['SEO', 'Paid Media', 'Analytics'], postedAt: '2026-08-20T00:00:00.000Z', salaryRange: '$110k – $140k' },
  { id: 'job-3', title: 'Product Designer', company: 'Cedar & Co', location: 'London, UK', remote: 'hybrid', seniority: 'mid', skills: ['Figma', 'Design Systems', 'Prototyping'], postedAt: '2026-08-15T00:00:00.000Z', salaryRange: '£55k – £70k' },
  { id: 'job-4', title: 'Data Engineer', company: 'Rupee Ledger', location: 'Mumbai, IN', remote: 'onsite', seniority: 'mid', skills: ['Python', 'Airflow', 'Spark'], postedAt: '2026-08-21T00:00:00.000Z', salaryRange: '₹22L – ₹30L' },
  { id: 'job-5', title: 'Enterprise Account Executive', company: 'Meridian Health Group', location: 'Chicago, US', remote: 'hybrid', seniority: 'senior', skills: ['SaaS Sales', 'Healthcare', 'Negotiation'], postedAt: '2026-08-12T00:00:00.000Z', salaryRange: '$130k – $170k OTE' },
  { id: 'job-6', title: 'Robotics Software Engineer', company: 'Sundial Robotics', location: 'Pune, IN', remote: 'onsite', seniority: 'senior', skills: ['ROS', 'C++', 'Computer Vision'], postedAt: '2026-08-19T00:00:00.000Z', salaryRange: '₹28L – ₹38L' },
  { id: 'job-7', title: 'Customer Success Lead', company: 'Loop Commerce', location: 'Singapore, SG', remote: 'hybrid', seniority: 'lead', skills: ['Onboarding', 'Retention', 'B2B SaaS'], postedAt: '2026-08-17T00:00:00.000Z' },
  { id: 'job-8', title: 'Manufacturing Operations Manager', company: 'Terracore Materials', location: 'Ahmedabad, IN', remote: 'onsite', seniority: 'senior', skills: ['Lean Manufacturing', 'Six Sigma'], postedAt: '2026-08-10T00:00:00.000Z', salaryRange: '₹24L – ₹32L' },
  { id: 'job-9', title: 'Frontend Engineer', company: 'Halcyon Studios', location: 'Berlin, DE', remote: 'remote', seniority: 'mid', skills: ['React', 'TypeScript', 'WebGL'], postedAt: '2026-08-22T00:00:00.000Z', salaryRange: '€65k – €80k' },
  { id: 'job-10', title: 'VP of Sales', company: 'Southbank Capital', location: 'Hyderabad, IN', remote: 'hybrid', seniority: 'exec', skills: ['Fintech', 'Team Leadership', 'Enterprise Sales'], postedAt: '2026-08-08T00:00:00.000Z' },
  { id: 'job-11', title: 'Supply Chain Analyst', company: 'Orbital Freight', location: 'Austin, US', remote: 'onsite', seniority: 'entry', skills: ['Excel', 'SQL', 'Forecasting'], postedAt: '2026-08-14T00:00:00.000Z', salaryRange: '$65k – $80k' },
  { id: 'job-12', title: 'Data Scientist', company: 'Kestrel Analytics', location: 'Sydney, AU', remote: 'remote', seniority: 'senior', skills: ['Python', 'ML', 'A/B Testing'], postedAt: '2026-08-16T00:00:00.000Z', salaryRange: 'A$140k – A$170k' },
  { id: 'job-13', title: 'Content Marketing Specialist', company: 'Bramblewood Foods', location: 'Chennai, IN', remote: 'hybrid', seniority: 'entry', skills: ['Copywriting', 'Social Media'], postedAt: '2026-08-20T00:00:00.000Z', salaryRange: '₹6L – ₹9L' },
  { id: 'job-14', title: 'Process Engineer', company: 'Arcline Semiconductors', location: 'Delhi NCR, IN', remote: 'onsite', seniority: 'mid', skills: ['Semiconductor Fab', 'Six Sigma'], postedAt: '2026-08-13T00:00:00.000Z', salaryRange: '₹18L – ₹26L' }
];
