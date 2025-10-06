import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Category } from '@/data/prompts';
import { PromptCard } from './PromptCard';
import { Button } from '@/components/ui/button';

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Get all prompts from this category
  const allPrompts = category.subcategories.flatMap(sub => sub.prompts);
  
  // Check if this is the web design category to show the custom Lovable card first
  const isWebDesignCategory = category.slug === 'web-design';
  
  // Create a dummy prompt for the custom Lovable card
  const lovableCustomPrompt = {
    id: 'lovable-custom-card',
    title: 'Lovable Remix Project',
    text: 'Custom Lovable project showcase',
    tags: ['lovable', 'remix']
  };

  if (allPrompts.length === 0 && !isWebDesignCategory) return null;

  return (
    <div className="px-8 py-6 relative animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <category.icon className="w-6 h-6 fill-primary text-primary" />
          <h2 className="text-xl font-semibold text-foreground">{category.category}</h2>
        </div>
        <Link 
          to={`/category/${category.slug}`}
          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-accent/50 story-link"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Scrollable Cards Container */}
      <div className="relative group">
        {/* Left scroll button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 p-0 bg-background/80 backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
          onClick={scrollLeft}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Right scroll button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 p-0 bg-background/80 backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
          onClick={scrollRight}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Cards container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Show custom Lovable card first for web design category */}
          {isWebDesignCategory && (
            <div key="lovable-custom" className="flex-shrink-0 w-80">
              <PromptCard prompt={lovableCustomPrompt} isCustomLovableCard={true} />
            </div>
          )}
          {allPrompts.map((prompt) => (
            <div key={prompt.id} className="flex-shrink-0 w-80">
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};