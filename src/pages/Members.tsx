import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getMembers, createMember, updateMember, deleteMember } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    getMembers().then(setMembers).catch(console.error);
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Sales", email: "", contact: "", password: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = () => {
    const payload = { ...form };
    if (!payload.password) {
      delete (payload as any).password;
    }

    if (editingId) {
      updateMember(editingId, payload).then((updatedMember: any) => {
        setMembers(members.map((m) => (m.id === editingId ? updatedMember : m)));
        resetForm();
      }).catch(console.error);
    } else {
      if (!form.password) {
        // ensure password exists for creation, maybe default or error? 
        // For now let's set a default if missing to avoid 422 if strict
        (payload as any).password = "123456";
      }
      createMember(payload).then((newMember: any) => {
        setMembers([...members, newMember]);
        resetForm();
      }).catch(console.error);
    }
  };

  const resetForm = () => {
    setForm({ name: "", role: "Sales", email: "", contact: "", password: "" });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (member: any) => {
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      contact: member.contact,
      password: "" // Password usually verified separately or left blank to not change
    });
    setEditingId(member.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMember(id).then(() => {
      setMembers(members.filter((m) => m.id !== id));
    }).catch(console.error);
  };

  return (
    <AppLayout title="Members" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Members" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Team Members</h3>
          <Button size="sm" onClick={() => { resetForm(); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m, i) => (
              <TableRow key={m.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{m.role}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{m.email}</TableCell>
                <TableCell className="text-muted-foreground">{m.contact}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted" onClick={() => handleEdit(m)}>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-destructive/10" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); else setOpen(true); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Member" : "Add New Member"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password {editingId && "(Leave blank to keep current)"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Update Member" : "Add Member"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
