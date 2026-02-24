import type { Metadata } from 'next';
import MePage from '@/components/me/MePage';

export const metadata: Metadata = {
  title: 'Your Signal Sources — FourFlow',
  description: 'See what data sources are feeding your FourFlow profile.',
};

export default function Page() {
  return <MePage />;
}
