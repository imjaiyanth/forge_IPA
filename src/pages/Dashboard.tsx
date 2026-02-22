import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getDashboardStats, getProjects } from "@/services/api";
import { Users, FolderKanban, FileText, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Total Clients", value: 0, icon: Users, color: "bg-primary" },
    { label: "Active Projects", value: 0, icon: FolderKanban, color: "bg-accent" },
    { label: "Quotations", value: 0, icon: FileText, color: "bg-warning" },
    { label: "Completed Jobs", value: 0, icon: CheckCircle, color: "bg-success" },
  ]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then((data: any) => {
      setStats([
        { label: "Total Clients", value: data.totalClients, icon: Users, color: "bg-primary" },
        { label: "Active Projects", value: data.activeProjects, icon: FolderKanban, color: "bg-accent" },
        { label: "Quotations", value: data.quotations, icon: FileText, color: "bg-warning" },
        { label: "Completed Jobs", value: data.completedJobs, icon: CheckCircle, color: "bg-success" },
      ]);
    }).catch(console.error);
    getProjects().then((projects: any[]) => {
      setRecentProjects(projects.slice(0, 5));
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
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{project.name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{project.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {project.status === "Completed"
                      ? `Project "${project.name}" completed`
                      : project.status === "In Progress"
                      ? `"${project.name}" is in progress`
                      : `Project "${project.name}" is ${project.status?.toLowerCase() || "active"}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
