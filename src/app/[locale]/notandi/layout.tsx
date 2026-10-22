import type { Metadata } from 'next';

// Login and user profile pages are thin / personal content: keep them out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function NotandiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
