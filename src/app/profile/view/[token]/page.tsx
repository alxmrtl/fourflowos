'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

const PILLAR_COLORS = {
  SELF: '#FF6F61',
  SPACE: '#6BA292',
  STORY: '#5B84B1',
  SPIRIT: '#7A4DA4',
};

interface ProfileData {
  name: string;
  content: string;
  created_at: string;
}

export default function ProfileViewPage() {
  const params = useParams();
  const token = params.token as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/view/${token}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        } else {
          setError(data.error || 'Profile not found');
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#6BA292] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your Flow Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.05] flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Profile not available</h1>
          <p className="text-gray-500">
            {error === 'Profile not yet available'
              ? 'Your profile is still being prepared. Check back soon.'
              : 'This link may be invalid or expired.'}
          </p>
        </div>
      </div>
    );
  }

  const firstName = profile.name.split(' ')[0];
  const profileDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-12 pb-8 px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] text-gray-500 uppercase mb-4">FourFlow</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Flow Profile
          </h1>
          <p className="text-lg text-gray-400">{profile.name}</p>
          <p className="text-xs text-gray-600 mt-2">{profileDate}</p>

          {/* Four pillar dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {Object.entries(PILLAR_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] tracking-wider text-gray-600 uppercase">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Profile content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto px-6 py-10"
      >
        <div className="profile-content prose prose-invert prose-lg max-w-none">
          <ProfileMarkdown content={profile.content} />
        </div>
      </motion.main>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-3xl mx-auto px-6 pb-20"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Go Deeper
            </h2>
            <p className="text-gray-400 mb-2 max-w-lg mx-auto">
              This profile is based on your intake responses. A live facilitated session reveals what sits beneath the surface.
            </p>
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
              The blind spots, the cascades between pillars, the patterns that only emerge when someone asks the right question at the right time.
            </p>
            <a
              href="mailto:fourflowos@gmail.com?subject=Book a Live Flow Session&body=Hi, I'd like to book a facilitated Flow Session to go deeper on my profile."
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#6BA292] to-[#7A4DA4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Book a Live Flow Session
            </a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-gray-700">
          {firstName}&apos;s Flow Profile &middot; FourFlow &middot; {profileDate}
        </p>
      </footer>

      <style jsx global>{`
        .profile-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .profile-content h2 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #fff;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .profile-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #e5e5e5;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .profile-content p {
          font-size: 1rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 1rem;
        }
        .profile-content strong {
          color: #e5e5e5;
          font-weight: 600;
        }
        .profile-content ul, .profile-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .profile-content li {
          font-size: 1rem;
          line-height: 1.75;
          color: #a1a1aa;
          margin-bottom: 0.25rem;
        }
        .profile-content hr {
          border: none;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 2rem 0;
        }
        .profile-content blockquote {
          border-left: 3px solid #6BA292;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #a1a1aa;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

/**
 * Simple markdown-to-HTML renderer for the profile content.
 * Handles headers, bold, italic, lists, blockquotes, and paragraphs.
 */
function ProfileMarkdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr />')
    // Headers (process before other inline formatting)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Process lists and paragraphs
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*] (.+)/);
    const olMatch = line.match(/^\d+\. (.+)/);

    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      // Blank lines or already-processed tags
      if (line.trim() === '') {
        result.push('');
      } else if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<blockquote')) {
        result.push(line);
      } else {
        result.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) result.push(`</${listType}>`);

  return result.join('\n');
}
