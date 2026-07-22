import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    api.post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-hero dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Email verified!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your account is now active. Sign in to start learning.</p>
            <Link to="/login"><Button fullWidth>Go to Login</Button></Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Verification failed</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">The link is invalid or has expired. Please register again.</p>
            <Link to="/register"><Button fullWidth variant="secondary">Back to Register</Button></Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
