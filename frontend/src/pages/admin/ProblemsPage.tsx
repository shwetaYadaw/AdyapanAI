import CodingArenaDashboard from '../../features/admin/pages/CodingArenaDashboard';

export default function AdminProblemsPage() {
  return <CodingArenaDashboard onBack={() => window.history.back()} />;
}
