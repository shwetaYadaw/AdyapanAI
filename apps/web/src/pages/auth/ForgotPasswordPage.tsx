import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Check your inbox</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                If this email is registered, a password reset link will arrive shortly.
              </p>
              <Link to="/login"><Button fullWidth>Back to Login</Button></Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">Forgot password?</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your email and we'll send a reset link</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Email address" type="email" placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} required {...register('email')} />
                <Button type="submit" fullWidth size="lg" loading={loading}>Send Reset Link</Button>
              </form>
              <p className="text-center mt-4">
                <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
