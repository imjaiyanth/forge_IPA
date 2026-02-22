import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getProjects, createProject, updateProject, deleteProject } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  "In Progress": "bg-accent/10 text-accent",
  "Quoted": "bg-warning/10 text-warning",
  "Completed": "bg-success/10 text-success",
  "Draft": "bg-muted text-muted-foreground",
};

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", quotationNo: "", status: "Draft" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const resetForm = () => {
    setForm({ name: "", quotationNo: "", status: "Draft" });
    setEditingId(null);
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const updatedProject = await updateProject(editingId, form);
        const mappedProject = { ...updatedProject, quotationNo: updatedProject.quotation_no, pocPhone: updatedProject.poc_phone };
        setProjects(projects.map(p => p.id === editingId ? mappedProject : p));
        resetForm();
      } else {
        const newProject = await createProject(form);
        const mappedProject = {
          ...newProject,
          quotationNo: newProject.quotation_no,
          pocPhone: newProject.poc_phone
        };
        setProjects([...projects, mappedProject]);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. See console for details.");
    }
  };

  const handleEdit = (e: React.MouseEvent, project: any) => {
    e.stopPropagation();
    setForm({
      name: project.name,
      quotationNo: project.quotationNo,
      status: project.status,
    });
    setEditingId(project.id);
    setOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteProject(id).then(() => {
      setProjects(projects.filter(p => p.id !== id));
    }).catch(console.error);
  };

  return (
    <AppLayout title="Projects" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Projects" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Project List</h3>
          <Button size="sm" onClick={() => { resetForm(); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add Project</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Quotation/Job No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p, i) => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/estimation/${p.id}`)}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium text-primary">{p.name}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{p.quotationNo}</span></TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[p.status] || ""}`}>{p.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted" onClick={(e) => handleEdit(e, p)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-destructive/10" onClick={(e) => handleDelete(e, p.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); else setOpen(true); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Project" : "Add New Project"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Quotation/Job No</Label>
              <Input value={form.quotationNo} onChange={(e) => setForm({ ...form, quotationNo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Quoted">Quoted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Update Project" : "Add Project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
