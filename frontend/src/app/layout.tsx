import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IEEE Student Branch — KIET Group of Institutions',
  description: 'Official portfolio and management portal for the IEEE Student Branch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

