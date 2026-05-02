import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Vinylog</span>
          <p className="site-footer__tagline">Spin records. Share stories.</p>
        </div>

        <nav className="site-footer__nav">
          <div className="site-footer__col">
            <p className="site-footer__col-heading">Explore</p>
            <ul>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
              <li>
                <Link to="/lists">Lists</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__col-heading">Legal</p>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__col-heading">Help</p>
            <ul>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="container site-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Vinylog. All rights reserved.</p>
      </div>
    </footer>
  );
}
