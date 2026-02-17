import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload } from "lucide-react";

export default function WorkOrder() {
  return (
    <AppLayout title="Work Order" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations", path: "/estimations" }, { label: "Work Order" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border p-6">
        <h3 className="font-semibold mb-4">Work Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Customer PO No", val: "PO-TS-2024-0045" },
            { label: "Work Order No", val: "WO-2024-001" },
            { label: "Delivery Date", val: "2024-03-15" },
          ].map((f) => (
            <div key={f.label} className="space-y-1">
              <Label className="text-xs">{f.label}</Label>
              <Input defaultValue={f.val} className="h-8 text-sm" />
            </div>
          ))}
          <div className="space-y-1">
            <Label className="text-xs">Upload PO</Label>
            <button className="h-8 px-3 flex items-center gap-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary transition-colors w-full">
              <Upload className="h-3.5 w-3.5" /> Choose file
            </button>
          </div>
        </div>
        <div className="space-y-1 mt-4">
          <Label className="text-xs">Notes</Label>
          <Textarea defaultValue="Ensure all parts machined per drawing specifications." className="text-sm" rows={3} />
        </div>
        <Button size="sm" variant="outline" className="mt-4"><Download className="h-4 w-4 mr-1" /> Download Work Order</Button>
      </div>
    </AppLayout>
  );
}
