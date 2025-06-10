import React from "react";
import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-3 text-danger">404</h1>
        <h4 className="text-muted">
          This page is no longer available, or you don’t have access to view it.
        </h4>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline-secondary"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
