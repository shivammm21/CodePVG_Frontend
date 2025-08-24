export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
