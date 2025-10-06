import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/data/prompts';
import { PromptCard } from '@/components/PromptCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaggeredCards } from '@/components/ui/staggered-cards';
import NotFound from './NotFound';

export const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{ 
    categorySlug: string; 
    subcategorySlug?: string; 
  }>();
  
  if (!categorySlug) {
    return <NotFound />;
  }

  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return <NotFound />;
  }

  // If subcategorySlug is provided, show only that subcategory
  if (subcategorySlug) {
    const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
    
    if (!subcategory) {
      return <NotFound />;
    }

    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: category.category, href: `/category/${categorySlug}` },
      { label: subcategory.title }
    ];

    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <category.icon className="w-8 h-8 fill-primary text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">{subcategory.title}</h1>
                <p className="text-xl text-muted-foreground mt-1">
                  {subcategory.prompts.length} prompt{subcategory.prompts.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <Link to={`/category/${categorySlug}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to {category.category}
              </Button>
            </Link>
          </div>

          {/* Prompts Grid */}
          {subcategory.prompts.length > 0 ? (
            <StaggeredCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategory.prompts.map((prompt) => (
                <div key={prompt.id} className="w-full">
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </StaggeredCards>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No prompts available in this subcategory yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show all prompts from the category
  const allPrompts = category.subcategories.flatMap(sub => sub.prompts);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: category.category }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <category.icon className="w-8 h-8 fill-primary text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">{category.category}</h1>
              <p className="text-xl text-muted-foreground mt-1">
                {allPrompts.length} prompt{allPrompts.length !== 1 ? 's' : ''} available across {category.subcategories.length} subcategories
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Subcategories Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Subcategories</h2>
          <StaggeredCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                to={`/category/${categorySlug}/${subcategory.slug}`}
                className="block p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
              >
                <h3 className="font-medium text-foreground mb-2">{subcategory.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {subcategory.prompts.length} prompt{subcategory.prompts.length !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </StaggeredCards>
        </div>

        {/* All Prompts */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">All Prompts</h2>
          {allPrompts.length > 0 ? (
            <StaggeredCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPrompts.map((prompt) => (
                <div key={prompt.id} className="w-full">
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </StaggeredCards>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No prompts available in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};