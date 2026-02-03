'use client';

import LegalPageLayout, { LegalSection, InfoBox } from '@/components/legal/LegalPageLayout';
import Link from 'next/link';

export default function EULAPage() {
  return (
    <LegalPageLayout title="End User License Agreement" lastUpdated="January 2, 2025">
      {/* Introduction */}
      <section className="mb-12">
        <p className="text-gray-300 leading-relaxed text-lg">
          This End User License Agreement (&quot;EULA&quot;) is a legal agreement between you and FourFlowOS
          for the use of our mobile applications. By installing or using any FourFlowOS application,
          you agree to be bound by the terms of this EULA.
        </p>
        <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400 text-sm m-0">
            <strong className="text-white">Applicable Apps:</strong> FlowZone, FlowHabits, FlowRead,
            and any future applications released under the FourFlowOS brand.
          </p>
        </div>
      </section>

      <LegalSection number={1} title="License Grant">
        <p className="text-gray-300 mb-4">
          Subject to your compliance with this EULA, FourFlowOS grants you a limited, non-exclusive,
          non-transferable, revocable license to:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-[#FF6F61]">•</span>
            Download and install the App on devices you own or control
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6BA292]">•</span>
            Use the App for your personal, non-commercial purposes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#5B84B1]">•</span>
            Access any updates or new versions of the App made available to you
          </li>
        </ul>
        <p className="text-gray-300 mt-4">
          This license does not grant you any ownership rights in the App. The App is licensed, not sold.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Restrictions">
        <p className="text-gray-300 mb-4">You agree NOT to:</p>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Copy or distribute</strong> the App or any portion thereof
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Modify, adapt, or create derivative works</strong> based on the App
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Reverse engineer, decompile, or disassemble</strong> the App
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Rent, lease, loan, sublicense, or sell</strong> access to the App
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Remove any proprietary notices</strong> or labels on the App
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection number={3} title="Ownership">
        <InfoBox>
          <p className="m-0">
            The App is protected by copyright laws and international treaty provisions. FourFlowOS and
            its licensors retain all right, title, and interest in and to the App, including all
            intellectual property rights therein.
          </p>
        </InfoBox>
        <p className="text-gray-300 mt-4">
          All trademarks, service marks, trade names, and trade dress are proprietary to FourFlowOS.
          Nothing in this EULA grants you any rights to use the FourFlowOS trademarks.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Updates and Modifications">
        <p className="text-gray-300 mb-4">
          FourFlowOS may from time to time provide updates, patches, or upgrades to the App. These may
          be automatically installed without additional notice or consent.
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Updates may modify or delete features without prior notice
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            You agree that FourFlowOS has no obligation to provide updates
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Continued use after updates constitutes acceptance of changes
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={5} title="Third-Party Services">
        <p className="text-gray-300 mb-4">
          The App does not integrate with third-party services that collect user data. However:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            No advertising networks or tracking SDKs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            No social media integrations that share data
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            No analytics that identify individual users
          </li>
        </ul>
        <p className="text-gray-300 mt-4">
          The App is distributed through the Apple App Store, which is governed by its own terms and
          conditions. Apple is not responsible for the App or its content.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Privacy">
        <p className="text-gray-300 mb-4">
          Your privacy is important to us. Our collection and use of information is governed by our
          Privacy Policy, which is incorporated into this EULA by reference.
        </p>
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
          <Link
            href="/privacy"
            className="text-[#7A4DA4] hover:text-[#9A6DC4] transition-colors font-medium"
          >
            View our Privacy Policy →
          </Link>
        </div>
        <p className="text-gray-300 mt-4">
          <strong className="text-white">Key Point:</strong> All FourFlowOS apps store data locally on
          your device. We do not collect, transmit, or have access to your personal data.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Termination">
        <p className="text-gray-300 mb-4">
          This EULA is effective until terminated. Your rights under this EULA will terminate
          automatically if you fail to comply with any of its terms.
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">You may terminate</strong> this EULA at any time by
              uninstalling the App and all copies from your devices.
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">FourFlowOS may terminate</strong> this EULA if you breach
              any term, without prior notice.
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-base m-0">
              <strong className="text-white">Upon termination,</strong> you must cease all use and
              destroy all copies of the App.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection number={8} title="Warranty Disclaimer">
        <InfoBox variant="warning" title="No Warranty">
          <p className="m-0 uppercase text-sm">
            THE APP IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NONINFRINGEMENT.
          </p>
        </InfoBox>
        <p className="text-gray-300 mt-4">
          FourFlowOS does not warrant that the App will meet your requirements, operate without
          interruption, or be error-free. The entire risk as to the quality and performance of the
          App is with you.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Limitation of Liability">
        <p className="text-gray-300 mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW:
        </p>
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
          <p className="mb-3">
            FourFlowOS shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages, regardless of the cause of action or whether FourFlowOS has been
            advised of the possibility of such damages.
          </p>
          <p className="m-0">
            In no event shall FourFlowOS&apos;s total liability exceed the amount paid by you for the App
            in the twelve (12) months preceding the claim, or $50 USD, whichever is greater.
          </p>
        </div>
      </LegalSection>

      <LegalSection number={10} title="Export Compliance">
        <p className="text-gray-300">
          You agree to comply with all applicable export laws and regulations. You represent that you
          are not located in a country subject to U.S. government embargo, and that you are not on any
          U.S. government list of prohibited or restricted parties.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Governing Law">
        <p className="text-gray-300">
          This EULA shall be governed by and construed in accordance with the laws of the jurisdiction
          in which FourFlowOS operates, without giving effect to any principles of conflicts of law.
          Any legal action arising out of this EULA shall be brought exclusively in the courts of that
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection number={12} title="Contact Information">
        <p className="text-gray-300 mb-4">
          If you have questions about this EULA, please contact us:
        </p>
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
          <a
            href="mailto:fourflowos@gmail.com"
            className="text-[#7A4DA4] hover:text-[#9A6DC4] transition-colors font-medium"
          >
            fourflowos@gmail.com
          </a>
        </div>
      </LegalSection>

      {/* Agreement Statement */}
      <section className="p-8 bg-gradient-to-br from-[#FF6F61]/10 via-[#6BA292]/10 to-[#7A4DA4]/10 border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Agreement</h2>
        <p className="text-gray-300 mb-4">
          BY DOWNLOADING, INSTALLING, OR USING ANY FOURFLOWOS APPLICATION, YOU ACKNOWLEDGE THAT YOU
          HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS END USER LICENSE AGREEMENT.
        </p>
        <p className="text-gray-400 text-sm">
          If you do not agree to these terms, do not download, install, or use the App.
        </p>
      </section>
    </LegalPageLayout>
  );
}
