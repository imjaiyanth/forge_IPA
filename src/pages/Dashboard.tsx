import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getDashboardStats } from "@/services/api";
import { Users, FolderKanban, FileText, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Total Clients", value: 0, icon: Users, color: "bg-primary" },
    { label: "Active Projects", value: 0, icon: FolderKanban, color: "bg-accent" },
    { label: "Quotations", value: 0, icon: FileText, color: "bg-warning" },
    { label: "Completed Jobs", value: 0, icon: CheckCircle, color: "bg-success" },
  ]);

  useEffect(() => {
    getDashboardStats().then((data: any) => {
      setStats([
        { label: "Total Clients", value: data.totalClients, icon: Users, color: "bg-primary" },
        { label: "Active Projects", value: data.activeProjects, icon: FolderKanban, color: "bg-accent" },
        { label: "Quotations", value: data.quotations, icon: FileText, color: "bg-warning" },
        { label: "Completed Jobs", value: data.completedJobs, icon: CheckCircle, color: "bg-success" },
      ]);
    }).catch(console.error);
  }, []);

  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 card-shadow border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`h-9 w-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {["CNC Shaft Assembly", "Hydraulic Valve Body", "Turbine Blade Set"].map((name) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">In Progress</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              "Quotation QTN-2024-001 sent to Tata Steel",
              "New project added: Gear Housing Unit",
              "Work order WO-2024-003 completed",
            ].map((activity) => (
              <div key={activity} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
