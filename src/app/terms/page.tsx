import LegalPageLayout, { LegalSection, InfoBox } from '@/components/legal/LegalPageLayout';
import { GRADIENTS } from '@/styles/brand-colors';

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="January 2, 2025">
      {/* Introduction */}
      <section className="mb-12">
        <p className="text-gray-300 leading-relaxed text-lg">
          Welcome to FourFlowOS. By using our applications and services, you agree to these Terms of Service.
          Please read them carefully before using our apps.
        </p>
      </section>

      <LegalSection number={1} title="Acceptance of Terms">
        <p className="text-gray-300 mb-4">
          By downloading, installing, or using any FourFlowOS application (&quot;Apps&quot;), you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use our Apps.
        </p>
        <p className="text-gray-300">
          We may update these terms from time to time. Continued use of the Apps after changes constitutes
          acceptance of the modified terms.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Description of Services">
        <p className="text-gray-300 mb-4">
          FourFlowOS provides productivity and personal development applications designed to help users achieve
          flow states and build meaningful habits. Our current Apps include:
        </p>
        <div className="space-y-3 text-gray-400">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <strong className="text-white">FlowZone</strong> — A focus timer with breathwork integration and flow state tracking
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <strong className="text-white">FlowHabits</strong> — A habit tracking app aligned with the Four Dimensions framework
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <strong className="text-white">FlowRead</strong> — A speed reading trainer with flow-inducing exercises
          </div>
        </div>
      </LegalSection>

      <LegalSection number={3} title="User Responsibilities">
        <p className="text-gray-300 mb-4">When using our Apps, you agree to:</p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-self">•</span>
            Use the Apps only for lawful purposes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-space">•</span>
            Not attempt to reverse engineer, decompile, or disassemble the Apps
          </li>
          <li className="flex items-start gap-2">
            <span className="text-story">•</span>
            Not use the Apps in any way that could damage or impair their functionality
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spirit">•</span>
            Not redistribute, sublicense, or resell the Apps
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={4} title="Intellectual Property">
        <InfoBox>
          <p className="m-0">
            All content, features, and functionality of FourFlowOS Apps—including but not limited to design,
            graphics, text, images, logos, icons, and software—are the exclusive property of FourFlowOS and
            are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </InfoBox>
        <p className="text-gray-300 mt-4">
          The FourFlowOS name, logo, and all related marks are trademarks of FourFlowOS. You may not use
          these marks without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Disclaimer of Warranties">
        <InfoBox variant="warning" title="Important Notice">
          <p className="m-0">
            THE APPS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APPS WILL BE UNINTERRUPTED, ERROR-FREE, OR
            FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </InfoBox>
        <p className="text-gray-300 mt-4">
          FourFlowOS is not a substitute for professional medical, psychological, or therapeutic advice.
          Our Apps are designed for general wellness and productivity purposes only.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Limitation of Liability">
        <p className="text-gray-300 mb-4">
          To the maximum extent permitted by law, FourFlowOS shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, including but not limited to:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Loss of data or data being rendered inaccurate
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Loss of profits, revenue, or business opportunities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Personal injury or property damage
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            Any unauthorized access to or alteration of your data
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={7} title="Termination">
        <p className="text-gray-300">
          You may stop using our Apps at any time by uninstalling them from your device. Since our Apps
          store data locally and do not require accounts, there is no account termination process. All
          locally stored data will be deleted when you uninstall the App.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Governing Law">
        <p className="text-gray-300">
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
          in which FourFlowOS operates, without regard to its conflict of law provisions. Any disputes
          arising from these Terms shall be resolved through binding arbitration.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Contact Information">
        <p className="text-gray-300 mb-4">
          If you have questions about these Terms of Service, please contact us:
        </p>
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
          <a
            href="mailto:fourflowos@gmail.com"
            className="text-spirit hover:text-spirit-light transition-colors font-medium"
          >
            fourflowos@gmail.com
          </a>
        </div>
      </LegalSection>

      {/* Summary */}
      <section className="p-8 bg-gradient-to-br from-self/10 via-space/10 to-spirit/10 border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Key Points</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-self/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-self text-xs">1</span>
            </div>
            <span>Use our Apps responsibly and for their intended purpose</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-space/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-space text-xs">2</span>
            </div>
            <span>All intellectual property belongs to FourFlowOS</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-story/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-story text-xs">3</span>
            </div>
            <span>Apps are provided as-is for general wellness purposes</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-spirit/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-spirit text-xs">4</span>
            </div>
            <span>Contact us anytime with questions or concerns</span>
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
