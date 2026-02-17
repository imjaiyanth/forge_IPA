import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getProjects } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  "In Progress": "bg-accent/10 text-accent",
  "Quoted": "bg-warning/10 text-warning",
  "Completed": "bg-success/10 text-success",
  "Draft": "bg-muted text-muted-foreground",
};

export default function Estimations() {
  const navigate = useNavigate();
  const [estimations, setEstimations] = useState<any[]>([]);

  useEffect(() => {
    getProjects().then(setEstimations).catch(console.error);
  }, []);

  return (
    <AppLayout title="Estimations" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">All Estimations</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">S.No</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Quotation No</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimations.map((p, i) => (
              <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/estimation/${p.id}`)}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium text-primary">{p.name}</TableCell>
                <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{p.quotationNo}</span></TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[p.status] || ""}`}>{p.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
