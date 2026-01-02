'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = 'December 31, 2024';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                alt="FourFlowOS"
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-white font-bold text-lg">
              FourFlow<span className="text-gray-400">OS</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Policy content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-300 leading-relaxed text-lg">
                FourFlowOS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how our apps—including <strong>FlowSpace</strong> and{' '}
                <strong>FourFlow Habits</strong>—handle your information.
              </p>
              <div className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold mb-1">Privacy First</h3>
                    <p className="text-gray-400 text-base m-0">
                      All FourFlowOS apps store data locally on your device only. We do not collect,
                      transmit, or have access to any of your personal data.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Apps Covered */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  1
                </span>
                Apps Covered by This Policy
              </h2>
              <p className="text-gray-300 mb-4">This privacy policy applies to the following applications:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800">
                      <Image
                        src="/assets/apps/flowspace-icon.png"
                        alt="FlowSpace"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">FlowSpace</h4>
                      <p className="text-gray-500 text-sm">Focus & Flow Timer</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800">
                      <Image
                        src="/assets/apps/habits-icon.png"
                        alt="FourFlow Habits"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">FourFlow Habits</h4>
                      <p className="text-gray-500 text-sm">Habit Tracker</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  2
                </span>
                Information We Collect
              </h2>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-6">
                <h3 className="text-white font-semibold mb-3">We collect NO personal information.</h3>
                <p className="text-gray-400 m-0">
                  Our apps are designed to work entirely offline and do not require any personal
                  information to function. We do not collect names, email addresses, device identifiers,
                  location data, or any other personal information.
                </p>
              </div>
              <p className="text-gray-300">
                The data you create within our apps (such as habits, goals, focus sessions, and
                preferences) is stored exclusively on your device and is never transmitted to us or
                any third party.
              </p>
            </section>

            {/* Data Storage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  3
                </span>
                Data Storage
              </h2>
              <div className="space-y-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Local Storage Only</h4>
                  <p className="text-gray-400 text-base m-0">
                    All app data is stored locally on your device using Apple&apos;s SwiftData framework.
                    Your data never leaves your device.
                  </p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">No Cloud Sync</h4>
                  <p className="text-gray-400 text-base m-0">
                    We do not use iCloud, CloudKit, or any other cloud synchronization services.
                    Your data remains on the device where you created it.
                  </p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">No User Accounts</h4>
                  <p className="text-gray-400 text-base m-0">
                    Our apps do not require you to create an account, sign in, or provide any
                    authentication credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* Third Parties */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  4
                </span>
                Third-Party Sharing
              </h2>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-semibold mb-3">We do NOT share any data with third parties.</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No advertising networks or tracking SDKs
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No analytics services that collect user data
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No data brokers or marketing partners
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No server-side data processing or storage
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Types by App */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  5
                </span>
                Data Stored on Your Device (by App)
              </h2>

              {/* FlowSpace */}
              <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <Image src="/assets/apps/flowspace-icon.png" alt="FlowSpace" width={32} height={32} />
                  </div>
                  FlowSpace
                </h3>
                <ul className="space-y-2 text-gray-400 text-base">
                  <li>• Focus session records (duration, date, focus reps)</li>
                  <li>• Goals and tasks you create</li>
                  <li>• Personal vision and values (if entered)</li>
                  <li>• App preferences (timer duration, breathwork selections, audio settings)</li>
                  <li>• Daily container configurations</li>
                </ul>
              </div>

              {/* FourFlow Habits */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <Image src="/assets/apps/habits-icon.png" alt="FourFlow Habits" width={32} height={32} />
                  </div>
                  FourFlow Habits
                </h3>
                <ul className="space-y-2 text-gray-400 text-base">
                  <li>• Habits you create (name, emoji, pillar assignment)</li>
                  <li>• Habit completion records (dates completed)</li>
                  <li>• Streak and achievement data</li>
                  <li>• App preferences and settings</li>
                </ul>
              </div>
            </section>

            {/* Data Deletion */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  6
                </span>
                Data Deletion
              </h2>
              <p className="text-gray-300 mb-4">
                Since all data is stored locally on your device, you have complete control over it:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6F61]">•</span>
                  Delete individual items (habits, goals, sessions) within the app
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6BA292]">•</span>
                  Uninstall the app to remove all associated data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5B84B1]">•</span>
                  Use iOS Settings to manage app storage
                </li>
              </ul>
            </section>

            {/* Children */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  7
                </span>
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-300">
                Our apps are designed for general audiences and do not knowingly collect any
                information from children under 13. Since we collect no personal data from any
                users, there is no data collected from children.
              </p>
            </section>

            {/* Changes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  8
                </span>
                Changes to This Policy
              </h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. Any changes will be reflected
                on this page with an updated &quot;Last updated&quot; date. We encourage you to review this
                policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] flex items-center justify-center text-sm">
                  9
                </span>
                Contact Us
              </h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our apps, please contact us:
              </p>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                <a
                  href="mailto:support@fourflow.app"
                  className="text-[#7A4DA4] hover:text-[#9A6DC4] transition-colors font-medium"
                >
                  support@fourflow.app
                </a>
              </div>
            </section>

            {/* Summary */}
            <section className="p-8 bg-gradient-to-br from-[#FF6F61]/10 via-[#6BA292]/10 to-[#7A4DA4]/10 border border-white/10 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>No data collection</strong> — We don&apos;t collect any personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>Local storage only</strong> — All your data stays on your device</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>No third-party sharing</strong> — We never share data with anyone</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>Complete control</strong> — Delete your data anytime by uninstalling</span>
                </li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FourFlowOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
