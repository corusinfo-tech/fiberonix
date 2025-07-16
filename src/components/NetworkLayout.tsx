import { SidebarProvider } from "@/components/ui/sidebar";
import { NetworkSidebar } from "@/components/NetworkSidebar";
import { NetworkHeader } from "@/components/NetworkHeader";

interface NetworkLayoutProps {
  children: React.ReactNode;
}

export function NetworkLayout({ children }: NetworkLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <NetworkSidebar />
        <div className="flex-1 flex flex-col">
          <NetworkHeader />
          <main className="flex-1 p-6 space-y-6 bg-gradient-to-br from-background via-background to-primary/5">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}