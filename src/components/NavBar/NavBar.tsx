import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ButtonLink } from "../Button";

function AuthedNavLinks() {
  return (
    <>
      <li>
        <Link to="/" className="navbar__link">
          Home
        </Link>
      </li>
      <li>
        <Link to="/albums" className="navbar__link">
          Albums
        </Link>
      </li>
      <li>
        <Link to="/lists" className="navbar__link">
          Lists
        </Link>
      </li>
      <li>
        <Link to="/profile" className="navbar__link">
          Profile
        </Link>
      </li>
      <li>
        <Link to="/recommend" className="navbar__link navbar__link--primary">
          AI Recommend
        </Link>
      </li>
    </>
  );
}

function AnonNavLinks() {
  return (
    <>
      <li>
        <Link to="/" className="navbar__link">
          Home
        </Link>
      </li>
      <li>
        <Link to="/albums" className="navbar__link">
          Albums
        </Link>
      </li>
    </>
  );
}

function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      className={`navbar__search-bar${className ? ` ${className}` : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        name="q"
        placeholder="Search Vinylog..."
        aria-label="Search Vinylog"
        className="navbar__search-input"
      />
    </form>
  );
}

export default function NavBar() {
  const { status } = useAuth();
  const isAuthed = status === "authed";

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Vinylog
        </Link>

        <ul className="navbar__menu navbar__menu--desktop">
          {isAuthed ? <AuthedNavLinks /> : <AnonNavLinks />}
        </ul>

        <SearchBar className="navbar__search-bar--desktop" />

        {isAuthed ? (
          <Link
            to="/reviews/new"
            className="navbar__link navbar__link--primary"
          >
            Add review
          </Link>
        ) : (
          <div className="navbar__auth navbar__auth--desktop">
            <Link to="/login" className="navbar__link">
              Log In
            </Link>
            <ButtonLink to="/signup" variant="primary" size="sm">
              Sign Up
            </ButtonLink>
          </div>
        )}
      </div>
    </nav>
  );
}
