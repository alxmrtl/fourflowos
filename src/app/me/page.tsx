import type { Metadata } from 'next';
import MePage from '@/components/me/MePage';

export const metadata: Metadata = {
  title: 'Your Flow Profile — FourFlow',
  description: 'Your consciousness alignment profile and live signal dashboard.',
};

export default function Page() {
  return <MePage />;
}
