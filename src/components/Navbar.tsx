import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Menu } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { SearchModal } from '@/components/SearchModal';
export const Navbar: React.FC = () => {
  const {
    toggleSidebar
  } = useSidebar();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return <>
      <header className="h-14 w-full bg-background/95 backdrop-blur-sm border-b border-border flex items-center px-4 sticky top-0 z-50">
        <div className="flex items-center w-full">
          {/* Left side - Menu button and Logo/Brand - Fixed to leftmost */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="flex items-center gap-2 hover:bg-accent">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-[120px] h-auto object-contain shrink-0" />
              
            </div>
          </div>

          {/* Center - Search Trigger */}
          <div className="flex-1 flex justify-center px-2 md:px-8">
            <div className="w-full max-w-md">
              <button onClick={() => setIsSearchModalOpen(true)} className="w-full flex items-center gap-3 h-9 px-3 rounded-lg bg-background/50 backdrop-blur border border-border/50 hover:bg-background hover:border-primary/50 transition-all duration-200 text-left">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:block">Search prompts...</span>
                <span className="text-sm text-muted-foreground sm:hidden">Search...</span>
                <div className="ml-auto hidden md:block">
                  <kbd className="inline-flex items-center gap-1 h-5 px-1.5 bg-muted/50 text-muted-foreground text-xs rounded border">
                    ⌘K
                  </kbd>
                </div>
              </button>
            </div>
          </div>

          {/* Right side - future items */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Future: user menu, settings, etc. */}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>;
};