import { AppShell } from '@/components/app/AppShell';

/**
 * Shared shell for every authenticated product route (`/app/**`). Individual
 * pages render only their own content; the sidebar, top bar, auth gate and
 * toast portal all live in AppShell so they exist exactly once.
 */
export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
