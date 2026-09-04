import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          User Registration
        </Link>

        <Link to="/add-user" className="add-form-btn">
          <span>+</span>
          Add Form
        </Link>
      </div>
    </header>
  );
}

export default Navbar;