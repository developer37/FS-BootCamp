import { NavLink } from "react-router-dom";
import booksIcon from "../assets/books.png";

function Navigation() {
  // NavLink automatically applies an active class for the current route.
  return (
    <header className="site-header">
      <div className="site-header-top">
        <div className="site-header-icon-frame">
          <img
            src={booksIcon}
            alt="Library icon"
            className="site-header-icon"
          />
        </div>

        <div className="site-header-copy">
          <h1>Personal Library</h1>
          <p>Track what you read, what is next, and what you love.</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="main-nav">
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </nav>
    </header>
  );
}

export default Navigation;
