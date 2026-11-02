'use client';

import React, { useEffect, useState } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  AlertCircle,
  ExternalLink,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ImageUploadField } from '../../components/ImageUploadField';
import { EmptyState } from '../../components/EmptyState';

interface SocialPostItem {
  _id: string;
  caption: string;
  imageUrl: string;
  postUrl: string;
  platform: 'instagram' | 'linkedin' | 'x' | 'facebook' | 'other';
  postedAt: string;
  isPublished: boolean;
}

export default function SocialMediaHeadPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [posts, setPosts] = useState<SocialPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'x' | 'facebook' | 'other'>('instagram');
  const [postedAt, setPostedAt] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/social/admin/all');
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch social posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setCaption('');
    setImageUrl('');
    setPostUrl('');
    setPlatform('instagram');
    setPostedAt(new Date().toISOString().substring(0, 16));
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SocialPostItem) => {
    setEditingId(item._id);
    setCaption(item.caption);
    setImageUrl(item.imageUrl);
    setPostUrl(item.postUrl);
    setPlatform(item.platform);
    setPostedAt(item.postedAt ? new Date(item.postedAt).toISOString().substring(0, 16) : '');
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !imageUrl || !postUrl.trim()) {
      alert('Caption, Image, and Post URL are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        caption: caption.trim(),
        imageUrl,
        postUrl: postUrl.trim(),
        platform,
        postedAt: postedAt ? new Date(postedAt).toISOString() : new Date().toISOString(),
        isPublished,
      };

      if (editingId) {
        await api.put(`/social/${editingId}`, payload);
      } else {
        await api.post('/social', payload);
      }

      setIsModalOpen(false);
      await fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social post?')) return;
    try {
      await api.delete(`/social/${id}`);
      await fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-pink-600" />
              Social Media Head Workspace — &quot;What&apos;s Happening at IEEE&quot;
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload event graphics, captions, and direct links to Instagram and LinkedIn posts.
              Changes appear instantly in real-time.
            </p>
          </div>

          {(isSuperAdmin || hasPermission('social_posts', 'create')) && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Create Insight Post
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No Social Media Posts Yet"
            description="Share your first Instagram or LinkedIn highlight card for the public 'What's happening at IEEE' feed."
            actionLabel="Create Insight Post"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="h-52 w-full bg-slate-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow backdrop-blur-sm flex items-center gap-1">
                      {post.platform === 'instagram' ? (
                        <Instagram className="w-3 h-3 text-pink-400" />
                      ) : (
                        <Linkedin className="w-3 h-3 text-blue-400" />
                      )}
                      {post.platform}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed">
                      {post.caption}
                    </p>
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ieee-blue hover:underline font-medium"
                    >
                      <span>Open Original Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {new Date(post.postedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {(isSuperAdmin || hasPermission('social_posts', 'delete')) && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create/Edit Post */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-pink-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Social Media Post' : 'Post Social Media Highlight'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <ImageUploadField
                  label="Post Image / Flyer *"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  folder="social"
                  helperText="Upload the Instagram/LinkedIn graphic to Cloudinary."
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Caption / Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Short engaging caption describing what happened..."
                    required
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Platform *
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="x">X (Twitter)</option>
                      <option value="facebook">Facebook</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Original Post Link *
                    </label>
                    <input
                      type="url"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      placeholder="https://instagram.com/p/..."
                      required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

