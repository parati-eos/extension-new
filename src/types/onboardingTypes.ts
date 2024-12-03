export interface CompanyNameFormProps {
  onContinue: (data: { companyName: string }) => void
  initialData: string
}

export interface ContactDetailsFormProps {
  onContinue: (data: {
    contactEmail: string
    contactPhone: string
    linkedinLink: string
  }) => void
  onBack: () => void
  initialData: {
    contactEmail: string
    contactPhone: string
    linkedinLink: string
  }
}

export interface IndustryFormProps {
  onContinue: (data: { sector: string; industry: string }) => void
  onBack: () => void
  initialData: { sector: string; industry: string }
}

export interface LogoFormProps {
  onContinue: (data: { logo: string }) => void
  onBack: () => void
  initialData: string | null
}

export interface WebsiteLinkFormProps {
  onContinue: (data: { websiteLink: string }) => void
  onBack: () => void
  initialData: string
}

export interface FormData {
  companyName: string
  contactEmail: string
  contactPhone: string
  linkedin: string
  sector: string
  industry: string
  websiteLink: string
  logo: string | null
}

export interface Section {
  id: number
  title: string
  subheading: string
  icon: React.ReactElement
}
