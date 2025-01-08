import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 h-[calc(100vh-4rem)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
