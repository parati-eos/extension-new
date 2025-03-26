export type DisplayMode =
  | 'slides'
  | 'newContent'
  | 'slideNarrative'
  | 'customBuilder'
  | 'quick'
  | 'narrative'
  | 'Points'
  | 'Timeline'
  | 'Images'
  | 'Table'
  | 'People'
  | 'Graphs'
  | 'Statistics'
  | 'SlideNarrative'
  | 'Cover'
  | 'TextandImage'
  | 'Contact';

export interface RefinePPTProps {
  displayMode: DisplayMode;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
}

export interface HeadingProps {
  handleShare: () => void;
  handleDownload: () => void;
  pptName: string;
  isLoading: boolean;
  userPlan: string;
  openPricingModal: () => void;
  exportPaid: boolean;
  buttonsDisabled: boolean;
}

export interface Outlines {
  title: string;
  type: DisplayMode;
  _id: string;
  outlineID: string;
}

export interface SidebarProps {
  subscriptionId: string;
  newSlideGenerated: { [key: string]: string };
  selectedOutlineID: string;
  onOutlineSelect: (option: string) => void;
  selectedOutline: string;
  fetchedOutlines: Outlines[];
  documentID: string;
  authToken: string;
  fetchOutlines: () => Promise<void>;
  isLoading: boolean;
  isDisabled: boolean;
  userPlan: string | null; // Allow null for flexibility
  monthlyPlanAmount: number;
  yearlyPlanAmount: number;
  currency: string;
  yearlyPlanId: string;
  monthlyPlanId: string;
  orgId: string;
  isNewSlideLoading: {
    [key: string]: boolean;
  };
}

export interface Outline {
  title: string;
  type: DisplayMode;
  _id: string;
  outlineID: string;
}
