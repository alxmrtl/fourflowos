import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Reps — FourFlow Training',
  robots: { index: false, follow: false }, // unlisted — not for public indexing
};

export default function TrainLayout({ children }: { children: React.ReactNode }) {
  return children;
}
