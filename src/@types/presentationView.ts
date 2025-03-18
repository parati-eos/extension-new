export type DisplayMode =
  | 'slides'
  | 'newContent'
  | 'slideNarrative'
  | 'customBuilder'
  | 'Points'
  | 'Timeline'
  | 'Images'
  | 'Table'
  | 'People'
  | 'Graphs'
  | 'Statistics'
  | 'SlideNarrative'
  | 'Cover'
  | 'Contact'

export interface HeadingProps {
  handleShare: () => void
  handleDownload: () => void
  pptName: string
  isLoading: boolean
  userPlan: string
  openPricingModal: () => void
  exportPaid: boolean
  buttonsDisabled: boolean
}

export interface Outlines {
  title: string
  type: string
  _id: string
  outlineID: string
}

export interface SidebarProps {
  subscriptionId: string
  newSlideGenerated: { [key: string]: string }
  selectedOutlineID: string
  onOutlineSelect: (option: string) => void
  selectedOutline: string
  fetchedOutlines: Outlines[]
  documentID: string
  authToken: string
  fetchOutlines: () => Promise<void>
  isLoading: boolean
  isDisabled: boolean
  userPlan: string | null // Update this to allow null
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
  yearlyPlanId: string
  monthlyPlanId: string
  orgId: string
  isNewSlideLoading: {
    [key: string]: boolean
  }
}

export interface Outline {
  title: string
  type: string
  _id: string
  outlineID: string
}
