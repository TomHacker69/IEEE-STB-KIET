import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IEEE Student Branch — Admin Management System',
  description: 'Role-based administrative control panel for IEEE Student Branch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

