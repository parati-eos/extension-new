// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Organization Profile
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface Color {
  P100: string
  P75_S25: string
  P50_S50: string
  P25_S75: string
  S100: string
  F_P100: string
  F_P75_S25: string
  F_P50_S50: string
  F_P25_S75: string
  F_S100: string
  SCL: string
  SCD: string
}

export interface OrganizationData {
  _id: string
  orgId: string
  userId: string
  companyDescription: string
  tagline: string
  color: Color
  companyName: string
  industry: string
  sector: string
  logo: string
  websiteLink: string
  contactEmail: string
  contactPhone: string
  linkedinLink: string
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Presentation View
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface HeadingProps {
  handleShare: () => void
  handleDownload: () => void
  pptName: string
}

export interface Outlines {
  title: string
  type: string
  _id: string
}

export interface SidebarProps {
  onOutlineSelect: (option: string) => void
  selectedOutline: string
  fetchedOutlines: Outlines[]
  documentID: string
  authToken: string
  fetchOutlines: () => Promise<void>
}

export interface Outline {
  title: string
  type: string
  _id: string
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Presentation Share
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface GooglePresentationProps {
  formId: string
}
