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
          <div className="max-w-2xl mx-auto py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          
          <div className="sticky top-0 z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 backdrop-blur border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
          </div>

          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.username
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Bio
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.bio.length}/160
                </span>
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={updateMutation.isPending}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={160}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
                  errors.bio
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.bio && (
                <p className="text-xs text-red-500 mt-1">{errors.bio}</p>
              )}
            </div>

            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
