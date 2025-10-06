import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCategories, searchPrompts } from '@/data/prompts';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  variant?: 'hero' | 'navbar';
  onSearchChange?: (query: string) => void;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search prompts, categories, or use cases...",
  className,
  variant = 'hero',
  onSearchChange,
  value: controlledValue,
}) => {
  const [query, setQuery] = useState(controlledValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!query.trim()) return { categories: [], prompts: [] };
    
    const categories = searchCategories(query).slice(0, 3);
    const prompts = searchPrompts(query).slice(0, 5);
    
    return { categories, prompts };
  }, [query]);

  const hasResults = searchResults.categories.length > 0 || searchResults.prompts.length > 0;
  const totalResults = searchResults.categories.length + searchResults.prompts.length;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setQuery(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearchChange?.(searchQuery);
    
    if (variant === 'navbar' && searchQuery.trim()) {
      // Navigate to home with search results
      navigate('/', { state: { searchQuery: searchQuery.trim() } });
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalResults - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const allItems = [
            ...searchResults.categories.map(cat => ({ type: 'category' as const, item: cat })),
            ...searchResults.prompts.map(prompt => ({ type: 'prompt' as const, item: prompt }))
          ];
          const selected = allItems[selectedIndex];
          
          if (selected?.type === 'category') {
            navigate(`/category/${selected.item.slug}`);
          } else if (selected?.type === 'prompt') {
            navigate(`/prompt/${selected.item.id}`);
          }
          setIsOpen(false);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearchChange?.('');
    inputRef.current?.focus();
  };

  const getInputStyles = () => {
    const baseStyles = "transition-all duration-200";
    
    if (variant === 'navbar') {
      return cn(
        baseStyles,
        "h-9 pl-9 pr-8 rounded-lg bg-background/50 backdrop-blur border border-border/50",
        "focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
        "text-sm placeholder:text-muted-foreground",
        isOpen && hasResults && "rounded-b-none border-b-0"
      );
    }
    
    return cn(
      baseStyles,
      "h-12 pl-12 pr-10 rounded-full bg-background/30 backdrop-blur border border-border",
      "focus:bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
      "text-sm placeholder:text-muted-foreground"
    );
  };

  return (
    <div 
      ref={searchRef} 
      className={cn("relative", className)}
    >
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground pointer-events-none z-10",
          variant === 'navbar' ? "w-4 h-4" : "w-5 h-5"
        )} />
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={getInputStyles()}
          autoComplete="off"
        />
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50",
              variant === 'navbar' ? "h-5 w-5" : "h-6 w-6"
            )}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className={cn(
          "absolute top-full left-0 right-0 bg-popover border border-border shadow-lg backdrop-blur-sm z-50",
          variant === 'navbar' ? "rounded-b-lg mt-0" : "rounded-lg mt-2"
        )}>
          {hasResults ? (
            <div className="py-2 max-h-80 overflow-y-auto">
              {/* Categories */}
              {searchResults.categories.length > 0 && (
                <div className="px-3 py-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Categories</p>
                  {searchResults.categories.map((category, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={category.slug}
                        onClick={() => {
                          navigate(`/category/${category.slug}`);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}
                      >
                        <category.icon className="w-4 h-4 fill-current flex-shrink-0" />
                        <span className="font-medium">{category.category}</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Prompts */}
              {searchResults.prompts.length > 0 && (
                <div className="px-3 py-1">
                  {searchResults.categories.length > 0 && (
                    <hr className="border-border mb-2" />
                  )}
                  <p className="text-xs font-medium text-muted-foreground mb-2">Prompts</p>
                  {searchResults.prompts.map((prompt, index) => {
                    const globalIndex = searchResults.categories.length + index;
                    const isSelected = globalIndex === selectedIndex;
                    return (
                      <button
                        key={prompt.id}
                        onClick={() => {
                          navigate(`/prompt/${prompt.id}`);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex flex-col gap-1 px-3 py-2 rounded-md text-left transition-colors",
                          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}
                      >
                        <span className="font-medium text-sm">{prompt.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {prompt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};