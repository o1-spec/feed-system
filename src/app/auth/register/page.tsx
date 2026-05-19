import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join Feed</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to get started
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
