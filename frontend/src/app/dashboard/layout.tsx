import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 right-0 p-8">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-400">Dashboard</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
