// Set initial loading state
setSlideStates((prev) => {
  const currentState = prev[currentOutline]
  const hasExistingSlides = hasSlidesForOutline(currentOutline)

  // Don't set loading if we already have slides
  if (hasExistingSlides) {
    return {
      ...prev,
      [currentOutline]: {
        ...currentState,
        isLoading: false,
        isNoGeneratedSlide: false,
        lastUpdated: Date.now(),
      },
    }
  }

  // Only set loading if we need new slides
  const shouldBeLoading =
    isNewSlideLoading[currentOutline] ||
    (!currentState?.genSlideID && !hasExistingSlides)

  return {
    ...prev,
    [currentOutline]: {
      ...currentState,
      isLoading: shouldBeLoading,
      isNoGeneratedSlide: false,
      lastUpdated: Date.now(),
    },
  }
})

// Function to check if slides exist for an outline
const hasSlidesForOutline = (outlineTitle: string) => {
  return slidesArray[outlineTitle]?.length > 0
}
