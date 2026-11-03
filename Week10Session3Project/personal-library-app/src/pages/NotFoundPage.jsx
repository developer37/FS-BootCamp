import { Link } from "react-router-dom";

function NotFoundPage() {
  // Catch-all route target for unknown URLs.
  return (
    <section className="panel">
      <h2>404 - Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/library">Back to library</Link>
    </section>
  );
}

export default NotFoundPage;
