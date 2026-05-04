interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function BurgerButton({ isOpen, onToggle }: Props) {
  return (
    <button
      className={`navbar__burger${isOpen ? " navbar__burger--active" : ""}`}
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span className="navbar__burger-line" />
      <span className="navbar__burger-line" />
      <span className="navbar__burger-line" />
    </button>
  );
}
