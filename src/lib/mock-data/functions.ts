/**
 * Function/formula registry — starter functions available on every table
 * column of type `ai_formula`. Real static reference content, not "demo"
 * data standing in for a live provider.
 */

import type { FunctionDef } from '../types/product';

const stamp = { createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z' };

export const FUNCTIONS: FunctionDef[] = [
  { id: 'fn-1', name: 'CLEAN_PHONE', category: 'formatting', description: 'Normalise a phone number to E.164 format.', signature: 'CLEAN_PHONE(column, default_country)', example: 'CLEAN_PHONE(phone, "IN") → +919876543210', isBuiltIn: true, usageCount: 812, ...stamp },
  { id: 'fn-2', name: 'TITLECASE', category: 'formatting', description: 'Convert text to Title Case.', signature: 'TITLECASE(column)', example: 'TITLECASE("acme corp") → "Acme Corp"', isBuiltIn: true, usageCount: 640, ...stamp },
  { id: 'fn-3', name: 'DOMAIN_FROM_EMAIL', category: 'formatting', description: 'Extract the domain from an email address.', signature: 'DOMAIN_FROM_EMAIL(column)', example: 'DOMAIN_FROM_EMAIL("a@acme.com") → "acme.com"', isBuiltIn: true, usageCount: 1120, ...stamp },
  { id: 'fn-4', name: 'FIND_EMAIL', category: 'enrichment', description: 'Find a verified work email from name + company domain.', signature: 'FIND_EMAIL(full_name, domain)', example: 'FIND_EMAIL("Priya Rao", "acme.com")', isBuiltIn: true, usageCount: 2044, ...stamp },
  { id: 'fn-5', name: 'FIND_PHONE', category: 'enrichment', description: 'Find a direct-dial phone number for a contact.', signature: 'FIND_PHONE(full_name, company)', example: 'FIND_PHONE("Priya Rao", "Acme Corp")', isBuiltIn: true, usageCount: 1560, ...stamp },
  { id: 'fn-6', name: 'COMPANY_HEADCOUNT', category: 'enrichment', description: 'Look up estimated employee count for a company domain.', signature: 'COMPANY_HEADCOUNT(domain)', example: 'COMPANY_HEADCOUNT("acme.com") → 420', isBuiltIn: true, usageCount: 980, ...stamp },
  { id: 'fn-7', name: 'TECH_STACK', category: 'enrichment', description: 'Detect technologies used on a website.', signature: 'TECH_STACK(domain)', example: 'TECH_STACK("acme.com") → ["React", "Segment"]', isBuiltIn: true, usageCount: 411, ...stamp },
  { id: 'fn-8', name: 'IS_VALID_EMAIL', category: 'validation', description: 'Check whether an email address is syntactically valid and deliverable.', signature: 'IS_VALID_EMAIL(column)', example: 'IS_VALID_EMAIL("a@acme.com") → true', isBuiltIn: true, usageCount: 1780, ...stamp },
  { id: 'fn-9', name: 'IS_DUPLICATE', category: 'validation', description: 'Flag rows that duplicate an existing row by a chosen key column.', signature: 'IS_DUPLICATE(column, key)', example: 'IS_DUPLICATE(email, "email")', isBuiltIn: true, usageCount: 592, ...stamp },
  { id: 'fn-10', name: 'CONSENT_CHECK', category: 'validation', description: 'Cross-reference a contact against the workspace suppression list.', signature: 'CONSENT_CHECK(email)', example: 'CONSENT_CHECK("a@acme.com") → "opted_in"', isBuiltIn: true, usageCount: 233, ...stamp },
  { id: 'fn-11', name: 'AI_SUMMARY', category: 'ai', description: 'Summarise free text into one sentence with an LLM.', signature: 'AI_SUMMARY(column, max_words)', example: 'AI_SUMMARY(bio, 20)', isBuiltIn: true, usageCount: 705, ...stamp },
  { id: 'fn-12', name: 'AI_CLASSIFY', category: 'ai', description: 'Classify a row into one of a set of labels.', signature: 'AI_CLASSIFY(column, labels)', example: 'AI_CLASSIFY(industry, ["SaaS","Retail","Other"])', ...stamp, isBuiltIn: true, usageCount: 388 },
  { id: 'fn-13', name: 'AI_SCORE', category: 'ai', description: 'Score a row 0-100 against a natural-language rubric.', signature: 'AI_SCORE(row, rubric)', example: 'AI_SCORE(row, "Fit for mid-market ICP")', isBuiltIn: true, usageCount: 514, ...stamp },
  { id: 'fn-14', name: 'AI_EXTRACT', category: 'ai', description: 'Pull a structured field out of unstructured text.', signature: 'AI_EXTRACT(column, field)', example: 'AI_EXTRACT(job_post, "seniority")', isBuiltIn: true, usageCount: 296, ...stamp },
  { id: 'fn-15', name: 'CONCAT', category: 'utility', description: 'Join two or more columns with a separator.', signature: 'CONCAT(a, b, separator)', example: 'CONCAT(first_name, last_name, " ")', isBuiltIn: true, usageCount: 1340, ...stamp },
  { id: 'fn-16', name: 'ROUND', category: 'utility', description: 'Round a number to a given precision.', signature: 'ROUND(column, decimals)', example: 'ROUND(4.9182, 1) → 4.9', isBuiltIn: true, usageCount: 260, ...stamp }
];

export const FUNCTION_CATEGORIES: { id: FunctionDef['category']; label: string }[] = [
  { id: 'formatting', label: 'Formatting' },
  { id: 'enrichment', label: 'Enrichment' },
  { id: 'validation', label: 'Validation' },
  { id: 'ai', label: 'AI' },
  { id: 'utility', label: 'Utility' }
];
