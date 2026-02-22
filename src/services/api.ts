import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
function normalizeUrl(u: string | undefined) {
  if (!u) return u;
  // If user provided URL is missing scheme, assume https
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export const API_URL = normalizeUrl(rawApiUrl) ?? (import.meta.env.PROD ? 'https://forgeipa-production.up.railway.app' : 'http://127.0.0.1:8000');

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMembers = async () => {
    const response = await api.get('/members');
    return response.data;
};


export const getClients = async () => {
    const response = await api.get('/clients');
    return response.data.map((c: any) => ({
        ...c,
        clientId: c.client_id
    }));
};

export const getVendors = async () => {
    const response = await api.get('/vendors');
    return response.data.map((v: any) => ({
        ...v,
        vendorId: v.vendor_id,
        rawMaterials: v.raw_materials ? JSON.parse(v.raw_materials) : []
    }));
};

export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data.map((p: any) => ({
        ...p,
        quotationNo: p.quotation_no,
        pocPhone: p.poc_phone
    }));
};

export const getEstimations = async () => {
    const response = await api.get('/estimations');
    // Estimations might need mapping too
    return response.data.map((e: any) => ({
        ...e,
        clientId: e.client_id, // if applicable
        billingAddress: e.billing_address,
        shipToAddress: e.ship_to_address,
        pocName: e.poc_name, // e.poc_name vs e.poc ? Schema has poc_name
        pocPhone: e.poc_phone,
        pocEmail: e.poc_email,
        preparedBy: e.prepared_by,
        projectName: e.project_name,
        proposalNo: e.proposal_no,
        proposalDate: e.proposal_date,
        validTill: e.valid_till
    }));
};

export const getDashboardStats = async () => {
    // For now, we can calculate stats from other endpoints or create a specific endpoint
    // Let's assume we fetch all data and calculate
    const [clients, projects] = await Promise.all([
        getClients(),
        getProjects()
    ]);

    return {
        totalClients: clients.length,
        activeProjects: projects.filter((p: any) => p.status === 'In Progress').length,
        quotations: projects.length, // Assuming all projects start as quotations
        completedJobs: projects.filter((p: any) => p.status === 'Completed').length
    };
};


export const getCompany = async () => {
    const response = await api.get('/company');
    return response.data;
};

// Create Operations

export const createMember = async (member: any) => {
    const response = await api.post('/members', member);
    return response.data;
};

export const updateMember = async (id: number, member: any) => {
    const response = await api.put(`/members/${id}`, member);
    return response.data;
};

export const deleteMember = async (id: number) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
};

export const createClient = async (client: any) => {
    // Backend expects 'client_id' but form uses 'clientId'
    // We should map it properly
    const data = {
        name: client.name,
        client_id: client.clientId,
        address: client.address,
        poc: client.poc,
        phone: client.phone,
        email: client.email
    };
    const response = await api.post('/clients', data);
    return response.data;
};

export const updateClient = async (id: number, client: any) => {
    const data = {
        name: client.name,
        client_id: client.clientId,
        address: client.address,
        poc: client.poc,
        phone: client.phone,
        email: client.email
    };
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
};

export const deleteClient = async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
};

export const createVendor = async (vendor: any) => {
    const data = {
        name: vendor.name,
        vendor_id: vendor.vendorId,
        address: vendor.address,
        poc: vendor.poc,
        phone: vendor.phone,
        email: vendor.email,
        raw_materials: vendor.rawMaterials ? JSON.stringify(vendor.rawMaterials) : null
    };
    const response = await api.post('/vendors', data);
    return response.data;
};

export const updateVendor = async (id: number, vendor: any) => {
    const data = {
        name: vendor.name,
        vendor_id: vendor.vendorId,
        address: vendor.address,
        poc: vendor.poc,
        phone: vendor.phone,
        email: vendor.email,
        raw_materials: vendor.rawMaterials ? JSON.stringify(vendor.rawMaterials) : null
    };
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
};

export const deleteVendor = async (id: number) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
};

export const createProject = async (project: any) => {
    const data = {
        name: project.name,
        quotation_no: project.quotationNo,
        status: project.status,
        poc_phone: project.pocPhone
    };
    const response = await api.post('/projects', data);
    return response.data;
};

export const updateProject = async (id: number, project: any) => {
    const data = {
        name: project.name,
        quotation_no: project.quotationNo,
        status: project.status,
        poc_phone: project.pocPhone
    };
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: number) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

