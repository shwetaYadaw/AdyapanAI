import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare, ThumbsUp, Eye, Plus, Search,
  Pin, CheckCircle2, Clock, Users
} from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Avatar from '../../components/common/Avatar/Avatar';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import { formatRelativeTime } from '@adyapan/shared';
import toast from 'react-hot-toast';

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  authorId: { firstName: string; lastName: string; avatar?: string; role: string };
  tags: string[];
  upvotes: number;
  views: number;
  replyCount: number;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: string;
}

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'forum' | 'study-groups' | 'live'>('forum');
  const [newPostModal, setNewPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const qc = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['forumPosts', search],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '20' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/forum/posts?${params}`);
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: () => api.post('/forum/posts', { title, content }),
    onSuccess: () => {
      toast.success('Post created!');
      setNewPostModal(false);
      setTitle('');
      setContent('');
      qc.invalidateQueries({ queryKey: ['forumPosts'] });
    },
    onError: () => toast.error('Failed to create post'),
  });

  const upvotePost = useMutation({
    mutationFn: (postId: string) => api.post(`/forum/posts/${postId}/upvote`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forumPosts'] }),
  });

  const TABS = [
    { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
    { id: 'study-groups', label: 'Study Groups', icon: Users },
    { id: 'live', label: 'Live Classes', icon: Clock },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Community</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Learn together, grow together</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setNewPostModal(true)}>
          New Post
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'forum' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
              className="input-field pl-10"
            />
          </div>

          {/* Posts list */}
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                ))
              : (posts?.data ?? []).map((post: ForumPost, i: number) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card hover padding="md">
                      <div className="flex gap-4">
                        {/* Vote column */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => upvotePost.mutate(post._id)}
                            className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 text-gray-400 hover:text-primary-500 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {post.upvotes}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            {post.isPinned && <Pin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />}
                            {post.isResolved && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />}
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {post.content}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Tags */}
                            {post.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="gray" className="text-xs">{tag}</Badge>
                            ))}

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />{post.replyCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />{post.views}
                              </span>
                              <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                          </div>

                          {/* Author */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <Avatar
                              src={post.authorId?.avatar}
                              firstName={post.authorId?.firstName}
                              size="xs"
                            />
                            <span className="text-xs text-gray-500">
                              {post.authorId?.firstName} {post.authorId?.lastName}
                            </span>
                            <Badge variant="primary" className="text-xs capitalize ml-1">
                              {post.authorId?.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
          </div>

          {(posts?.data ?? []).length === 0 && !isLoading && (
            <Card padding="lg" className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No posts yet. Start the conversation!</p>
            </Card>
          )}
        </>
      )}

      {activeTab === 'study-groups' && (
        <Card padding="lg" className="text-center">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Study Groups</h3>
          <p className="text-gray-400 text-sm mb-4">Join or create study groups for courses</p>
          <Button variant="secondary">Browse Study Groups</Button>
        </Card>
      )}

      {activeTab === 'live' && (
        <Card padding="lg" className="text-center">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Live Classes & Webinars</h3>
          <p className="text-gray-400 text-sm mb-4">No upcoming live sessions</p>
          <Button variant="secondary">View Schedule</Button>
        </Card>
      )}

      {/* New Post Modal */}
      <Modal
        isOpen={newPostModal}
        onClose={() => setNewPostModal(false)}
        title="Create New Post"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="What's your question or topic?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="input-field"
              placeholder="Describe your question or share your thoughts in detail..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setNewPostModal(false)}>Cancel</Button>
            <Button
              loading={createPost.isPending}
              disabled={!title.trim() || !content.trim()}
              onClick={() => createPost.mutate()}
            >
              Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
