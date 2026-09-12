export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  type: 'Bulk Carrier' | 'Container Ship' | 'Crude Oil Tanker' | 'Chemical Tanker' | 'General Cargo' | 'LNG Carrier' | 'Tug / Supply';
  flag: string;
  flagCode: string;
  status: 'Underway' | 'At Anchor' | 'Moored' | 'Awaiting Convoy' | 'Discharging';
  port: string;
  eta: string;
  speed: string;
  draught: string;
  dwt: string;
  destination: string;
  convoyDirection: 'Northbound' | 'Southbound' | 'Anchorage';
  provisionStatus: 'Provisions Confirmed & Loaded' | 'Order in Preparation' | 'RFQ Pending' | 'Delivered' | 'Scheduled for Transit';
  assignedBoat?: string;
  coords: { x: number; y: number }; // Relative percentage coordinates for the interactive Suez Canal map
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  iconName: string;
  badge: string;
  features: string[];
  subcategories: string[];
  standards: string[];
  sampleItems: { code: string; name: string; unit: string }[];
}

export interface PortLocation {
  id: string;
  name: string;
  coordinates: string;
  type: 'Terminal Port' | 'Canal Entrance' | 'Anchorage Zone' | 'Industrial Hub';
  waterDepth: string;
  servicesAvailable: string[];
  avgLaunchTime: string;
  description: string;
  image: string;
}

export interface QuoteFormData {
  vesselName: string;
  imoNumber: string;
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

export interface ContactMessage {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}
