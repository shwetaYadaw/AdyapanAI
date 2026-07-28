import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, QrCode, Linkedin, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import { formatDate } from '@adyapan/shared';

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: async () => { const { data } = await api.get('/certificates/my-certificates'); return data.data; },
  });

  return (
    <div className="page-wrapper space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-8 sm:p-10 text-white shadow-brand"
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Award className="w-96 h-96 text-white" />
        </div>
        <div className="absolute left-1/4 bottom-0 opacity-5 pointer-events-none">
          <Sparkles className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight"
          >
            My Certificates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-white/90 text-sm sm:text-base leading-relaxed"
          >
            All your earned certificates with QR verification
          </motion.p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (certificates ?? []).length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Award className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">No certificates yet</h2>
          <p className="text-gray-400 text-sm">Complete a course to earn your first certificate</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(certificates ?? []).map((cert: { _id: string; certificateId: string; courseName: string; instructorName: string; issuedAt: string; skills: string[]; pdfUrl: string; courseId: { thumbnail: string; category: string } }, i: number) => (
            <motion.div key={cert._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card padding="none" className="overflow-hidden">
                {/* Certificate preview */}
                <div className="h-36 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 flex flex-col items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/80 text-xs font-medium">ADYAPAN</p>
                  <p className="text-white font-bold text-sm">
                    {cert.courseName.includes('DSA') ? 'Certificate of DSA Topic Completion' : 'Certificate of Completion'}
                  </p>
                  <Badge variant="primary" className="absolute top-3 right-3 bg-white/20 text-white border-0 capitalize">
                    {cert.courseId?.category}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{cert.courseName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">by {cert.instructorName}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Issued {formatDate(cert.issuedAt)}</span>
                    <span className="font-mono text-xs text-gray-400">{cert.certificateId}</span>
                  </div>

                  {cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1.5 pt-1">
                    {cert.pdfUrl && (
                      <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="secondary" size="sm" fullWidth className="px-2" leftIcon={<Download className="w-3.5 h-3.5" />}>
                          Download
                        </Button>
                      </a>
                    )}
                    <a href={`/verify/${cert.certificateId}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="px-2" leftIcon={<QrCode className="w-3.5 h-3.5" />}>
                        Verify
                      </Button>
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/verify/' + cert.certificateId)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="px-2" leftIcon={<Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}>
                        Share
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
