import { Link, useNavigate } from "react-router-dom";
import { ButtonLink } from "../Button";

interface Props {
  isOpen: boolean;
  isAuthed: boolean;
}

export function MobileMenu({ isOpen, isAuthed }: Props) {
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className={`navbar__mobile-menu${isOpen ? " navbar__mobile-menu--active" : ""}`}>
      <form className="navbar__search-bar" onSubmit={handleSearch}>
        <input
          type="search"
          name="q"
          placeholder="Search Vinylog..."
          aria-label="Search Vinylog"
          className="navbar__search-input"
        />
      </form>

      <ul className="navbar__menu">
        {isAuthed ? (
          <>
            <li>
              <Link to="/" className="navbar__link">Home</Link>
            </li>
            <li>
              <Link to="/albums" className="navbar__link">Albums</Link>
            </li>
            <li>
              <Link to="/lists" className="navbar__link">Lists</Link>
            </li>
            <li>
              <Link to="/profile" className="navbar__link">Profile</Link>
            </li>
            <li>
              <Link to="/recommend" className="navbar__link navbar__link--primary">AI Recommend</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" className="navbar__link">Home</Link>
            </li>
            <li>
              <Link to="/albums" className="navbar__link">Albums</Link>
            </li>
          </>
        )}
      </ul>

      {isAuthed ? (
        <Link to="/reviews/new" className="navbar__link navbar__link--primary">
          Add review
        </Link>
      ) : (
        <div className="navbar__auth">
          <Link to="/login" className="navbar__link">Log In</Link>
          <ButtonLink to="/signup" variant="primary" size="sm">Sign Up</ButtonLink>
        </div>
      )}
    </div>
  );
}
