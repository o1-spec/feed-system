'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { useUpdateUser } from '@/hooks/useUser';
import { showSuccess, showError } from '@/lib/toast';
import { ChevronLeft } from 'lucide-react';

interface FormData {
  username: string;
  bio: string;
  email: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const updateMutation = useUpdateUser();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    bio: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.bio.length > 160) {
      newErrors.bio = 'Bio must be less than 160 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
      });
      showSuccess('Profile updated successfully!');
      router.push(`/profile/${currentUser?.id}`);
    } catch (error) {
      showError('Failed to update profile. Please try again.');
    }
  };

  if (userLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-2xl mx-auto py-8 bg-[#08090a] min-h-screen border-l border-r border-neutral-900 font-mono text-xs">
            <div className="animate-pulse space-y-4 px-6">
              <div className="h-4 bg-neutral-900 rounded w-1/4" />
              <div className="h-40 bg-neutral-900 rounded" />
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto bg-[#08090a] min-h-screen border-l border-r border-neutral-900 pb-12">
          
          <div className="sticky top-0 z-10 bg-[#08090a]/80 backdrop-blur border-b border-neutral-900 py-4 px-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-neutral-900/60 rounded-lg text-neutral-400 hover:text-white transition duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-mono tracking-widest uppercase text-neutral-200">
              / parameter_edit_panel
            </h1>
          </div>

          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div>
              <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-500 mb-2">

              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                className={`w-full px-4 py-2.5 border rounded-lg bg-[#0d0e11]/40 text-xs font-mono text-neutral-250 placeholder-neutral-700 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed transition ${
                  errors.username
                    ? 'border-red-950 text-red-400'
                    : 'border-neutral-900 focus:border-neutral-700'
                }`}
              />
              {errors.username && (
                <p className="text-[10px] font-mono text-red-500 mt-1.5">{errors.username}</p>
              )}
            </div>

            
            <div>
              <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-500 mb-2">

              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                className={`w-full px-4 py-2.5 border rounded-lg bg-[#0d0e11]/40 text-xs font-mono text-neutral-250 placeholder-neutral-700 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed transition ${
                  errors.email
                    ? 'border-red-950 text-red-400'
                    : 'border-neutral-900 focus:border-neutral-700'
                }`}
              />
              {errors.email && (
                <p className="text-[10px] font-mono text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-500">

                </label>
                <span className="text-[9px] font-mono text-neutral-600">
                  {formData.bio.length}/160
                </span>
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                placeholder="Initialize bio logs details..."
                rows={4}
                maxLength={160}
                className={`w-full px-4 py-2.5 border rounded-lg bg-[#0d0e11]/40 text-xs font-mono text-neutral-250 placeholder-neutral-700 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed resize-none transition ${
                  errors.bio
                    ? 'border-red-950 text-red-400'
                    : 'border-neutral-900 focus:border-neutral-700'
                }`}
              />
              {errors.bio && (
                <p className="text-[10px] font-mono text-red-500 mt-1.5">{errors.bio}</p>
              )}
            </div>

            
            <div className="flex gap-3 pt-4 font-mono">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 border border-neutral-900 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900/60 text-[10px] transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CANCEL_SYNC
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 text-[10px] font-bold transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? 'SAVING...' : 'SAVE_PARAMETERS'}
              </button>
            </div>
          </form>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
