import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload, Camera, Search, Eye, EyeOff } from 'lucide-react';

const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  status: z.string().default('active'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function AddStudentModal({ isOpen, onClose, onSubmit, isLoading }: AddStudentModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: 'active'
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: StudentFormData) => {
    const parts = data.fullName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || '.';
    onSubmit({
      firstName,
      lastName,
      email: data.email,
      password: data.password
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[17px] font-semibold text-gray-900">Add New Student Profile</h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              <form id="add-student-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                
                {/* Photo Upload Area */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <label className="flex flex-col items-center justify-center cursor-pointer group">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-blue-400 mb-2 group-hover:bg-gray-100 transition-colors">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold tracking-wider">UPLOAD</span>
                    </div>
                    <p className="text-xs text-blue-400 font-medium group-hover:text-blue-500">Click or drag to upload photo</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => { 
                        if(e.target.files?.length) { 
                          const file = e.target.files[0];
                          // Need to import toast from react-hot-toast if we wanted to toast, but alert is fine for mockup, or better just console log for now
                          console.log("Photo selected:", file.name);
                        } 
                      }} 
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-800">Full Name</label>
                    <input
                      {...register('fullName')}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      placeholder="e.g. Rahul Sen"
                    />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-800">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      placeholder="e.g. rahul@lms.com"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>


                  {/* Initial Status */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-sm font-semibold text-gray-800">Initial Status</label>
                    <select
                      {...register('status')}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-800">Password</label>
                      <div className="relative">
                        <input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          disabled={isLoading}
                          className="w-full px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                          placeholder="Min 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-800">Confirm Password</label>
                      <div className="relative">
                        <input
                          {...register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          disabled={isLoading}
                          className="w-full px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <button
                type="submit"
                form="add-student-form"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#FFB800] hover:bg-[#F0AD00] text-gray-900 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Enroll Student
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
