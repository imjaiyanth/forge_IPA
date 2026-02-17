import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getVendors } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Plus } from "lucide-react";

const initialRows = [
  { id: 1, description: "SS 316 Round Bar 50mm", qty: "100", rate: "450", poNo: "VPO-2024-001", issuedTo: "Steel Authority India" },
  { id: 2, description: "Cutting Tools Set", qty: "5", rate: "3200", poNo: "VPO-2024-002", issuedTo: "Precision Tools India" },
];

export default function VendorPO() {
  const [rows, setRows] = useState(initialRows);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    getVendors().then(setVendors).catch(console.error);
  }, []);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), description: "", qty: "", rate: "", poNo: "", issuedTo: "" }]);
  };

  return (
    <AppLayout title="PO to Vendor" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations", path: "/estimations" }, { label: "Vendor PO" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Vendor Purchase Order</h3>
          <Button size="sm" onClick={addRow}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">S.No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-24">Rate (₹)</TableHead>
                <TableHead>PO No</TableHead>
                <TableHead>Issued To</TableHead>
                <TableHead className="w-28">Vendor Quote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell><Input defaultValue={row.description} className="h-7 text-sm" /></TableCell>
                  <TableCell><Input defaultValue={row.qty} className="h-7 text-sm" type="number" /></TableCell>
                  <TableCell><Input defaultValue={row.rate} className="h-7 text-sm" type="number" /></TableCell>
                  <TableCell><Input defaultValue={row.poNo} className="h-7 text-sm" /></TableCell>
                  <TableCell>
                    <Select defaultValue={row.issuedTo}>
                      <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                      <SelectContent>
                        {vendors.map((v) => (
                          <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <button className="h-7 px-2 flex items-center gap-1 border border-dashed border-border rounded text-xs text-muted-foreground hover:border-primary transition-colors">
                      <Upload className="h-3 w-3" /> Upload
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Textarea defaultValue="Please deliver within 2 weeks." className="text-sm" rows={2} />
          </div>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Download PO</Button>
        </div>
      </div>
    </AppLayout>
  );
}
