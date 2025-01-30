# Slide State Management

Manages the state of slides using `outlineID` as the key identifier for values. `useEffect` and function calls to modify and monitor changes efficiently.

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
