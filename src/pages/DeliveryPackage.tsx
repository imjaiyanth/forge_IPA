import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

const documents = [
  "Quotation",
  "Work Order",
  "Certificate of Conformance",
  "Vendor PO",
  "Packing List",
];

export default function DeliveryPackage() {
  return (
    <AppLayout title="Delivery Package" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estimations", path: "/estimations" }, { label: "Delivery Package" }]}>
      <div className="bg-card rounded-xl card-shadow border border-border p-6 max-w-lg">
        <h3 className="font-semibold mb-4">Delivery Package</h3>
        <p className="text-sm text-muted-foreground mb-4">Included Documents:</p>
        <div className="space-y-2 mb-6">
          {documents.map((doc) => (
            <div key={doc} className="flex items-center gap-2 p-2.5 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">{doc}</span>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Download Delivery Package</Button>
      </div>
    </AppLayout>
  );
}
