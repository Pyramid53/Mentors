export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  type: 'Bulk Carrier' | 'Container Ship' | 'Crude Oil Tanker' | 'Chemical Tanker' | 'General Cargo' | 'LNG Carrier' | 'Tug / Supply';
  flag: string;
  flagCode: string;
  status: 'Underway' | 'At Anchor' | 'Moored' | 'Awaiting Convoy' | 'Discharging';
  statusAr?: string;
  port: string;
  portAr?: string;
  eta: string;
  speed: string;
  draught: string;
  dwt: string;
  destination: string;
  destinationAr?: string;
  convoyDirection: 'Northbound' | 'Southbound' | 'Anchorage';
  convoyDirectionAr?: string;
  provisionStatus: 'Provisions Confirmed & Loaded' | 'Order in Preparation' | 'RFQ Pending' | 'Delivered' | 'Scheduled for Transit';
  provisionStatusAr?: string;
  assignedBoat?: string;
  assignedBoatAr?: string;
  coords: { x: number; y: number }; // Relative percentage coordinates for the interactive Suez Canal map
}

export interface ServiceDetail {
  id: string;
  title: string;
  titleAr?: string;
  shortDesc: string;
  shortDescAr?: string;
  longDesc: string;
  longDescAr?: string;
  image: string;
  iconName: string;
  badge: string;
  badgeAr?: string;
  features: string[];
  featuresAr?: string[];
  subcategories: string[];
  subcategoriesAr?: string[];
  standards: string[];
  standardsAr?: string[];
  sampleItems: { code: string; name: string; nameAr?: string; unit: string; unitAr?: string }[];
}

export interface PortLocation {
  id: string;
  name: string;
  nameAr?: string;
  coordinates: string;
  type: 'Terminal Port' | 'Canal Entrance' | 'Anchorage Zone' | 'Industrial Hub';
  typeAr?: string;
  waterDepth: string;
  waterDepthAr?: string;
  servicesAvailable: string[];
  servicesAvailableAr?: string[];
  avgLaunchTime: string;
  avgLaunchTimeAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
}

export interface QuoteFormData {
  vesselName: string;
  imoNumber: string;
  vesselType?: string;
  portOfCall: string;
  etaDate: string;
  etaTime: string;
  services: string[];
  fileName?: string;
  fileSize?: string;
  selectedItems: string[];
  crewNationalities: string;
  priority: 'Standard (60 Min)' | 'Urgent (< 30 Min)' | 'Anchorage Delivery';
  additionalNotes: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
}

export type RFQStatus = 'New' | 'In Review' | 'Quoted (60m)' | 'Order Confirmed' | 'Dispatched' | 'Delivered' | 'Archived';

export interface AdminQuoteRequest extends QuoteFormData {
  id: string;
  submittedAt: string;
  status: RFQStatus;
  assignedOfficer?: string;
  quotedAmountUSD?: number;
  dispatchLaunchBoat?: string;
  adminNotes?: string;
  lastUpdated?: string;
}

export interface ContactMessage {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  inquiryType: string;
  portOfCall?: string;
  message: string;
}

export type ContactStatus = 'New' | 'Replied' | 'Follow-up' | 'Closed';

export interface AdminContactInquiry extends ContactMessage {
  id: string;
  submittedAt: string;
  status: ContactStatus;
  assignedTo?: string;
  adminNotes?: string;
  lastUpdated?: string;
}

export type UserRole = 'admin' | 'client';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  title?: string;
  phone?: string;
  port?: string;
  avatarInitials?: string;
  createdAt: string;
}
