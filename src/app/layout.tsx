// Location: src/app/layout.tsx
import './globals.css';
import { Providers } from '@/context/Providers'; // We will create this next

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}