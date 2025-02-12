import React from "react";

const SidebarLeft = () => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Online People</h2>
      {/* Add list of online users here */}
      <ul>
        <li className="mb-2">User 1</li>
        <li className="mb-2">User 2</li>
        {/* Add more users as needed */}
      </ul>
    </div>
  );
};

export default SidebarLeft;
