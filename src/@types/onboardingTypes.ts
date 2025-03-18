export interface CompanyNameFormProps {
  onContinue: (data: { companyName: string }) => void
  initialData: string
  isNextLoading: boolean
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
  isNextLoading: boolean
}

export interface IndustryFormProps {
  onContinue: (data: { sector: string; industry: string }) => void
  onBack: () => void
  initialData: { sector: string; industry: string }
  isNextLoading: boolean
}

export interface LogoFormProps {
  onContinue: (data: { logo: string }) => void
  onBack: () => void
  initialData: string | null
  isNextLoading: boolean
}

export interface WebsiteLinkFormProps {
  onContinue: (data: { websiteLink: string }) => void
  onBack: () => void
  initialData: string
  isNextLoading: boolean
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
