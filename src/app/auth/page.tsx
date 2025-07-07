// Location: src/app/auth/page.tsx
import { AuthComponent } from '@/components/Auth';

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <AuthComponent />
    </main>
  );
}