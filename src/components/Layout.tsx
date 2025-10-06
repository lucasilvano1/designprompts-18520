import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Navbar covering full width */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        
        {/* Main content area below navbar */}
        <div className="flex w-full pt-14">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};