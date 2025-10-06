import React from 'react';
import { useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { getPromptById, getAllCategories } from '@/data/prompts';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import NotFound from './NotFound';

export const PromptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  if (!id) {
    return <NotFound />;
  }

  const prompt = getPromptById(id);

  if (!prompt) {
    return <NotFound />;
  }

  // Find the category and subcategory for breadcrumbs
  let categoryInfo: { category: string; categorySlug: string; subcategory: string; subcategorySlug: string } | null = null;
  
  for (const category of getAllCategories()) {
    for (const subcategory of category.subcategories) {
      if (subcategory.prompts.some(p => p.id === id)) {
        categoryInfo = {
          category: category.category,
          categorySlug: category.slug,
          subcategory: subcategory.title,
          subcategorySlug: subcategory.slug
        };
        break;
      }
    }
    if (categoryInfo) break;
  }

  const breadcrumbItems = categoryInfo ? [
    { label: categoryInfo.category },
    { label: categoryInfo.subcategory, href: `/category/${categoryInfo.categorySlug}/${categoryInfo.subcategorySlug}` },
    { label: prompt.title }
  ] : [{ label: prompt.title }];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy the prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openInChatGPT = () => {
    const encodedPrompt = encodeURIComponent(prompt.text);
    const url = `https://chatgpt.com/?q=${encodedPrompt}`;
    const openerWindow = window.top ?? window;
    const newWindow = openerWindow.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    // Optional helper: copy to clipboard without blocking the popup
    navigator.clipboard.writeText(prompt.text).then(() => {
      toast({ title: 'Prompt copied', description: 'Paste if needed in ChatGPT.' });
    }).catch(() => {});
  };

  const openInClaude = () => {
    const encodedPrompt = encodeURIComponent(prompt.text);
    const url = `https://claude.ai/new?q=${encodedPrompt}`;
    const openerWindow = window.top ?? window;
    const newWindow = openerWindow.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    navigator.clipboard.writeText(prompt.text).then(() => {
      toast({ title: 'Prompt copied', description: 'Paste if needed in Claude.' });
    }).catch(() => {});
  };

  const openInPerplexity = () => {
    const encodedPrompt = encodeURIComponent(prompt.text);
    const url = `https://www.perplexity.ai/search?q=${encodedPrompt}`;
    const openerWindow = window.top ?? window;
    const newWindow = openerWindow.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {prompt.title}
          </h1>
          {prompt.description && (
            <p className="text-xl text-muted-foreground">
              {prompt.description}
            </p>
          )}
        </header>

        <div className="space-y-6">
          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Prompt</span>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg border">
                <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {prompt.text}
                </pre>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};