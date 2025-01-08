interface BackProps {
  onClick: () => void
  disabled?: boolean
}

export const BackButton: React.FC<BackProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="hidden lg:block disabled:cursor-not-allowed text-sm border border-[#8A8B8C] px-3 py-2 rounded-lg text-[#5D5F61] active:scale-95 transition transform duration-300 hover:underline"
    >
      Back
    </button>
  )
}
