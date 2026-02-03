// Mock data for Art Stock ERP Demo
// Realistic dummy data to demonstrate data density and UX (50+ entries)

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  type: 'contact' | 'company' | 'reseller';
  status: 'active' | 'inactive';
  totalPaid: number;
  activeSubscriptions: number;
  paymentBehavior: 'punctual' | 'mixed' | 'defaulter';
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  product: string;
  plan: string;
  type: '1:1' | '1:N' | 'teams' | 'profile' | 'key';
  status: 'active' | 'expiring' | 'overdue' | 'suspended' | 'revoked' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue' | 'partial';
  startDate: string;
  expiryDate: string;
  amount: number;
  currency: 'USD' | 'PEN';
  inventoryId: string | null;
  slots?: { used: number; total: number };
  compensation?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  subscriptionId: string;
  product: string;
  period: string;
  amount: number;
  currency: 'USD' | 'PEN';
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
}

export interface Inventory {
  id: string;
  product: string;
  type: '1:1' | '1:N' | 'teams' | 'profile' | 'key';
  status: 'available' | 'assigned' | 'blocked' | 'cleaning';
  username?: string;
  password?: string;
  email?: string;
  provider: string;
  slots?: InventorySlot[];
  totalSlots?: number;
  usedSlots?: number;
  expiryDate: string;
  createdAt: string;
}

export interface InventorySlot {
  id: string;
  slotNumber: number;
  status: 'available' | 'assigned' | 'expiring' | 'overdue';
  customerId?: string;
  customerName?: string;
  subscriptionId?: string;
  expiryDate?: string;
  assignedAt?: string;
}

export interface AccessHistory {
  id: string;
  subscriptionId: string;
  event: 'assignment' | 'replacement' | 'reassignment' | 'update' | 'suspension' | 'reactivation' | 'revocation';
  inventoryId: string;
  previousInventoryId?: string;
  change: string;
  reason?: string;
  executor: string;
  timestamp: string;
  note?: string;
}

// Generate 50+ realistic mock customers
export const mockCustomers: Customer[] = [
  { id: 'CLI-001', name: 'María García López', email: 'maria.garcia@gmail.com', phone: '+51 987 654 321', country: 'PE', type: 'contact', status: 'active', totalPaid: 1250.00, activeSubscriptions: 3, paymentBehavior: 'punctual', createdAt: '2024-03-15' },
  { id: 'CLI-002', name: 'TechSoft SAC', email: 'admin@techsoft.pe', phone: '+51 1 234 5678', country: 'PE', type: 'company', status: 'active', totalPaid: 8500.00, activeSubscriptions: 12, paymentBehavior: 'punctual', createdAt: '2023-11-20' },
  { id: 'CLI-003', name: 'Carlos Mendoza', email: 'cmendoza@outlook.com', phone: '+51 912 345 678', country: 'PE', type: 'contact', status: 'active', totalPaid: 450.00, activeSubscriptions: 1, paymentBehavior: 'mixed', createdAt: '2024-06-01' },
  { id: 'CLI-004', name: 'Digital Reseller Pro', email: 'ventas@digitalreseller.com', phone: '+52 55 1234 5678', country: 'MX', type: 'reseller', status: 'active', totalPaid: 25000.00, activeSubscriptions: 45, paymentBehavior: 'punctual', createdAt: '2023-08-10' },
  { id: 'CLI-005', name: 'Andrea Ruiz', email: 'andrea.ruiz@empresa.com', phone: '+51 976 543 210', country: 'PE', type: 'contact', status: 'active', totalPaid: 890.00, activeSubscriptions: 2, paymentBehavior: 'punctual', createdAt: '2024-01-22' },
  { id: 'CLI-006', name: 'Innovate Solutions', email: 'contacto@innovate.mx', phone: '+52 33 9876 5432', country: 'MX', type: 'company', status: 'active', totalPaid: 4200.00, activeSubscriptions: 8, paymentBehavior: 'mixed', createdAt: '2024-02-14' },
  { id: 'CLI-007', name: 'Juan Pablo Torres', email: 'jptorres@gmail.com', phone: '+51 945 678 901', country: 'PE', type: 'contact', status: 'inactive', totalPaid: 150.00, activeSubscriptions: 0, paymentBehavior: 'defaulter', createdAt: '2024-04-30' },
  { id: 'CLI-008', name: 'Creative Studio Lima', email: 'hello@creativestudio.pe', phone: '+51 1 456 7890', country: 'PE', type: 'company', status: 'active', totalPaid: 3600.00, activeSubscriptions: 6, paymentBehavior: 'punctual', createdAt: '2023-12-05' },
  { id: 'CLI-009', name: 'Fernando Velásquez', email: 'fvelasquez@hotmail.com', phone: '+51 923 456 789', country: 'PE', type: 'contact', status: 'active', totalPaid: 320.00, activeSubscriptions: 2, paymentBehavior: 'punctual', createdAt: '2024-07-10' },
  { id: 'CLI-010', name: 'Mega Distribuciones', email: 'info@megadist.com.mx', phone: '+52 81 8765 4321', country: 'MX', type: 'reseller', status: 'active', totalPaid: 18500.00, activeSubscriptions: 32, paymentBehavior: 'punctual', createdAt: '2023-09-15' },
  { id: 'CLI-011', name: 'Lucía Fernández', email: 'lucia.f@gmail.com', phone: '+51 956 789 012', country: 'PE', type: 'contact', status: 'active', totalPaid: 560.00, activeSubscriptions: 3, paymentBehavior: 'mixed', createdAt: '2024-05-20' },
  { id: 'CLI-012', name: 'Soluciones Digitales SAC', email: 'soporte@soldig.pe', phone: '+51 1 567 8901', country: 'PE', type: 'company', status: 'active', totalPaid: 5800.00, activeSubscriptions: 9, paymentBehavior: 'punctual', createdAt: '2023-10-25' },
  { id: 'CLI-013', name: 'Roberto Sánchez', email: 'r.sanchez@empresa.mx', phone: '+52 55 9876 5432', country: 'MX', type: 'contact', status: 'active', totalPaid: 780.00, activeSubscriptions: 4, paymentBehavior: 'punctual', createdAt: '2024-02-28' },
  { id: 'CLI-014', name: 'CloudTech Partners', email: 'partners@cloudtech.co', phone: '+57 1 234 5678', country: 'CO', type: 'reseller', status: 'active', totalPaid: 12400.00, activeSubscriptions: 28, paymentBehavior: 'punctual', createdAt: '2023-07-18' },
  { id: 'CLI-015', name: 'Patricia Morales', email: 'pmorales@outlook.es', phone: '+51 934 567 890', country: 'PE', type: 'contact', status: 'active', totalPaid: 410.00, activeSubscriptions: 2, paymentBehavior: 'defaulter', createdAt: '2024-08-05' },
  { id: 'CLI-016', name: 'StartUp Hub', email: 'admin@startuphub.pe', phone: '+51 1 678 9012', country: 'PE', type: 'company', status: 'active', totalPaid: 2900.00, activeSubscriptions: 5, paymentBehavior: 'punctual', createdAt: '2024-01-10' },
  { id: 'CLI-017', name: 'Miguel Ángel Reyes', email: 'mareyes@gmail.com', phone: '+52 33 1234 5678', country: 'MX', type: 'contact', status: 'inactive', totalPaid: 95.00, activeSubscriptions: 0, paymentBehavior: 'defaulter', createdAt: '2024-04-15' },
  { id: 'CLI-018', name: 'DesignPro Agency', email: 'hello@designpro.mx', phone: '+52 55 2345 6789', country: 'MX', type: 'company', status: 'active', totalPaid: 6700.00, activeSubscriptions: 11, paymentBehavior: 'punctual', createdAt: '2023-11-30' },
  { id: 'CLI-019', name: 'Carmen Vega', email: 'carmen.vega@mail.com', phone: '+51 967 890 123', country: 'PE', type: 'contact', status: 'active', totalPaid: 620.00, activeSubscriptions: 3, paymentBehavior: 'punctual', createdAt: '2024-06-12' },
  { id: 'CLI-020', name: 'SoftMax Colombia', email: 'ventas@softmax.co', phone: '+57 4 567 8901', country: 'CO', type: 'reseller', status: 'active', totalPaid: 9800.00, activeSubscriptions: 22, paymentBehavior: 'mixed', createdAt: '2023-08-22' },
  { id: 'CLI-021', name: 'Diego Ramírez', email: 'd.ramirez@empresa.pe', phone: '+51 945 012 345', country: 'PE', type: 'contact', status: 'active', totalPaid: 380.00, activeSubscriptions: 2, paymentBehavior: 'punctual', createdAt: '2024-03-08' },
  { id: 'CLI-022', name: 'Estudio Creativo', email: 'info@estudiocreativo.pe', phone: '+51 1 789 0123', country: 'PE', type: 'company', status: 'active', totalPaid: 4100.00, activeSubscriptions: 7, paymentBehavior: 'punctual', createdAt: '2023-12-18' },
  { id: 'CLI-023', name: 'Ana López Mendoza', email: 'ana.lopez@hotmail.com', phone: '+52 81 3456 7890', country: 'MX', type: 'contact', status: 'active', totalPaid: 540.00, activeSubscriptions: 3, paymentBehavior: 'mixed', createdAt: '2024-05-05' },
  { id: 'CLI-024', name: 'TechDistributor MX', email: 'sales@techdist.mx', phone: '+52 55 4567 8901', country: 'MX', type: 'reseller', status: 'active', totalPaid: 22000.00, activeSubscriptions: 38, paymentBehavior: 'punctual', createdAt: '2023-06-20' },
  { id: 'CLI-025', name: 'Eduardo Castillo', email: 'ecastillo@gmail.com', phone: '+51 912 345 012', country: 'PE', type: 'contact', status: 'active', totalPaid: 290.00, activeSubscriptions: 1, paymentBehavior: 'punctual', createdAt: '2024-07-25' },
  { id: 'CLI-026', name: 'WebMasters Peru', email: 'contacto@webmasters.pe', phone: '+51 1 890 1234', country: 'PE', type: 'company', status: 'active', totalPaid: 7200.00, activeSubscriptions: 13, paymentBehavior: 'punctual', createdAt: '2023-09-10' },
  { id: 'CLI-027', name: 'Sofía Hernández', email: 'sofia.h@empresa.co', phone: '+57 3 123 4567', country: 'CO', type: 'contact', status: 'active', totalPaid: 680.00, activeSubscriptions: 4, paymentBehavior: 'punctual', createdAt: '2024-02-05' },
  { id: 'CLI-028', name: 'MediaGroup LAM', email: 'admin@mediagroup.mx', phone: '+52 33 5678 9012', country: 'MX', type: 'company', status: 'active', totalPaid: 8900.00, activeSubscriptions: 15, paymentBehavior: 'punctual', createdAt: '2023-10-08' },
  { id: 'CLI-029', name: 'Pedro Martínez', email: 'pmartinez@outlook.com', phone: '+51 978 901 234', country: 'PE', type: 'contact', status: 'inactive', totalPaid: 120.00, activeSubscriptions: 0, paymentBehavior: 'defaulter', createdAt: '2024-03-30' },
  { id: 'CLI-030', name: 'Digital Solutions CO', email: 'info@digitalsol.co', phone: '+57 2 345 6789', country: 'CO', type: 'reseller', status: 'active', totalPaid: 15600.00, activeSubscriptions: 26, paymentBehavior: 'punctual', createdAt: '2023-07-05' },
];

// Generate 50+ realistic mock subscriptions with varied statuses
const products = ['Adobe Creative Cloud', 'ChatGPT Plus', 'Microsoft 365', 'Canva Pro', 'Netflix Premium', 'Spotify Family', 'Figma', 'Grammarly', 'Zoom Pro', 'CapCut Pro', 'Freepik Premium', 'Envato Elements', 'Notion Pro', 'Slack Business', 'Trello Premium', 'Miro Team', 'Adobe Photoshop', 'Premiere Pro', 'After Effects', 'Illustrator'];
const plans = ['Mensual', 'Trimestral', 'Anual'];
const types: ('1:1' | '1:N' | 'teams' | 'profile' | 'key')[] = ['1:1', '1:N', 'teams', 'profile', 'key'];
const statuses: ('active' | 'expiring' | 'overdue' | 'suspended')[] = ['active', 'active', 'active', 'expiring', 'overdue', 'suspended'];
const paymentStatuses: ('paid' | 'pending' | 'overdue' | 'partial')[] = ['paid', 'paid', 'paid', 'pending', 'overdue', 'partial'];

function generateSubscriptions(): Subscription[] {
  const subs: Subscription[] = [];
  
  for (let i = 1; i <= 55; i++) {
    const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const payStatus = status === 'overdue' ? 'overdue' : status === 'suspended' ? 'overdue' : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    
    // Generate dates
    const startMonth = Math.floor(Math.random() * 12) + 1;
    const startYear = 2024;
    const expiryDays = status === 'expiring' ? Math.floor(Math.random() * 7) + 1 : status === 'overdue' ? -Math.floor(Math.random() * 10) - 1 : Math.floor(Math.random() * 180) + 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    const sub: Subscription = {
      id: `SUB-${String(i).padStart(3, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      product,
      plan: plans[Math.floor(Math.random() * plans.length)],
      type,
      status,
      paymentStatus: payStatus,
      startDate: `2024-${String(startMonth).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      expiryDate: expiryDate.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 500) + 10,
      currency: Math.random() > 0.3 ? 'USD' : 'PEN',
      inventoryId: `INV-${String(i).padStart(3, '0')}`,
    };
    
    if (type === '1:N') {
      const total = Math.floor(Math.random() * 10) + 3;
      sub.slots = { used: Math.floor(Math.random() * total) + 1, total };
    }
    
    subs.push(sub);
  }
  
  return subs;
}

export const mockSubscriptions: Subscription[] = generateSubscriptions();

// Generate more invoices
function generateInvoices(): Invoice[] {
  const invs: Invoice[] = [];
  const invoiceStatuses: ('paid' | 'pending' | 'overdue' | 'partial')[] = ['paid', 'paid', 'pending', 'overdue', 'partial'];
  
  for (let i = 1; i <= 40; i++) {
    const sub = mockSubscriptions[Math.floor(Math.random() * mockSubscriptions.length)];
    const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
    const dueDays = status === 'overdue' ? -Math.floor(Math.random() * 15) - 1 : status === 'paid' ? -Math.floor(Math.random() * 60) : Math.floor(Math.random() * 30);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);
    
    const inv: Invoice = {
      id: `INV-2024-${String(i).padStart(3, '0')}`,
      customerId: sub.customerId,
      customerName: sub.customerName,
      subscriptionId: sub.id,
      product: sub.product,
      period: 'Ene 2025',
      amount: sub.amount,
      currency: sub.currency,
      dueDate: dueDate.toISOString().split('T')[0],
      status,
    };
    
    if (status === 'partial') {
      inv.paidAmount = Math.floor(inv.amount * 0.6);
    }
    
    invs.push(inv);
  }
  
  return invs;
}

export const mockInvoices: Invoice[] = generateInvoices();

// Generate realistic mock inventory (1:N shared accounts)
export const mockInventory: Inventory[] = [
  {
    id: 'INV-NF001',
    product: 'Netflix Premium',
    type: '1:N',
    status: 'assigned',
    username: 'artstock.netflix01@gmail.com',
    password: 'SecureP@ss2024!',
    provider: 'Netflix Inc.',
    totalSlots: 5,
    usedSlots: 4,
    expiryDate: '2025-06-15',
    createdAt: '2024-01-10',
    slots: [
      { id: 'S1', slotNumber: 1, status: 'assigned', customerId: 'CLI-001', customerName: 'María García', subscriptionId: 'SUB-NF01', expiryDate: '2025-02-15', assignedAt: '2024-11-15' },
      { id: 'S2', slotNumber: 2, status: 'assigned', customerId: 'CLI-003', customerName: 'Carlos Mendoza', subscriptionId: 'SUB-NF02', expiryDate: '2025-01-20', assignedAt: '2024-10-20' },
      { id: 'S3', slotNumber: 3, status: 'expiring', customerId: 'CLI-005', customerName: 'Andrea Ruiz', subscriptionId: 'SUB-NF03', expiryDate: '2025-01-18', assignedAt: '2024-12-18' },
      { id: 'S4', slotNumber: 4, status: 'overdue', customerId: 'CLI-007', customerName: 'Juan Torres', subscriptionId: 'SUB-NF04', expiryDate: '2025-01-10', assignedAt: '2024-12-10' },
      { id: 'S5', slotNumber: 5, status: 'available' },
    ],
  },
  {
    id: 'INV-C001',
    product: 'ChatGPT Plus',
    type: '1:N',
    status: 'assigned',
    username: 'artstock.chatgpt@proton.me',
    password: 'GPT@Stock2024!',
    provider: 'OpenAI',
    totalSlots: 5,
    usedSlots: 4,
    expiryDate: '2025-12-31',
    createdAt: '2024-02-20',
    slots: [
      { id: 'C1', slotNumber: 1, status: 'assigned', customerId: 'CLI-001', customerName: 'María García', subscriptionId: 'SUB-002', expiryDate: '2025-01-31', assignedAt: '2024-12-01' },
      { id: 'C2', slotNumber: 2, status: 'assigned', customerId: 'CLI-002', customerName: 'TechSoft SAC', subscriptionId: 'SUB-C02', expiryDate: '2025-03-15', assignedAt: '2024-12-15' },
      { id: 'C3', slotNumber: 3, status: 'assigned', customerId: 'CLI-006', customerName: 'Innovate Solutions', subscriptionId: 'SUB-C03', expiryDate: '2025-02-28', assignedAt: '2024-11-28' },
      { id: 'C4', slotNumber: 4, status: 'expiring', customerId: 'CLI-008', customerName: 'Creative Studio', subscriptionId: 'SUB-C04', expiryDate: '2025-01-20', assignedAt: '2024-12-20' },
      { id: 'C5', slotNumber: 5, status: 'available' },
    ],
  },
  {
    id: 'INV-CV001',
    product: 'Canva Pro Team',
    type: '1:N',
    status: 'assigned',
    username: 'artstock.canva@gmail.com',
    password: 'Canva@2024Pro!',
    provider: 'Canva Pty Ltd',
    totalSlots: 10,
    usedSlots: 8,
    expiryDate: '2025-08-20',
    createdAt: '2024-03-10',
    slots: [
      { id: 'CV1', slotNumber: 1, status: 'assigned', customerId: 'CLI-003', customerName: 'Carlos Mendoza', subscriptionId: 'SUB-004', expiryDate: '2025-01-15', assignedAt: '2024-10-15' },
      { id: 'CV2', slotNumber: 2, status: 'assigned', customerId: 'CLI-004', customerName: 'Digital Reseller', subscriptionId: 'SUB-CV02', expiryDate: '2025-04-10', assignedAt: '2025-01-10' },
      { id: 'CV3', slotNumber: 3, status: 'assigned', customerId: 'CLI-005', customerName: 'Andrea Ruiz', subscriptionId: 'SUB-CV03', expiryDate: '2025-03-22', assignedAt: '2024-12-22' },
      { id: 'CV4', slotNumber: 4, status: 'expiring', customerId: 'CLI-008', customerName: 'Creative Studio', subscriptionId: 'SUB-CV04', expiryDate: '2025-01-25', assignedAt: '2024-10-25' },
      { id: 'CV5', slotNumber: 5, status: 'assigned', customerId: 'CLI-002', customerName: 'TechSoft SAC', subscriptionId: 'SUB-CV05', expiryDate: '2025-05-18', assignedAt: '2024-11-18' },
      { id: 'CV6', slotNumber: 6, status: 'assigned', customerId: 'CLI-006', customerName: 'Innovate Solutions', subscriptionId: 'SUB-CV06', expiryDate: '2025-02-05', assignedAt: '2024-11-05' },
      { id: 'CV7', slotNumber: 7, status: 'overdue', customerId: 'CLI-007', customerName: 'Juan Torres', subscriptionId: 'SUB-CV07', expiryDate: '2025-01-02', assignedAt: '2024-10-02' },
      { id: 'CV8', slotNumber: 8, status: 'assigned', customerId: 'CLI-001', customerName: 'María García', subscriptionId: 'SUB-CV08', expiryDate: '2025-06-30', assignedAt: '2024-12-30' },
      { id: 'CV9', slotNumber: 9, status: 'available' },
      { id: 'CV10', slotNumber: 10, status: 'available' },
    ],
  },
  {
    id: 'INV-SP001',
    product: 'Spotify Family',
    type: '1:N',
    status: 'assigned',
    username: 'artstock.spotify@gmail.com',
    password: 'Spotify@Fam2024!',
    provider: 'Spotify AB',
    totalSlots: 6,
    usedSlots: 5,
    expiryDate: '2025-05-20',
    createdAt: '2024-04-15',
    slots: [
      { id: 'SP1', slotNumber: 1, status: 'assigned', customerId: 'CLI-009', customerName: 'Fernando Velásquez', subscriptionId: 'SUB-SP01', expiryDate: '2025-02-20', assignedAt: '2024-11-20' },
      { id: 'SP2', slotNumber: 2, status: 'assigned', customerId: 'CLI-011', customerName: 'Lucía Fernández', subscriptionId: 'SUB-SP02', expiryDate: '2025-03-10', assignedAt: '2024-12-10' },
      { id: 'SP3', slotNumber: 3, status: 'expiring', customerId: 'CLI-013', customerName: 'Roberto Sánchez', subscriptionId: 'SUB-SP03', expiryDate: '2025-01-22', assignedAt: '2024-10-22' },
      { id: 'SP4', slotNumber: 4, status: 'assigned', customerId: 'CLI-019', customerName: 'Carmen Vega', subscriptionId: 'SUB-SP04', expiryDate: '2025-04-05', assignedAt: '2025-01-05' },
      { id: 'SP5', slotNumber: 5, status: 'overdue', customerId: 'CLI-015', customerName: 'Patricia Morales', subscriptionId: 'SUB-SP05', expiryDate: '2025-01-08', assignedAt: '2024-10-08' },
      { id: 'SP6', slotNumber: 6, status: 'available' },
    ],
  },
  {
    id: 'INV-FG001',
    product: 'Figma Organization',
    type: '1:N',
    status: 'assigned',
    username: 'artstock.figma@gmail.com',
    password: 'Figma@Team2024!',
    provider: 'Figma Inc.',
    totalSlots: 8,
    usedSlots: 6,
    expiryDate: '2025-09-30',
    createdAt: '2024-05-20',
    slots: [
      { id: 'FG1', slotNumber: 1, status: 'assigned', customerId: 'CLI-012', customerName: 'Soluciones Digitales', subscriptionId: 'SUB-FG01', expiryDate: '2025-03-15', assignedAt: '2024-12-15' },
      { id: 'FG2', slotNumber: 2, status: 'assigned', customerId: 'CLI-018', customerName: 'DesignPro Agency', subscriptionId: 'SUB-FG02', expiryDate: '2025-04-20', assignedAt: '2025-01-20' },
      { id: 'FG3', slotNumber: 3, status: 'expiring', customerId: 'CLI-022', customerName: 'Estudio Creativo', subscriptionId: 'SUB-FG03', expiryDate: '2025-01-28', assignedAt: '2024-10-28' },
      { id: 'FG4', slotNumber: 4, status: 'assigned', customerId: 'CLI-026', customerName: 'WebMasters Peru', subscriptionId: 'SUB-FG04', expiryDate: '2025-05-10', assignedAt: '2024-11-10' },
      { id: 'FG5', slotNumber: 5, status: 'assigned', customerId: 'CLI-028', customerName: 'MediaGroup LAM', subscriptionId: 'SUB-FG05', expiryDate: '2025-06-25', assignedAt: '2024-12-25' },
      { id: 'FG6', slotNumber: 6, status: 'overdue', customerId: 'CLI-017', customerName: 'Miguel Reyes', subscriptionId: 'SUB-FG06', expiryDate: '2025-01-05', assignedAt: '2024-10-05' },
      { id: 'FG7', slotNumber: 7, status: 'available' },
      { id: 'FG8', slotNumber: 8, status: 'available' },
    ],
  },
];

// 1:1 Individual licenses
export const mockIndividualLicenses: Inventory[] = [
  { id: 'INV-A001', product: 'Adobe Creative Cloud', type: '1:1', status: 'assigned', username: 'license01@artstock.com', password: 'Adobe@2024!', provider: 'Adobe Inc.', expiryDate: '2025-01-15', createdAt: '2024-01-15' },
  { id: 'INV-A002', product: 'Adobe Photoshop', type: '1:1', status: 'assigned', username: 'license02@artstock.com', password: 'Photo@2024!', provider: 'Adobe Inc.', expiryDate: '2025-07-10', createdAt: '2024-07-10' },
  { id: 'INV-A003', product: 'Adobe Premiere Pro', type: '1:1', status: 'available', username: 'license03@artstock.com', password: 'Premiere@2024!', provider: 'Adobe Inc.', expiryDate: '2025-08-20', createdAt: '2024-08-20' },
  { id: 'INV-GR001', product: 'Grammarly Premium', type: '1:1', status: 'assigned', username: 'grammar01@artstock.com', password: 'Gram@2024!', provider: 'Grammarly Inc.', expiryDate: '2025-08-20', createdAt: '2024-08-20' },
  { id: 'INV-FP001', product: 'Freepik Premium', type: '1:1', status: 'blocked', username: 'freepik01@artstock.com', password: 'Freepik@2024!', provider: 'Freepik Company', expiryDate: '2024-12-01', createdAt: '2024-11-01' },
  { id: 'INV-EV001', product: 'Envato Elements', type: '1:1', status: 'assigned', username: 'envato01@artstock.com', password: 'Envato@2024!', provider: 'Envato Pty Ltd', expiryDate: '2025-04-15', createdAt: '2024-04-15' },
  { id: 'INV-NT001', product: 'Notion Pro', type: '1:1', status: 'available', username: 'notion01@artstock.com', password: 'Notion@2024!', provider: 'Notion Labs', expiryDate: '2025-06-30', createdAt: '2024-06-30' },
  { id: 'INV-SL001', product: 'Slack Business', type: '1:1', status: 'assigned', username: 'slack01@artstock.com', password: 'Slack@2024!', provider: 'Salesforce', expiryDate: '2025-03-22', createdAt: '2024-03-22' },
];

// Access history mock data
export const mockAccessHistory: AccessHistory[] = [
  { id: 'AH-001', subscriptionId: 'SUB-001', event: 'assignment', inventoryId: 'INV-A001', change: 'Acceso inicial asignado', executor: 'admin@artstock.com', timestamp: '2024-01-15 10:30:00' },
  { id: 'AH-002', subscriptionId: 'SUB-002', event: 'assignment', inventoryId: 'INV-C001', change: 'Acceso inicial asignado', executor: 'admin@artstock.com', timestamp: '2024-12-01 14:22:00' },
  { id: 'AH-003', subscriptionId: 'SUB-004', event: 'replacement', inventoryId: 'INV-CV002', previousInventoryId: 'INV-CV001', change: 'Reemplazo por caída/bloqueo', reason: 'Cuenta bloqueada por proveedor', executor: 'soporte@artstock.com', timestamp: '2024-11-20 09:15:00', note: 'Se mantuvo credenciales visibles al cliente' },
  { id: 'AH-004', subscriptionId: 'SUB-008', event: 'suspension', inventoryId: 'INV-FP001', change: 'Acceso deshabilitado', reason: 'Mora > 3 días', executor: 'sistema', timestamp: '2024-12-05 00:00:00' },
  { id: 'AH-005', subscriptionId: 'SUB-001', event: 'update', inventoryId: 'INV-A001', change: 'Credenciales actualizadas', executor: 'admin@artstock.com', timestamp: '2024-06-10 16:45:00', note: 'Cambio de contraseña por política de seguridad' },
  { id: 'AH-006', subscriptionId: 'SUB-003', event: 'assignment', inventoryId: 'INV-M001', change: 'Invitación enviada al correo del cliente', executor: 'admin@artstock.com', timestamp: '2024-06-01 11:00:00' },
  { id: 'AH-007', subscriptionId: 'SUB-005', event: 'reactivation', inventoryId: 'INV-NF001', change: 'Acceso reactivado', executor: 'admin@artstock.com', timestamp: '2024-12-15 08:30:00', note: 'Pago recibido' },
  { id: 'AH-008', subscriptionId: 'SUB-010', event: 'reassignment', inventoryId: 'INV-CC002', previousInventoryId: 'INV-CC001', change: 'Cambio total de cuenta', executor: 'soporte@artstock.com', timestamp: '2024-12-20 14:00:00', note: 'Solicitud del cliente' },
];

// Dashboard KPI data
export const dashboardKPIs = {
  activeSubscriptions: mockSubscriptions.filter(s => s.status === 'active').length,
  expiringSubscriptions: mockSubscriptions.filter(s => s.status === 'expiring').length,
  overdueSubscriptions: mockSubscriptions.filter(s => s.status === 'overdue').length,
  suspendedSubscriptions: mockSubscriptions.filter(s => s.status === 'suspended').length,
  cancelledSubscriptions: 2,
  pendingInvoices: mockInvoices.filter(i => i.status === 'pending').length,
  overdueInvoices: mockInvoices.filter(i => i.status === 'overdue').length,
  totalToCollect: { USD: 2876.00, PEN: 1450.00 },
  collectedThisMonth: { USD: 5850.00, PEN: 2200.00 },
  projectedRevenue: { USD: 7200.00, PEN: 2500.00 },
  activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
  exCustomers: mockCustomers.filter(c => c.status === 'inactive').length,
  totalLicenses: { individual: 120, shared: 45, teams: 12, profile: 8, keys: 200 },
};
