import React from "react";

const SidebarRight = () => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Links</h2>
      {/* Add additional links here */}
      <ul>
        <li className="mb-2">Link 1</li>
        <li className="mb-2">Link 2</li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default SidebarRight;
