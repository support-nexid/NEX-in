export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your NexId portfolio, projects, themes, and settings from your personal dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

import RequiresVerification from '@/components/RequiresVerification';
import RequiresOnboarding from '@/components/RequiresOnboarding';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RequiresVerification>
        <RequiresOnboarding>
          {children}
        </RequiresOnboarding>
      </RequiresVerification>
    </AuthProvider>
  );
}
