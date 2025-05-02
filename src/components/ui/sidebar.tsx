
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LucideIcon } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    href: string;
    icon?: LucideIcon;
    disabled?: boolean;
  }[];
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("pb-12", className)} {...props}>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    buttonVariants({
                      variant: location.pathname === item.href ? "default" : "ghost",
                      size: "sm",
                    }),
                    "w-full justify-start",
                    item.disabled && "opacity-50 pointer-events-none"
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
