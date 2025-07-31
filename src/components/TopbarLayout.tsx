import { NetworkHeader } from "@/components/NetworkHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface TopbarLayoutProps {
  children: React.ReactNode;
}

export function TopbarLayout({ children }: TopbarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <NetworkHeader />
        <main className="flex-1 p-0 bg-gradient-to-br from-background via-background to-primary/5">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
} 