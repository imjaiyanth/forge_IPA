import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getClients, createClient, updateClient, deleteClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    getClients().then(setClients).catch(console.error);
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", clientId: "", address: "", poc: "", phone: "", email: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ name: "", clientId: "", address: "", poc: "", phone: "", email: "" });
    setEditingId(null);
    setOpen(false);
  };

  const handleSave = () => {
    if (editingId) {
      updateClient(editingId, form).then((updatedClient: any) => {
        const mappedClient = { ...updatedClient, clientId: updatedClient.client_id };
        setClients(clients.map(c => c.id === editingId ? mappedClient : c));
        resetForm();
      }).catch(console.error);
    } else {
      createClient(form).then((newClient: any) => {
        const mappedClient = {
          ...newClient,
          clientId: newClient.client_id
        };
        setClients([...clients, mappedClient]);
        resetForm();
      }).catch(console.error);
    }
  };

  const handleEdit = (client: any) => {
    setForm({
      name: client.name,
      clientId: client.clientId,
      address: client.address || "",
      poc: client.poc || "",
      phone: client.phone || "",
      email: client.email || ""
    });
    setEditingId(client.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteClient(id).then(() => {
      setClients(clients.filter(c => c.id !== id));
    }).catch(console.error);
  };

  return (
    <AppLayout title="Clients" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Clients" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Client Database</h3>
          <Button size="sm" onClick={() => { resetForm(); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add Client</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>POC</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{c.clientId}</span></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.address}</TableCell>
                  <TableCell>{c.poc}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted" onClick={() => handleEdit(c)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
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
          <DialogHeader><DialogTitle>{editingId ? "Edit Client" : "Add New Client"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: "Client Name", key: "name" },
              { label: "Client ID", key: "clientId" },
              { label: "Address", key: "address" },
              { label: "POC", key: "poc" },
              { label: "Phone", key: "phone" },
              { label: "Email", key: "email" },
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}</Label>
                <Input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Update Client" : "Add Client"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
