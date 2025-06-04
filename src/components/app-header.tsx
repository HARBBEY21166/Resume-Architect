import { FileText } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <a href="/" className="font-headline text-lg font-semibold text-primary">
            CV-Genius
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
