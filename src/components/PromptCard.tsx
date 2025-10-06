import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Bookmark, Copy, ExternalLink } from 'lucide-react';
import { Prompt } from '@/data/prompts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import lovableRemixImage from '@/assets/lovable-remix.png';

interface PromptCardProps {
  prompt: Prompt;
  isCustomLovableCard?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isCustomLovableCard = false }) => {
  const { toast } = useToast();

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(prompt.text);
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openLovableProject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('https://lovable.dev/projects/08c0b54a-ddca-4d1e-8943-c3dffcc5b013', '_blank');
  };

  if (isCustomLovableCard) {
    return (
      <div className="block w-full cursor-pointer group animate-fade-in hover-scale">
        <div className="relative">
          <div className="bg-card/50 border border-border/20 rounded-xl backdrop-blur-sm overflow-hidden">
            {/* Link button */}
            <div className="absolute top-2 right-2 z-20">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity shadow-sm"
                onClick={openLovableProject}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-card relative rounded-xl">
              {/* Image content */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={lovableRemixImage} 
                  alt="Lovable Remix Project" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            
            {/* Tags section */}
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-medium overflow-x-auto scrollbar-hide">
              <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                #lovable
              </Badge>
              <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                #remix
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`/prompt/${prompt.id}`}
      className="block w-full cursor-pointer group animate-fade-in hover-scale"
    >
      <div className="relative">
        <div className="bg-card/50 border border-border/20 rounded-xl backdrop-blur-sm overflow-hidden">
          {/* Copy button */}
          <div className="absolute top-2 right-2 z-20">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity shadow-sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-card relative rounded-xl">
            {/* Scrollable content */}
            <div className="p-3 text-xs text-muted-foreground h-48 overflow-y-auto scrollbar-hide">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {prompt.text.length > 500 ? `${prompt.text.substring(0, 500)}...` : prompt.text}
              </pre>
            </div>
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
          </div>
          
          {/* Tags section */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-medium overflow-x-auto scrollbar-hide">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};