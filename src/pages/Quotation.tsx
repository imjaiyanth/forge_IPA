import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

export default function Quotation() {
  return (
    <AppLayout title="Quotation" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations", path: "/estimations" }, { label: "Quotation" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border p-6">
        <h3 className="font-semibold mb-4">Quotation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Quotation No", val: "QTN-2024-001" },
            { label: "Quotation Date", val: "2024-01-20" },
            { label: "Valid Till", val: "2024-02-20" },
            { label: "Delivery Time", val: "4 Weeks" },
            { label: "Payment Terms", val: "50% Advance, 50% on Delivery" },
          ].map((f) => (
            <div key={f.label} className="space-y-1">
              <Label className="text-xs">{f.label}</Label>
              <Input defaultValue={f.val} className="h-8 text-sm" />
            </div>
          ))}
          <div className="space-y-1">
            <Label className="text-xs">Shipment</Label>
            <Select defaultValue="courier">
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="courier">Courier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1 mt-4">
          <Label className="text-xs">Notes</Label>
          <Textarea defaultValue="Standard terms apply." className="text-sm" rows={3} />
        </div>
        <Button size="sm" variant="outline" className="mt-4"><Download className="h-4 w-4 mr-1" /> Download Quotation</Button>
      </div>
    </AppLayout>
  );
}
