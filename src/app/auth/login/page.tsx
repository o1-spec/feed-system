import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Feed</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
