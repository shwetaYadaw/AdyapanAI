import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '../../core/services/api';
import Button from '../../shared/components/Button/Button';
import Input from '../../shared/components/Input/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const token = params.get('token');
    if (!token) { toast.error('Invalid reset link'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: data.newPassword });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to reset password. Link may be expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-hero dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 max-w-md w-full">
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2 text-center">Set new password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">Must be at least 8 characters with upper/lowercase and numbers.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="New password" type={show ? 'text' : 'password'} placeholder="New password" leftIcon={<Lock className="w-4 h-4" />} rightIcon={show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} onRightIconClick={() => setShow(!show)} error={errors.newPassword?.message} required {...register('newPassword')} />
          <Input label="Confirm password" type={show ? 'text' : 'password'} placeholder="Confirm password" leftIcon={<Lock className="w-4 h-4" />} error={errors.confirmPassword?.message} required {...register('confirmPassword')} />
          <Button type="submit" fullWidth size="lg" loading={loading}>Reset Password</Button>
        </form>
      </motion.div>
    </div>
  );
}
