import AppLayout from "@/components/layout/AppLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Download, Upload } from "lucide-react";

const checks = [
  "Dimensional Verification",
  "Visual Inspection",
  "Hardness Testing",
  "NDT",
  "Pressure Testing",
  "MTR",
  "Dim Inspection Report",
];

export default function Certificate() {
  return (
    <AppLayout title="Certificate of Conformance" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations", path: "/estimations" }, { label: "Certificate" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border p-6">
        <h3 className="font-semibold mb-4">Inspection Checklist</h3>
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm font-medium">{check}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Yes/No</Label>
                  <Switch />
                </div>
                <button className="h-7 px-3 flex items-center gap-1 border border-dashed border-border rounded text-xs text-muted-foreground hover:border-primary transition-colors">
                  <Upload className="h-3 w-3" /> Upload
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1 mt-4">
          <Label className="text-xs">Notes</Label>
          <Textarea defaultValue="All inspections completed as per ISO 9001." className="text-sm" rows={3} />
        </div>
        <Button size="sm" variant="outline" className="mt-4"><Download className="h-4 w-4 mr-1" /> Download Certificate</Button>
      </div>
    </AppLayout>
  );
}
