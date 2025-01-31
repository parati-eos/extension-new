# Code Explaination and Understanding

Comments are used above every functions and logic in the code in each components to explain what does the code below do.

# Code / File Structure

- Auth folder contains the login/signup component

- History folder contains HistoryContainer file which is the main component and HistoryThumbnail file which is the iframe/
  thumbnail display component for the history items.

- Landing-Page folder contains the landing page components. Landing page pricing section has its own API call in its own file to get pricing plans data.

- Onboarding folder contains a shared folder for the next and back buttons, onboarding-sections folder for the 5 onboarding forms component, a Sidebar file which is the progress bar with the section names and OnboardingContainer file which is the main container which triggers all the actions and API calls.

- Organization Profile folder contains the view and edit organization pages components.

- Payment folder contains PaymentGateway file which is used to open razorpay modal for individual exports, other files are socket and socket provider code for the subscription flow.

- pitchZynthShare folder contains the Pitch Deck share page code (older version)

- Presentation-Type folder contains the select presentation type page component

- Presentation-View folder contains the shared components, individual components and the sidebars, modals and loaders in the presentation view page along with the main container file ViewPresentation.tsx which has all the functions, API calls, socket connection for the functionalities and flow.

- Share-Presentation contains the new share page code with the sidebar and outline modal in mobile

- Shared folder contains the Navbar file, Pricing Modal and Protected Routes

- Pages folder contains all the pages code in which components are imported

- Redux folder contains the redux flow and logic to pass user plan data to different components and pages

- Types folder contains the interfaces and types of all the data and components

- Utils folder contains the data file which has the loader messages, industrySector file for mapping industry sector data, remove bg for logo, sectionMapping and aws file upload code.

# API Calls and Submit / Generate Buttons

- useEffects are used to trigger GET requests to fetch data in every components wherever its needed and socket connections.

- handleSubmit, handleGenerate, generateSlide, refineText, etc certain functions are used to trigger POST / PATCH request API calls for data submission.

# User plan and pricing plans data flow

- Select Presentation Type, History, View and Edit Org Profile and Presentation View pages trigger GET request API calls to fetch user plan data from fetch org profile get req and pricing plans data from the plans get request.

- User plan is passed through the components and pages through redux after being saved when APIs are triggered and successfull response is recorded.

- Pricing plans data is passed to the pricing modal component through props after being saved when APIs are triggered and successfull response is recorded.

# Presentation View State Management

- All the states which are key value pair objects use `outlineID` as the key identifier for corresponding values depending on the state. `useEffect` and function calls are used to modify and monitor changes.

## Table of Contents

- [Interface Definitions](#interface-definitions)
- [Constants & External Dependencies](#constants--external-dependencies)
- [State Management Using React Hooks](#state-management-using-react-hooks)

## Interface Definitions

### `SlideState`

Defines the structure for managing the state of an individual slide. It includes:

- `isLoading`: Indicates whether the slide is still loading.
- `isNoGeneratedSlide`: Flags if no slide was generated.
- `genSlideID`: Stores the generated slide ID.
- `retryCount`: Keeps track of the number of retries for generating a slide.
- `lastUpdated`: Timestamp of the last update to the slide.

### `SlideStates`

A structure where each slide (key) is associated with its respective `SlideState` object.

### `createInitialSlideState`

Function to initialize the default state of a slide.

## Constants & External Dependencies

- `useSearchParams()`: Retrieves query parameters from the URL.
- `SOCKET_URL`: Loads the WebSocket URL from environment variables.
- `authToken`: Retrieves authentication token from session storage.
- `orgId`: Retrieves the organization ID from session storage.
- `userPlan`: Fetches the user’s subscription plan from Redux state.

## State Management Using React Hooks

The following states are managed using React hooks:

### Document & Presentation Information

- `documentID`: Stores the document ID.
- `pptName`: Stores the (PPT) name.
- `presentationID`: Stores the presentation ID.
- `isDocumentIDLoading`: Indicates if the document ID is being loaded.
- `isPptNameLoading`: Indicates if the PPT name is being loaded.

### Slide Management

- `currentSlide`: Stores the currently active slide number.
- `currentOutline`: Stores the outline text of the current slide.
- `currentOutlineID`: Stores the ID of the current outline.
- `outlineType`: Stores the type of slide/outline.
- `outlines`: Stores an array of all outlines.
- `displayModes`: Stores the display modes for different slides.
- `slideRefs`: A reference array to store DOM elements of slides.
- `totalSlides`: Stores the total number of slides versions of an individual outline.
- `slidesId`: Stores an array of slide IDs.
- `currentSlideIndex`: Stores the index of the currently active slide version of an outline.

### Subscription & Pricing

- `isPricingModalOpen`: Determines whether the pricing modal is open.
- `pricingModalHeading`: Stores the heading of the pricing modal.
- `monthlyPlan`: Stores details of the monthly subscription plan.
- `yearlyPlan`: Stores details of the yearly subscription plan.
- `currency`: Stores the selected currency.

### Scroll & UI Management

- `scrollContainerRef`: A reference to the scroll container.
- `prevTotalSlides`: Stores the previous value of `totalSlides`.
- `prevSlideIndex`: Stores the previous value of `currentSlideIndex`.
- `isExportPaid`: Indicates if the export feature is paid.
- `countdown`: Stores the countdown timer value.
- `showCountdown`: Controls the visibility of the countdown timer.
- `featureDisabled`: Determines if certain features are disabled based on the user plan.
- `newVersionBackDisabled`: Controls whether going back to a previous version is disabled.

### Slide State & Tracking

- `slidesArray`: Stores `outlineID`s as keys and an array of `slideID`s as values.
- `isNewSlideLoading`: Tracks the loading state of new slide versions.
- `initialSlides`: Stores the initial number of slide versions for outlines before generating new version.
- `slideStates`: Stores the state of all slides.
- `finalizedSlides`: Stores finalized slides.
- `newSlideGenerated`: Stores details of newly generated slides.

### Subscription & Redux

- `subId`: Stores a subscription ID.
- `dispatch`: A Redux dispatch function for triggering actions.

### Loading & Refs

- `displayBoxLoading`: Controls whether the whole display box is loading.
- `slidesArrayRef`: A reference to `slidesArray` for maintaining consistency across re-renders.
- `newSlideLoadingRef`: A reference to `isNewSlideLoading` for keeping track of slide load status.
- `slideStatesRef`: A reference to `slideStates` for managing slide-related updates.

### Message & Loader Tracking

- `currentMessageIndex`: Stores the index of the current message being displayed.
- `currentSlideLoaderMessageIndex`: Stores the index of the current slide loader message.
