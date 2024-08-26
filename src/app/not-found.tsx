// app/not-found.tsx

import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <div className="not-found-label">Page Not Found</div>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button className="not-found-button">
          <Link href="/" className="not-found-link">
            <span className="not-found-button-background"></span>
            <span className="not-found-button-text">Go Home</span>
          </Link>
        </button>
      </div>
      <div className="not-found-decorative-element not-found-decorative-element-1"></div>
      <div className="not-found-decorative-element not-found-decorative-element-2"></div>
    </div>
  );
};

export default NotFoundPage;
