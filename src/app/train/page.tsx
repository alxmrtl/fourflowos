import AuthGate from '@/components/auth/AuthGate';
import TrainingApp from '@/components/tools/training/TrainingApp';

export default function TrainPage() {
  return (
    <AuthGate>
      <TrainingApp />
    </AuthGate>
  );
}
