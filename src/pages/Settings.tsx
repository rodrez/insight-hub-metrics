import { DEPARTMENTS } from '@/lib/constants';

export default function Settings() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Department Colors</h2>
        
        <div className="grid gap-4">
          {DEPARTMENTS.map(department => (
            <div 
              key={department.id}
              className="flex items-center justify-between p-4 rounded-lg bg-card"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: department.color }} 
                />
                <span className="font-medium">{department.name}</span>
              </div>
              
              <span className="text-sm text-muted-foreground capitalize">
                {department.type}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}