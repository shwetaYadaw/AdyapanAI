import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import toast from 'react-hot-toast';

export default function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { register, handleSubmit } = useForm();

  const saveCourse = useMutation({
    mutationFn: (data: object) => isNew ? api.post('/courses', data) : api.put(`/courses/${id}`, data),
    onSuccess: () => { toast.success(isNew ? 'Course created!' : 'Course updated!'); navigate('/teacher/courses'); },
    onError: () => toast.error('Failed to save course'),
  });

  return (
    <div className="page-wrapper space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/teacher/courses"><Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button></Link>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">{isNew ? 'Create Course' : 'Edit Course'}</h1>
      </div>

      <form onSubmit={handleSubmit((d) => saveCourse.mutate(d))} className="space-y-5">
        <Card padding="md" className="space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          <Input label="Course Title" placeholder="e.g. Complete React Developer Bootcamp" required {...register('title')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Short Description</label>
            <textarea rows={2} className="input-field" placeholder="What will students learn in one sentence?" {...register('shortDescription')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Description</label>
            <textarea rows={5} className="input-field" placeholder="Detailed course description..." {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select className="input-field" {...register('category')}>
                <option value="tech">Tech</option>
                <option value="non-tech">Non-Tech</option>
                <option value="placement">Placement</option>
                <option value="ai">AI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
              <select className="input-field" {...register('level')}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all">All Levels</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" type="number" placeholder="0 for free" {...register('price')} />
            <Input label="Original Price (₹)" type="number" placeholder="For discount display" {...register('originalPrice')} />
          </div>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link to="/teacher/courses"><Button variant="secondary">Cancel</Button></Link>
          <Button type="submit" loading={saveCourse.isPending} leftIcon={<Save className="w-4 h-4" />}>
            {isNew ? 'Create Course' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
