import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { getCompany } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function Company() {
  const [company, setCompany] = useState<any>({ name: "", address: "", email: "", phone: "" });

  useEffect(() => {
    getCompany().then(setCompany).catch(console.error);
  }, []);

  return (
    <AppLayout title="Company Details" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Company Details" }]}>
      <div className="bg-card rounded-xl p-6 card-shadow border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Logo Upload */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-40 w-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/50 cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Upload Logo</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
              </div>
            </div>
            <Button className="mt-2">Save Changes</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
