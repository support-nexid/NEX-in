export const dynamic = 'force-dynamic';
import { AuthProvider } from '@/lib/auth-context';

import RequiresVerification from '@/components/RequiresVerification';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RequiresVerification>
        {children}
      </RequiresVerification>
    </AuthProvider>
  );
}
