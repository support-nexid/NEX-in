import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to NexId or create a new account. Build your professional digital identity and portfolio in minutes.',
  openGraph: {
    title: 'Sign In | NexId',
    description: 'Access your NexId dashboard. Create and manage stunning portfolio websites.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
