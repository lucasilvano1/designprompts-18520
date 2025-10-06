import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getAllCategories, searchCategories } from '@/data/prompts';
import { CategorySection } from '@/components/CategorySection';
import { SearchBar } from '@/components/SearchBar';
import { StaggeredFade } from '@/components/ui/staggered-fade';
import { BlurIn } from '@/components/ui/blur-in';

export const Home: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getAllCategories();

  // Handle search from navbar navigation
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }
    return searchCategories(searchQuery);
  }, [searchQuery, categories]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative py-20 px-8 px-16 overflow-hidden">
        {/* Video Background */}
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://res.cloudinary.com/dqd4dvem7/video/upload/v1758979516/rowzd837annraukcew5z_1_etvnrw.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Bottom gradient for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-15"></div>
        
        {/* Centered black square with blur */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-black blur-[90px] z-15"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            {/* Social Proof Badge */}
            <BlurIn>
              <span className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/20 backdrop-blur-sm cursor-pointer">
                <Star className="w-3 h-3 fill-current" />
                🚀 Over 1000+ AI prompts crafted by experts
              </span>
            </BlurIn>
            
            {/* Heading and Subheading */}
            <div className="flex flex-col items-center gap-3">
              <StaggeredFade 
                text="Master AI with battle-tested prompts"
                className="text-5xl font-normal text-foreground font-inter tracking-tighter leading-tight"
              />
              <BlurIn>
                <p className="text-muted-foreground text-xl max-w-2xl">
                  From automation to creative writing, discover prompts that actually work. 
                  Copy, customize, and get results in seconds.
                </p>
              </BlurIn>
            </div>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <SearchBar
                variant="hero"
                value={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search prompts, categories, or use cases..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {searchQuery.trim() && (
          <div className="px-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Search Results
            </h2>
            <p className="text-muted-foreground mb-6">
              Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}
        
        {filteredResults.map((category) => (
          <CategorySection key={category.slug} category={category} />
        ))}
        
        {searchQuery.trim() && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No prompts found for "{searchQuery}". Try different keywords.
            </p>
          </div>
        )}
      </div>
    </>
  );
};