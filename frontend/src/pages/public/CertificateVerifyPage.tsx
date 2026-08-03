import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Download, Share2 } from 'lucide-react';
import { api } from '../../core/services/api';
import { formatDate } from '@adyapan/shared';
import Button from '../../shared/components/Button/Button';
import PageLoader from '../../shared/components/Loader/PageLoader';

interface CertificateData {
  certificateId: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedAt: string;
  skills: string[];
}

export default function CertificateVerifyPage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [cert, setCert] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (!certificateId) { setStatus('invalid'); return; }
    api.get(`/certificates/verify/${certificateId}`)
      .then(({ data }) => { setCert(data.data.certificate); setStatus('valid'); })
      .catch(() => setStatus('invalid'));
  }, [certificateId]);

  if (status === 'loading') return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-hero dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        {status === 'valid' && cert ? (
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 text-sm font-medium">ADYAPAN</p>
              <h1 className="font-display font-bold text-2xl text-white mt-1">Certificate Verified</h1>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-xl px-4 py-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">This certificate is authentic and valid</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Certificate ID', value: cert.certificateId },
                  { label: 'Student', value: cert.studentName },
                  { label: 'Course', value: cert.courseName },
                  { label: 'Instructor', value: cert.instructorName },
                  { label: 'Issued On', value: formatDate(cert.issuedAt) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                    <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              {cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" fullWidth leftIcon={<Share2 className="w-4 h-4" />}>Share</Button>
                <Link to="/" className="btn-ghost flex-1 text-center text-sm">Back to ADYAPAN</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-10 text-center">
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Invalid Certificate</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This certificate ID could not be verified or has been revoked.</p>
            <Link to="/"><Button fullWidth variant="secondary">Back to Home</Button></Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
