import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wrench, CircleDot, Grid3X3, Flame, Zap, Paintbrush } from "lucide-react";

type JobType = "custom" | "cnc-turning" | "cnc-milling" | "fabrication" | "laser" | "surface";

const jobTypes: { type: JobType; label: string; icon: React.ElementType }[] = [
  { type: "custom", label: "Custom Part", icon: Wrench },
  { type: "cnc-turning", label: "CNC Turning", icon: CircleDot },
  { type: "cnc-milling", label: "CNC Milling", icon: Grid3X3 },
  { type: "fabrication", label: "Fabrication / Welding", icon: Flame },
  { type: "laser", label: "Laser Cutting", icon: Zap },
  { type: "surface", label: "Surface Treatment", icon: Paintbrush },
];

interface AddJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (type: JobType) => void;
}

export default function AddJobModal({ open, onOpenChange, onAdd }: AddJobModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add New Job</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {jobTypes.map((jt) => (
            <button
              key={jt.type}
              onClick={() => { onAdd(jt.type); onOpenChange(false); }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <jt.icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{jt.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { JobType };
