import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import type { JobType } from "./AddJobModal";

interface JobCardProps {
  type: JobType;
  index: number;
  onRemove: () => void;
}

const cardTitles: Record<string, string> = {
  "cnc-turning": "CNC Turning",
  "cnc-milling": "CNC Milling",
  custom: "Custom Part",
  fabrication: "Fabrication / Welding",
  laser: "Laser Cutting",
  surface: "Surface Treatment",
};

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{children}</div>;
}

function Field({ label, defaultValue = "", type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={defaultValue} type={type} className="h-8 text-sm" />
    </div>
  );
}

function CalcField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="h-8 px-3 flex items-center bg-muted/50 rounded-md text-sm font-medium">{value}</div>
    </div>
  );
}

function CNCTurningCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="Raw Diameter (mm)" defaultValue="50" type="number" />
        <Field label="Finished Diameter (mm)" defaultValue="45" type="number" />
        <Field label="Part Length (mm)" defaultValue="120" type="number" />
        <Field label="Material Type" defaultValue="Stainless Steel" />
      </FieldRow>
      <FieldRow>
        <Field label="Material Grade" defaultValue="SS 316" />
        <Field label="No. of Operations" defaultValue="3" type="number" />
        <Field label="Cycle Time (min)" defaultValue="15" type="number" />
        <Field label="Setup Time (min)" defaultValue="30" type="number" />
      </FieldRow>
      <FieldRow>
        <Field label="Tool Change Count" defaultValue="2" type="number" />
        <Field label="Quantity" defaultValue="100" type="number" />
        <Field label="Tolerance Class" defaultValue="IT7" />
        <div className="space-y-1">
          <Label className="text-xs">Machine Selection</Label>
          <Select defaultValue="cnc-lathe">
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cnc-lathe">CNC Lathe</SelectItem>
              <SelectItem value="swiss-turn">Swiss Turn</SelectItem>
              <SelectItem value="multi-axis">Multi-Axis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FieldRow>
      <FieldRow>
        <Field label="Margin %" defaultValue="15" type="number" />
      </FieldRow>
      <div className="border-t border-border pt-3 mt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">CALCULATED VALUES</p>
        <FieldRow>
          <CalcField label="Machining Time" value="25 hrs" />
          <CalcField label="Setup Cost" value="₹2,400" />
          <CalcField label="Machining Cost" value="₹18,750" />
          <CalcField label="Tool Wear Cost" value="₹1,200" />
        </FieldRow>
        <div className="mt-3">
          <FieldRow>
            <CalcField label="Raw Material Cost" value="₹45,000" />
            <CalcField label="Total Job Cost" value="₹67,350" />
            <CalcField label="Profit" value="₹10,103" />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}

function CNCMillingCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="No of Setups" defaultValue="2" type="number" />
        <div className="space-y-1">
          <Label className="text-xs">Machine Type</Label>
          <Select defaultValue="3-axis">
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3-axis">3-Axis VMC</SelectItem>
              <SelectItem value="4-axis">4-Axis HMC</SelectItem>
              <SelectItem value="5-axis">5-Axis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="Operator Rate (₹/hr)" defaultValue="350" type="number" />
        <Field label="Material Type" defaultValue="Aluminum" />
      </FieldRow>
      <FieldRow>
        <Field label="Material Grade" defaultValue="AL 6061" />
        <Field label="Cycle Time (min)" defaultValue="20" type="number" />
        <Field label="Setup Time (min)" defaultValue="45" type="number" />
        <Field label="Quantity" defaultValue="50" type="number" />
      </FieldRow>
      <FieldRow>
        <Field label="Margin %" defaultValue="12" type="number" />
      </FieldRow>
      <div className="border-t border-border pt-3 mt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">CALCULATED VALUES</p>
        <FieldRow>
          <CalcField label="Machining Cost" value="₹12,500" />
          <CalcField label="Setup Cost" value="₹1,800" />
          <CalcField label="Total Job Cost" value="₹32,100" />
          <CalcField label="Profit" value="₹3,852" />
        </FieldRow>
      </div>
    </div>
  );
}

function CustomPartCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="Job Description" defaultValue="Custom Flange" />
        <Field label="Drawing No" defaultValue="DRW-2024-015" />
        <Field label="Material" defaultValue="Carbon Steel" />
        <Field label="Heat Number" defaultValue="HT-4521" />
      </FieldRow>
      <FieldRow>
        <Field label="Raw Material Dimension" defaultValue="200 x 200 x 50 mm" />
        <div className="space-y-1">
          <Label className="text-xs">Raw Material Supplied by</Label>
          <Select defaultValue="vendor">
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="in-house">In-House</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="Quantity" defaultValue="25" type="number" />
        <Field label="Job Cost / Unit (₹)" defaultValue="1200" type="number" />
      </FieldRow>
      <FieldRow>
        <CalcField label="Total Cost" value="₹30,000" />
        <div className="space-y-1">
          <Label className="text-xs">Upload Drawing</Label>
          <button className="h-8 px-3 flex items-center gap-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary transition-colors">
            <Upload className="h-3.5 w-3.5" /> Choose file
          </button>
        </div>
      </FieldRow>
    </div>
  );
}

function FabricationCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="Job Name" defaultValue="Frame Welding" />
        <Field label="Drawing No" defaultValue="DRW-2024-020" />
        <Field label="Total Job Cost (₹)" defaultValue="15000" type="number" />
      </FieldRow>
    </div>
  );
}

function LaserCuttingCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="Job Name" defaultValue="Panel Cutting" />
        <Field label="Material" defaultValue="MS Sheet" />
        <Field label="Thickness (mm)" defaultValue="6" type="number" />
        <Field label="Total Job Cost (₹)" defaultValue="8500" type="number" />
      </FieldRow>
    </div>
  );
}

function SurfaceTreatmentCard() {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field label="Treatment Type" defaultValue="Zinc Plating" />
        <Field label="Quantity" defaultValue="100" type="number" />
        <Field label="Cost / Unit (₹)" defaultValue="45" type="number" />
        <CalcField label="Total Cost" value="₹4,500" />
      </FieldRow>
    </div>
  );
}

const cardComponents: Record<string, React.FC> = {
  "cnc-turning": CNCTurningCard,
  "cnc-milling": CNCMillingCard,
  custom: CustomPartCard,
  fabrication: FabricationCard,
  laser: LaserCuttingCard,
  surface: SurfaceTreatmentCard,
};

export default function JobCard({ type, index, onRemove }: JobCardProps) {
  const Component = cardComponents[type];
  return (
    <div className="border border-border rounded-xl p-4 bg-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold">
          Job {index + 1}: {cardTitles[type]}
        </h4>
        <button onClick={onRemove} className="p-1 rounded hover:bg-destructive/10 transition-colors">
          <X className="h-4 w-4 text-destructive" />
        </button>
      </div>
      {Component && <Component />}
    </div>
  );
}
