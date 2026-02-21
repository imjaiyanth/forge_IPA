export const mockMembers = [
  { id: 1, name: "Rajesh Kumar", role: "Admin", email: "rajesh@forgeipa.com", contact: "+91 98765 43210" },
  { id: 2, name: "Priya Sharma", role: "Sales", email: "priya@forgeipa.com", contact: "+91 98765 43211" },
  { id: 3, name: "Amit Patel", role: "Project Manager", email: "amit@forgeipa.com", contact: "+91 98765 43212" },
  { id: 4, name: "Sunita Reddy", role: "Sales", email: "sunita@forgeipa.com", contact: "+91 98765 43213" },
];

export const mockClients = [
  { id: 1, name: "Tata Steel Ltd", clientId: "CLT-001", address: "Mumbai, Maharashtra", poc: "Vikram Mehta", phone: "+91 22 6665 8282", email: "vikram@tatasteel.com" },
  { id: 2, name: "Larsen & Toubro", clientId: "CLT-002", address: "Chennai, Tamil Nadu", poc: "Anand Iyer", phone: "+91 44 2249 6000", email: "anand@lnt.com" },
  { id: 3, name: "Bharat Forge", clientId: "CLT-003", address: "Pune, Maharashtra", poc: "Deepak Joshi", phone: "+91 20 6704 2777", email: "deepak@bharatforge.com" },
  { id: 4, name: "Godrej Industries", clientId: "CLT-004", address: "Mumbai, Maharashtra", poc: "Neha Kapoor", phone: "+91 22 2518 8010", email: "neha@godrej.com" },
];

export const mockVendors = [
  { id: 1, name: "Steel Authority India", vendorId: "VND-001", address: "New Delhi", poc: "Ravi Shankar", phone: "+91 11 2436 7481", email: "ravi@sail.com" },
  { id: 2, name: "Jindal Steel Works", vendorId: "VND-002", address: "Bellary, Karnataka", poc: "Suresh Garg", phone: "+91 83 9224 0001", email: "suresh@jindal.com" },
  { id: 3, name: "Precision Tools India", vendorId: "VND-003", address: "Bangalore, Karnataka", poc: "Mohan Das", phone: "+91 80 2553 0291", email: "mohan@precisiontools.in" },
];

export const mockProjects = [
  { id: 1, name: "CNC Shaft Assembly", quotationNo: "QTN-2024-001", status: "In Progress", pocPhone: "+91 22 6665 8282" },
  { id: 2, name: "Hydraulic Valve Body", quotationNo: "QTN-2024-002", status: "Quoted", pocPhone: "+91 44 2249 6000" },
  { id: 3, name: "Turbine Blade Set", quotationNo: "QTN-2024-003", status: "Completed", pocPhone: "+91 20 6704 2777" },
  { id: 4, name: "Gear Housing Unit", quotationNo: "QTN-2024-004", status: "Draft", pocPhone: "+91 22 2518 8010" },
];

export const mockEstimation = {
  id: "EST-001",
  client: "Tata Steel Ltd",
  billingAddress: "Jamshedpur Works, Jharkhand 831001",
  shipToAddress: "Tata Steel Plant, Jamshedpur",
  poc: "Vikram Mehta",
  pocPhone: "+91 22 6665 8282",
  pocEmail: "vikram@tatasteel.com",
  preparedBy: "Rajesh Kumar",
  projectName: "CNC Shaft Assembly",
  revision: "Rev 2",
  proposalNo: "PRP-2024-001",
  proposalDate: "2024-01-15",
  validTill: "2024-02-15",
};

export const mockStats = {
  totalClients: 24,
  activeProjects: 12,
  quotations: 38,
  completedJobs: 156,
};

export const mockCompany = {
  name: "Forge i-DAS",
  address: "Plot No. 45, MIDC Industrial Area, Pune, Maharashtra 411026",
  email: "info@forgeidas.com",
  phone: "+91 20 2710 4500",
};
