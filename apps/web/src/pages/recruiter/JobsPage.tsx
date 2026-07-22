import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import toast from 'react-hot-toast';

export default function RecruiterJobsPage() {
  const [modal, setModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const qc = useQueryClient();

  const createJob = useMutation({
    mutationFn: (data: object) => api.post('/jobs', data),
    onSuccess: () => { toast.success('Job posted!'); setModal(false); reset(); qc.invalidateQueries({ queryKey: ['recruiterJobs'] }); },
    onError: () => toast.error('Failed to post job'),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Manage Jobs</h1>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModal(true)}>Post Job</Button>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Post a New Job" size="lg">
        <form onSubmit={handleSubmit((d) => createJob.mutate(d))} className="space-y-4">
          <Input label="Job Title" placeholder="e.g. Senior React Developer" required {...register('title')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Job Description</label>
            <textarea rows={5} className="input-field" placeholder="Describe the role, responsibilities..." {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Type</label>
              <select className="input-field" {...register('type')}>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
            <Input label="Location" placeholder="Bangalore / Remote" {...register('location')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Salary (LPA)" type="number" {...register('salaryMin')} />
            <Input label="Max Salary (LPA)" type="number" {...register('salaryMax')} />
          </div>
          <Input label="Required Skills" placeholder="React, Node.js, MongoDB (comma separated)" {...register('skills')} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={createJob.isPending}>Post Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
