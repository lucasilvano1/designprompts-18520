import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { getAllCategories } from '@/data/prompts';
import { cn } from '@/lib/utils';
import { 
  Sidebar as SidebarPrimitive, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const categories = getAllCategories();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { state } = useSidebar();

  const toggleCategory = (categorySlug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
  };

  const isPathActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const isCategoryActive = (categorySlug: string): boolean => {
    return location.pathname.startsWith(`/category/${categorySlug}`);
  };

  return (
    <SidebarPrimitive
      side="left"
      variant="sidebar"
      className={cn(
        "bg-sidebar-background border-r border-sidebar-border",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-sidebar-background/95 before:to-sidebar-background/80 before:backdrop-blur-sm before:z-0",
        "after:absolute after:top-0 after:left-0 after:w-full after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent",
        className
      )}
      collapsible="icon"
    >
      <SidebarContent className="relative z-10 pt-14">
        {/* Header - only show when not collapsed */}
        {state !== "collapsed" && (
          <div className="flex items-center gap-2 p-4 pb-2">
            <Hash className="w-5 h-5 text-primary animate-pulse fill-current" />
            <h1 className="text-lg font-semibold text-sidebar-foreground font-inter tracking-tighter">Prompts</h1>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const isExpanded = expandedCategories.has(category.slug);
                const isActive = isCategoryActive(category.slug);

                return (
                  <div key={category.slug} className="space-y-1">
                    {/* Category Header */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/category/${category.slug}`}
                          onClick={() => toggleCategory(category.slug)}
                          className={cn(
                            "w-full flex items-center justify-between transition-all duration-300 group",
                            "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
                            isActive 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-md" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" />
                            {state !== "collapsed" && (
                              <span className="text-sm font-medium truncate font-inter tracking-tighter">
                                {category.category}
                              </span>
                            )}
                          </div>
                          {state !== "collapsed" && (
                            <>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-300" />
                              ) : (
                                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300" />
                              )}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Subcategories - only show when expanded and not collapsed */}
                    {isExpanded && state !== "collapsed" && (
                      <div className="ml-6 space-y-1 border-l-2 border-sidebar-border pl-3 animate-fade-in">
                        {category.subcategories.map((subcategory) => {
                          const subcategoryPath = `/category/${category.slug}/${subcategory.slug}`;
                          const isSubcategoryActive = isPathActive(subcategoryPath);

                          return (
                            <SidebarMenuItem key={subcategory.slug}>
                              <SidebarMenuButton asChild>
                                <Link
                                  to={subcategoryPath}
                                  className={cn(
                                    "block py-1.5 px-2 rounded text-sm transition-all duration-200 hover:scale-[1.01]",
                                    "hover:shadow-sm hover:shadow-primary/5",
                                    isSubcategoryActive
                                      ? "text-sidebar-accent-foreground font-medium bg-sidebar-accent/30"
                                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/20"
                                  )}
                                >
                                  {subcategory.title}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sidebar-background via-sidebar-background/80 to-transparent pointer-events-none z-20" />
    </SidebarPrimitive>
  );
};