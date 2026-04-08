export const dynamic = 'force-dynamic';
import { AuthProvider } from '@/lib/auth-context';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
