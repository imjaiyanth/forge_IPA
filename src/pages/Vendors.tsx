import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getVendors, createVendor, updateVendor, deleteVendor } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Vendors() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    getVendors().then(setVendors).catch(console.error);
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", vendorId: "", address: "", poc: "", phone: "", email: "", rawMaterials: [] as string[] });
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ name: "", vendorId: "", address: "", poc: "", phone: "", email: "", rawMaterials: [] });
    setEditingId(null);
    setOpen(false);
  };

  const handleSave = () => {
    if (editingId) {
      updateVendor(editingId, form).then((updatedVendor: any) => {
        const mappedVendor = { ...updatedVendor, vendorId: updatedVendor.vendor_id };
        setVendors(vendors.map(v => v.id === editingId ? mappedVendor : v));
        resetForm();
      }).catch(console.error);
    } else {
      createVendor(form).then((newVendor: any) => {
        const mappedVendor = {
          ...newVendor,
          vendorId: newVendor.vendor_id
        };
        setVendors([...vendors, mappedVendor]);
        resetForm();
      }).catch(console.error);
    }
  };

  const handleEdit = (vendor: any) => {
    setForm({
      name: vendor.name,
      vendorId: vendor.vendorId, // Assuming api.ts maps vendor_id to vendorId correctly in getVendors
      address: vendor.address || "",
      poc: vendor.poc || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      rawMaterials: vendor.rawMaterials || []
    });
    setEditingId(vendor.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteVendor(id).then(() => {
      setVendors(vendors.filter(v => v.id !== id));
    }).catch(console.error);
  };

  return (
    <AppLayout title="Vendors" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Vendors" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Vendor Database</h3>
          <Button size="sm" onClick={() => { resetForm(); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add Vendor</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>POC</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v, i) => (
                <TableRow key={v.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{v.vendorId}</span></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{v.address}</TableCell>
                  <TableCell>{v.poc}</TableCell>
                  <TableCell className="text-muted-foreground">{v.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{v.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted" onClick={() => handleEdit(v)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-destructive/10" onClick={() => handleDelete(v.id)}>
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
          <DialogHeader><DialogTitle>{editingId ? "Edit Vendor" : "Add New Vendor"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: "Vendor Name", key: "name" },
              { label: "Vendor ID", key: "vendorId" },
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Raw Material Supplied</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setForm({ ...form, rawMaterials: [...form.rawMaterials, ""] })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                {form.rawMaterials.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No raw materials added yet.</p>
                )}
                {form.rawMaterials.map((material, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-28 shrink-0">Raw Material #{idx + 1}</Label>
                    <Input
                      className="h-8 text-sm"
                      value={material}
                      placeholder="e.g. Steel, Aluminum"
                      onChange={(e) => {
                         const newMaterials = [...form.rawMaterials];
                         newMaterials[idx] = e.target.value;
                         setForm({ ...form, rawMaterials: newMaterials });
                      }}
                    />
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const newMaterials = form.rawMaterials.filter((_, i) => i !== idx);
                        setForm({ ...form, rawMaterials: newMaterials });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Update Vendor" : "Add Vendor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
