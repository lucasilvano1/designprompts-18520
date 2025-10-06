import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FileText, Folder } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { searchCategories, searchPrompts, getSubcategoryBySlug, getAllCategories } from '@/data/prompts';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!query.trim()) return { categories: [], prompts: [], subcategories: [] };
    
    const categories = searchCategories(query).slice(0, 3);
    const prompts = searchPrompts(query).slice(0, 6);
    
    // Search subcategories
    const subcategories: Array<{title: string, slug: string, categorySlug: string, category: string}> = [];
    const allCategories = getAllCategories();
    
    allCategories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.title.toLowerCase().includes(query.toLowerCase())) {
          subcategories.push({
            title: subcategory.title,
            slug: subcategory.slug,
            categorySlug: category.slug,
            category: category.category
          });
        }
      });
    });
    
    return { categories, prompts, subcategories: subcategories.slice(0, 4) };
  }, [query]);

  const hasResults = searchResults.categories.length > 0 || searchResults.prompts.length > 0 || searchResults.subcategories.length > 0;
  const totalResults = searchResults.categories.length + searchResults.subcategories.length + searchResults.prompts.length;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (isOpen) {
      setQuery('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
            ...searchResults.subcategories.map(sub => ({ type: 'subcategory' as const, item: sub })),
            ...searchResults.prompts.map(prompt => ({ type: 'prompt' as const, item: prompt }))
          ];
          const selected = allItems[selectedIndex];
          
          if (selected?.type === 'category') {
            navigate(`/category/${selected.item.slug}`);
            onClose();
          } else if (selected?.type === 'subcategory') {
            navigate(`/category/${selected.item.categorySlug}/${selected.item.slug}`);
            onClose();
          } else if (selected?.type === 'prompt') {
            navigate(`/prompt/${selected.item.id}`);
            onClose();
          }
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleNavigation = (type: string, item: any) => {
    if (type === 'category') {
      navigate(`/category/${item.slug}`);
    } else if (type === 'subcategory') {
      navigate(`/category/${item.categorySlug}/${item.slug}`);
    } else if (type === 'prompt') {
      navigate(`/prompt/${item.id}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl p-0 gap-0 bg-background border border-border mx-auto" aria-describedby="search-modal-description">
        <DialogHeader className="p-4 pb-0">
          <div className="sr-only">
            <h2 id="search-modal-title">Search Prompts</h2>
            <p id="search-modal-description">Search through prompts, categories, and subcategories</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search prompts, categories, or use cases..."
              className="pl-10 pr-10 h-12 text-base border-0 focus:ring-0 focus:outline-none bg-muted/30"
              autoComplete="off"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto bg-background">
          {query.trim() && hasResults ? (
            <div className="p-4 space-y-4">
              {/* Categories */}
              {searchResults.categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Categories</h3>
                  </div>
                  <div className="space-y-1">
                    {searchResults.categories.map((category, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <button
                          key={category.slug}
                          onClick={() => handleNavigation('category', category)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                          )}
                        >
                          <category.icon className="w-5 h-5 fill-current flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <span className="font-medium text-sm">{category.category}</span>
                            <p className="text-xs text-muted-foreground">
                              {category.subcategories.length} subcategories
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {searchResults.subcategories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Subcategories</h3>
                  </div>
                  <div className="space-y-1">
                    {searchResults.subcategories.map((subcategory, index) => {
                      const globalIndex = searchResults.categories.length + index;
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={`${subcategory.categorySlug}-${subcategory.slug}`}
                          onClick={() => handleNavigation('subcategory', subcategory)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                          )}
                        >
                          <div className="flex-1">
                            <span className="font-medium text-sm">{subcategory.title}</span>
                            <p className="text-xs text-muted-foreground">
                              in {subcategory.category}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prompts */}
              {searchResults.prompts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Prompts</h3>
                  </div>
                  <div className="space-y-1">
                    {searchResults.prompts.map((prompt, index) => {
                      const globalIndex = searchResults.categories.length + searchResults.subcategories.length + index;
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={prompt.id}
                          onClick={() => handleNavigation('prompt', prompt)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                          )}
                        >
                          <div className="flex-1">
                            <span className="font-medium text-sm line-clamp-1">{prompt.title}</span>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {prompt.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50 mt-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : query.trim() && !hasResults ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try different keywords or browse categories</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search prompts</p>
                <p className="text-xs mt-1">Find prompts, categories, and subcategories</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};