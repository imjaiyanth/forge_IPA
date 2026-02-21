import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { getEstimations, getClients, getMembers } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Download, Upload, X, Minus, Copy, ChevronDown } from "lucide-react";
import { generateQuotationPdf } from "@/utils/generateQuotationPdf";

/* ──────────── types ──────────── */
interface CustomPart {
  id: number;
  jobDescription: string;
  material: string;
  heatNumber: string;
  drawingGivenByClient: string;
  materialGrade: string;
  quantity: string;
  drawingPartNo: string;
  rawMaterialSuppliedBy: string;
  jobCostUnit: string;
  uploadDrawings: string;
  rawMaterialDimension: string;
  totalCost: string;
}

interface CertCheck {
  label: string;
  value: string;
  report: string | null;
}

type JobTypeKey = "custom" | "cnc-milling" | "cnc-turning" | "laser-cutting" | "turning-lathe" | "fabrication-welding" | "surface-treatment";

const JOB_TYPES: { key: JobTypeKey; label: string }[] = [
  { key: "custom", label: "Custom Part" },
  { key: "cnc-milling", label: "CNC Milling Job pricing calculator" },
  { key: "cnc-turning", label: "CNC Turning Job pricing calculator" },
  { key: "laser-cutting", label: "Laser Cutting Job pricing calculator" },
  { key: "turning-lathe", label: "Turning / Lathe Module Job pricing calculator" },
  { key: "fabrication-welding", label: "Fabrication / Welding Module Job pricing calculator" },
  { key: "surface-treatment", label: "Surface Treatment / Heat Treatment Job pricing calculator" },
];

/* ──────────── section header component ──────────── */
function SectionHeader({ number, title, color = "bg-teal-600", collapsed, onToggle }: {
  number: string;
  title: string;
  color?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 cursor-pointer select-none" onClick={onToggle}>
      <h3 className="text-base font-bold text-foreground">
        #{number} {title}
      </h3>
      <ChevronDown className={`h-4 w-4 text-teal-600 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
    </div>
  );
}

/* ──────────── main component ──────────── */
export default function Estimation() {
  const { id } = useParams();
  const [estimation, setEstimation] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobQuantities, setJobQuantities] = useState<Record<JobTypeKey, number>>(
    () => JOB_TYPES.reduce((acc, jt) => ({ ...acc, [jt.key]: 0 }), {} as Record<JobTypeKey, number>)
  );

  /* ── basic details state ── */
  const [basic, setBasic] = useState({
    clientName: "",
    preparedBy: "",
    projectName: "",
    billingAddress: "",
    poc: "",
    shipToAddress: "",
    pocDesignation: "",
    pocPhone: "",
    pocPhoneRight: "",
    pocEmail: "",
    revision: "A",
    sameAsBilling: false,
    countryZipCode: false,
  });

  /* ── custom parts state ── */
  const [customParts, setCustomParts] = useState<CustomPart[]>([
    {
      id: 1,
      jobDescription: "",
      material: "",
      heatNumber: "",
      drawingGivenByClient: "Yes",
      materialGrade: "",
      quantity: "",
      drawingPartNo: "",
      rawMaterialSuppliedBy: "Client",
      jobCostUnit: "",
      uploadDrawings: "",
      rawMaterialDimension: "",
      totalCost: "Auto Calculated",
    },
  ]);

  /* ── quotation state ── */
  const [quotation, setQuotation] = useState({
    quotationNo: "Auto Generated in sequence",
    quotationDate: "",
    quotationValidTill: "",
    deliveryTime: "",
    paymentTerms: "",
    shipment: "Pickup / Courier",
    note: "1. 100% inspection",
  });

  /* ── work order state ── */
  const [workOrder, setWorkOrder] = useState({
    customerPONo: "",
    uploadPO: "",
    workOrderNo: "Auto Generated in sequence",
    deliveryTime: "",
    note: "",
  });

  /* ── certificate state ── */
  const [certChecks, setCertChecks] = useState<CertCheck[]>([
    { label: "Dimensional Verification", value: "Yes", report: null },
    { label: "Visual Inspection", value: "Yes", report: null },
    { label: "Hardness Testing", value: "No", report: null },
    { label: "Non - Destructive Examination", value: "No", report: null },
    { label: "Pressure Testing", value: "No", report: null },
    { label: "MTR", value: "Yes", report: null },
    { label: "Dim. Inspection Report", value: "No", report: null },
  ]);
  const [certNote, setCertNote] = useState(
    "This report is to certify that the above parts have been:\n• Manufactured in accordance with all in-house policies and procedures and in compliance with the customer's requirements and/or specifications. (Procedures available upon request)\n• Inspected in accordance with BP Precision Machining Ltds Inspection and Test procedure and found to be acceptable."
  );

  /* ── section collapse state ── */
  const [collapsed, setCollapsed] = useState({
    estimation: false,
    quotation: false,
    workOrder: false,
    certificate: false,
  });

  const toggleSection = (s: keyof typeof collapsed) =>
    setCollapsed({ ...collapsed, [s]: !collapsed[s] });

  /* ── minimized parts state ── */
  const [minimizedParts, setMinimizedParts] = useState<Record<number, boolean>>({});

  const toggleMinimizePart = (id: number) => {
    setMinimizedParts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── data fetching ── */
  useEffect(() => {
    // Try to load estimation data first; fallback to project data
    const loadData = async () => {
      try {
        // Try estimations first
        const estimations = await getEstimations();
        const numericId = parseInt(id || "0");
        let found = estimations.find((e: any) => e.id === id || e.id === numericId);

        if (found) {
          setEstimation(found);
          setBasic((prev) => ({
            ...prev,
            clientName: found.client_name || found.clientName || "",
            billingAddress: found.billing_address || found.billingAddress || "",
            shipToAddress: found.ship_to_address || found.shipToAddress || "",
            poc: found.poc_name || found.pocName || "",
            pocPhone: found.poc_phone || found.pocPhone || "",
            pocEmail: found.poc_email || found.pocEmail || "",
            preparedBy: found.prepared_by || found.preparedBy || "",
            projectName: found.project_name || found.projectName || "",
            revision: found.revision || "A",
          }));
        } else {
          // Fallback: load from projects
          const { getProjects } = await import("@/services/api");
          const projects = await getProjects();
          const proj = projects.find((p: any) => p.id === numericId || String(p.id) === id);
          if (proj) {
            setEstimation(proj);
            setBasic((prev) => ({
              ...prev,
              projectName: proj.name || "",
              pocPhone: proj.pocPhone || proj.poc_phone || "",
            }));
          } else {
            // Still set a blank estimation so the page renders
            setEstimation({ id: id, project_name: "New Estimation" });
          }
        }
      } catch (err) {
        console.error("Failed to load estimation data:", err);
        // Set blank estimation so the page renders
        setEstimation({ id: id, project_name: "New Estimation" });
      }
    };

    loadData();
    getClients().then(setClients).catch(console.error);
    getMembers().then(setMembers).catch(console.error);
  }, [id]);

  /* ── custom parts helpers ── */
  const addCustomPart = () => {
    setCustomParts([
      ...customParts,
      {
        id: Date.now(),
        jobDescription: "",
        material: "",
        heatNumber: "",
        drawingGivenByClient: "Yes",
        materialGrade: "",
        quantity: "",
        drawingPartNo: "",
        rawMaterialSuppliedBy: "Client",
        jobCostUnit: "",
        uploadDrawings: "",
        rawMaterialDimension: "",
        totalCost: "Auto Calculated",
      },
    ]);
  };

  const removeCustomPart = (partId: number) => {
    if (customParts.length > 1) setCustomParts(customParts.filter((p) => p.id !== partId));
  };

  const duplicateCustomPart = (partId: number) => {
    const part = customParts.find((p) => p.id === partId);
    if (!part) return;
    setCustomParts([...customParts, { ...part, id: Date.now() + Math.random() }]);
  };

  const updatePart = (partId: number, field: keyof CustomPart, value: string) => {
    setCustomParts(customParts.map((p) => (p.id === partId ? { ...p, [field]: value } : p)));
  };

  if (!estimation)
    return (
      <AppLayout title="Loading...">
        <div className="p-4">Loading...</div>
      </AppLayout>
    );

  return (
    <AppLayout
      title="Estimation Dashboard"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Estimations", path: "/estimations" },
        { label: basic.projectName || "New Estimation" },
      ]}
    >
      <div className="space-y-6">
        {/* ═══════════ BASIC DETAILS ═══════════ */}
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <fieldset>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Client Details */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold text-sm mb-2 border-b border-border pb-1">Client Details</h3>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Load Client (Optional)</Label>
                  <Select
                    onValueChange={(v) => {
                      const c = clients.find((client) => client.name === v);
                      if (c) {
                        setBasic({
                          ...basic,
                          clientName: c.name,
                          billingAddress: c.billing_address || "",
                          poc: c.poc_name || "",
                          pocPhone: c.poc_phone || "",
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select from list..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Client Name (For Quote)</Label>
                  <Input
                    className="h-9 text-sm"
                    value={basic.clientName}
                    onChange={(e) => setBasic({ ...basic, clientName: e.target.value })}
                    placeholder="Type client name..."
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Billing Address</Label>
                  <Input
                    value={basic.billingAddress}
                    onChange={(e) => setBasic({ ...basic, billingAddress: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">POC</Label>
                  <Input
                    value={basic.poc}
                    onChange={(e) => setBasic({ ...basic, poc: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">POC Phone</Label>
                  <Input
                    value={basic.pocPhone}
                    onChange={(e) => setBasic({ ...basic, pocPhone: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Column 2: Sellers Details */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold text-sm mb-2 border-b border-border pb-1">Sellers Details</h3>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Prepared By</Label>
                  <Input
                    value={basic.preparedBy}
                    onChange={(e) => setBasic({ ...basic, preparedBy: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">POC</Label>
                  <Input className="h-9 text-sm" placeholder="" /> 
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">POC Designation</Label>
                  <Input 
                    value={basic.pocDesignation} 
                    onChange={(e) => setBasic({ ...basic, pocDesignation: e.target.value })}
                    className="h-9 text-sm" 
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">POC Email</Label>
                  <Input
                    value={basic.pocEmail}
                    onChange={(e) => setBasic({ ...basic, pocEmail: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Column 3: Project Details */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold text-sm mb-2 border-b border-border pb-1">Project Details</h3>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Project Name</Label>
                  <Input
                    value={basic.projectName}
                    onChange={(e) => setBasic({ ...basic, projectName: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Ship to Address</Label>
                  <Input
                    value={basic.sameAsBilling ? basic.billingAddress : basic.shipToAddress}
                    onChange={(e) => setBasic({ ...basic, shipToAddress: e.target.value })}
                    className="h-9 text-sm"
                    disabled={basic.sameAsBilling}
                  />
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                      <Checkbox
                        checked={basic.sameAsBilling}
                        onCheckedChange={(v) => setBasic({ ...basic, sameAsBilling: !!v })}
                      />
                      Same as Billing
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                      <Checkbox
                        checked={basic.countryZipCode}
                        onCheckedChange={(v) => setBasic({ ...basic, countryZipCode: !!v })}
                      />
                      Country/Zip Code
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Revision</Label>
                  <Select
                    value={basic.revision}
                    onValueChange={(v) => setBasic({ ...basic, revision: v })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
          </fieldset>
        </div>

        {/* ═══════════ #01 ESTIMATION ═══════════ */}
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <div className="flex items-center justify-between">
            <SectionHeader
              number="01"
              title="Estimation"
              collapsed={collapsed.estimation}
              onToggle={() => toggleSection("estimation")}
            />
            <Button size="sm" onClick={() => {
              setJobQuantities(JOB_TYPES.reduce((acc, jt) => ({ ...acc, [jt.key]: 0 }), {} as Record<JobTypeKey, number>));
              setShowJobModal(true);
            }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </div>

          {!collapsed.estimation && (
            <div className="space-y-6 mt-2">
              {customParts.map((part, idx) => (
                <div key={part.id} className="border border-border rounded-lg p-4 bg-background/50">
                  {/* Part header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      #{idx + 1} Custom Part
                    </h4>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1 rounded hover:bg-muted" 
                        title="Duplicate"
                        onClick={() => duplicateCustomPart(part.id)}
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button 
                        className="p-1 rounded hover:bg-muted" 
                        title={minimizedParts[part.id] ? "Maximize" : "Minimize"}
                        onClick={() => toggleMinimizePart(part.id)}
                      >
                        {minimizedParts[part.id] ? <Plus className="h-3.5 w-3.5 text-muted-foreground" /> : <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                      </button>
                      <button
                        className="p-1 rounded hover:bg-destructive/10"
                        title="Remove"
                        onClick={() => removeCustomPart(part.id)}
                      >
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* Part fields */}
                  {!minimizedParts[part.id] && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    {/* Row 1 */}
                    <div className="space-y-1">
                      <Label className="text-xs">Job Description</Label>
                      <Input
                        value={part.jobDescription}
                        onChange={(e) => updatePart(part.id, "jobDescription", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Material</Label>
                      <Select
                        value={part.material}
                        onValueChange={(v) => updatePart(part.id, "material", v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
                          <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                          <SelectItem value="Aluminum">Aluminum</SelectItem>
                          <SelectItem value="Brass">Brass</SelectItem>
                          <SelectItem value="Copper">Copper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Heat Number</Label>
                      <Input
                        value={part.heatNumber}
                        onChange={(e) => updatePart(part.id, "heatNumber", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="space-y-1">
                      <Label className="text-xs">Drawing given by Client</Label>
                      <Select
                        value={part.drawingGivenByClient}
                        onValueChange={(v) => updatePart(part.id, "drawingGivenByClient", v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Material Grade</Label>
                      <Input
                        value={part.materialGrade}
                        onChange={(e) => updatePart(part.id, "materialGrade", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, "quantity", e.target.value)}
                        type="number"
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-1">
                      <Label className="text-xs">Drawing/Part No.</Label>
                      <Input
                        value={part.drawingPartNo}
                        onChange={(e) => updatePart(part.id, "drawingPartNo", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Raw Material Supplied by</Label>
                      <Select
                        value={part.rawMaterialSuppliedBy}
                        onValueChange={(v) => updatePart(part.id, "rawMaterialSuppliedBy", v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Client">Client</SelectItem>
                          <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="In-House">In-House</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Job Cost/Unit</Label>
                      <Input
                        value={part.jobCostUnit}
                        onChange={(e) => updatePart(part.id, "jobCostUnit", e.target.value)}
                        type="number"
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-1">
                      <Label className="text-xs">Upload Drawings</Label>
                      <label className="h-8 px-3 flex items-center gap-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-3.5 w-3.5" /> Upload
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Raw Material Dimension</Label>
                      <Input
                        value={part.rawMaterialDimension}
                        onChange={(e) => updatePart(part.id, "rawMaterialDimension", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Total Cost</Label>
                      <div className="h-8 px-3 flex items-center bg-muted/50 rounded-md text-sm font-medium text-muted-foreground">
                        {part.quantity && part.jobCostUnit
                          ? `₹${(parseFloat(part.quantity) * parseFloat(part.jobCostUnit)).toLocaleString()}`
                          : "Auto Calculated"}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ #02 QUOTATION ═══════════ */}
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <SectionHeader
            number="02"
            title="Quotation"
            collapsed={collapsed.quotation}
            onToggle={() => toggleSection("quotation")}
          />

          {!collapsed.quotation && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Quotation No.</Label>
                  <Input
                    value={quotation.quotationNo}
                    onChange={(e) => setQuotation({ ...quotation, quotationNo: e.target.value })}
                    className="h-9 text-sm bg-muted/30"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Quotation Date</Label>
                  <Input
                    type="date"
                    value={quotation.quotationDate}
                    onChange={(e) => setQuotation({ ...quotation, quotationDate: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Quotation Valid Till</Label>
                  <Input
                    type="date"
                    value={quotation.quotationValidTill}
                    onChange={(e) => setQuotation({ ...quotation, quotationValidTill: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Delivery Time</Label>
                  <Input
                    value={quotation.deliveryTime}
                    onChange={(e) => setQuotation({ ...quotation, deliveryTime: e.target.value })}
                    placeholder="Type..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Payment Terms</Label>
                  <Input
                    value={quotation.paymentTerms}
                    onChange={(e) => setQuotation({ ...quotation, paymentTerms: e.target.value })}
                    placeholder="Type..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Shipment</Label>
                  <Select
                    value={quotation.shipment}
                    onValueChange={(v) => setQuotation({ ...quotation, shipment: v })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pickup / Courier">Pickup / Courier</SelectItem>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <Label className="text-xs font-medium">Note:</Label>
                <Textarea
                  value={quotation.note}
                  onChange={(e) => setQuotation({ ...quotation, note: e.target.value })}
                  className="text-sm"
                  rows={3}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const today = new Date();
                    const validDate = new Date(today);
                    validDate.setDate(validDate.getDate() + 15);
                    const fmtDate = (d: Date) =>
                      `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`;

                    const noteLines = (quotation.note || "")
                      .split(/\r?\n/)
                      .map((n) => n.trim())
                      .filter(Boolean);

                    generateQuotationPdf({
                      // Client Details (To)
                      clientName: basic.clientName,
                      clientPoc: basic.poc, // "POC" from Client Details
                      clientEmail: "", // There is no dedicated client email field in column 1, only POC Email is in column 2 (Sellers).
                                       // Looking at the UI code:
                                       // Column 1 (Client): Name, Billing, POC, POC Phone.
                                       // Column 2 (Seller): Prepared By, POC, POC Designation, POC Email.
                                       // This data model is slightly mixed. I will map strict to what's visually in the column.
                                       // If column 1 has no email input, I pass empty.
                      clientPhone: basic.pocPhone, // "POC Phone" from Client Details
                      
                      // Sellers Details (Prepared By)
                      companyName: "J3M Fabrication LLC",
                      companyPoc: basic.preparedBy,
                      companyEmail: basic.pocEmail, // "POC Email" from Sellers Details
                      companyPhone: "480-900-8401", // Hardcoded J3M phone as per image, since no input field exists in seller column.
                      
                      proposalNo: quotation.quotationNo,
                      proposalDate: quotation.quotationDate || fmtDate(today),
                      projectName: basic.projectName,
                      validThru: quotation.quotationValidTill || fmtDate(validDate),
                      items: customParts.map((p, i) => ({
                        description: p.jobDescription || `Item - ${i + 1}`,
                        unitPrice: parseFloat(p.jobCostUnit) || 0,
                        quantity: parseInt(p.quantity) || 1,
                        totalPrice:
                          (parseFloat(p.jobCostUnit) || 0) *
                          (parseInt(p.quantity) || 1),
                      })),
                      schedule: [],
                      notes: noteLines,
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Download Quotation
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════ #03 WORK ORDER ═══════════ */}
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <SectionHeader
            number="03"
            title="Work Order"
            collapsed={collapsed.workOrder}
            onToggle={() => toggleSection("workOrder")}
          />

          {!collapsed.workOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Customer PO No.</Label>
                  <Input
                    value={workOrder.customerPONo}
                    onChange={(e) => setWorkOrder({ ...workOrder, customerPONo: e.target.value })}
                    placeholder="Type..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Upload PO</Label>
                  <label className="h-9 px-3 flex items-center gap-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary transition-colors cursor-pointer w-fit">
                    <Upload className="h-3.5 w-3.5" /> Click to Upload
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Work Order No.</Label>
                  <Input
                    value={workOrder.workOrderNo}
                    className="h-9 text-sm bg-muted/30"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Delivery Time</Label>
                  <Input
                    type="date"
                    value={workOrder.deliveryTime}
                    onChange={(e) => setWorkOrder({ ...workOrder, deliveryTime: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Right column - Note + Download */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Note:</Label>
                  <Textarea
                    value={workOrder.note}
                    onChange={(e) => setWorkOrder({ ...workOrder, note: e.target.value })}
                    className="text-sm"
                    rows={5}
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" /> Download Work Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════ #04 CERTIFICATE OF CONFORMATION ═══════════ */}
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <SectionHeader
            number="04"
            title="Certificate Of Conformation"
            collapsed={collapsed.certificate}
            onToggle={() => toggleSection("certificate")}
          />

          {!collapsed.certificate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - checklist */}
              <div className="space-y-3">
                {certChecks.map((check, i) => (
                  <div
                    key={check.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium min-w-[200px]">{check.label}</span>
                    <div className="flex items-center gap-2">
                      <Select
                        value={check.value}
                        onValueChange={(v) => {
                          const updated = [...certChecks];
                          updated[i] = { ...updated[i], value: v };
                          setCertChecks(updated);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="h-7 px-2 flex items-center gap-1 border border-dashed border-border rounded text-xs text-muted-foreground hover:border-primary transition-colors cursor-pointer whitespace-nowrap">
                        <Upload className="h-3 w-3" /> Upload Report
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column - Note + Download */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Note:</Label>
                  <Textarea
                    value={certNote}
                    onChange={(e) => setCertNote(e.target.value)}
                    className="text-sm"
                    rows={8}
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" /> Download Work Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ ADD NEW JOB DIALOG ═══════════ */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
            <DialogTitle className="text-base font-bold">Add New Job</DialogTitle>
          </DialogHeader>
          <div className="divide-y divide-border">
            {JOB_TYPES.map((jt) => (
              <div key={jt.key} className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/30 transition-colors">
                <span className="text-sm">{jt.label}</span>
                <div className="flex items-center gap-0.5">
                  <span className="inline-flex items-center justify-center h-7 min-w-[36px] px-2 bg-zinc-800 text-white text-xs font-bold rounded-l">
                    {jobQuantities[jt.key]}
                  </span>
                  <button
                    className="inline-flex items-center justify-center h-7 w-7 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                    onClick={() => setJobQuantities({ ...jobQuantities, [jt.key]: Math.max(0, jobQuantities[jt.key] - 1) })}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center h-7 w-7 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors rounded-r"
                    onClick={() => setJobQuantities({ ...jobQuantities, [jt.key]: jobQuantities[jt.key] + 1 })}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-border flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Add the requested number of custom parts for each type
                const newParts: CustomPart[] = [];
                for (const jt of JOB_TYPES) {
                  const count = jobQuantities[jt.key];
                  for (let i = 0; i < count; i++) {
                    newParts.push({
                      id: Date.now() + Math.random(),
                      jobDescription: jt.label === "Custom Part" ? "" : jt.label.replace(" Job pricing calculator", "").replace(" Module Job pricing calculator", ""),
                      material: "",
                      heatNumber: "",
                      drawingGivenByClient: "Yes",
                      materialGrade: "",
                      quantity: "",
                      drawingPartNo: "",
                      rawMaterialSuppliedBy: "Client",
                      jobCostUnit: "",
                      uploadDrawings: "",
                      rawMaterialDimension: "",
                      totalCost: "Auto Calculated",
                    });
                  }
                }
                if (newParts.length > 0) {
                  setCustomParts([...customParts, ...newParts]);
                }
                setShowJobModal(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Selected Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
