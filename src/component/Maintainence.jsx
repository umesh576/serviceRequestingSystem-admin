import React from "react";

const Maintainence = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Feature Under Maintenance
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Were performing scheduled maintenance to improve this feature. Please
          check back later. Thank you for your patience!
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-2/3 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Estimated completion: 1 week
          </p>
        </div>

        {/* Contact */}
        <div className="border-t pt-6 border-gray-200">
          <p className="text-gray-500">
            Need immediate assistance?{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintainence;
