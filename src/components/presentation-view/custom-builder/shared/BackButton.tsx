interface BackProps {
  onClick: () => void
}

export const BackButton: React.FC<BackProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline"
    >
      Back
    </button>
  )
}
