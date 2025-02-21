import React, { useEffect, useState } from "react";
import Image from "next/image";

// Define the User interface
interface User {
  id: string;
  username: string;
  profileImage?: string; // Optional field
  isOnline?: boolean;
}

const App = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Example token handling
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Call fetchUsers on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter only online users and get the first 3
  const onlineUsers = allUsers.filter((user) => user.isOnline).slice(0, 3);

  return (
    <div className="p-4 bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl text-white font-semibold mb-4">Active Users</h2>
      <div className="flex flex-col space-y-4">
        {onlineUsers.length === 0 ? (
          <p>No users are currently online</p> // Display message if no users are online
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-4 border rounded-lg shadow hover:shadow-md transition-shadow w-full"
            >
              <div className="relative flex-shrink-0">
                <Image
                  src={user.profileImage || "/avatar.png"} // Use default image if none exists
                  alt={user.username}
                  width={48} // Set fixed width for profile image
                  height={48} // Set fixed height for profile image
                  className="rounded-full object-cover" // Maintain circular shape and cover
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user.username}</h3>
                {user.isOnline ? (
                  <p className="text-sm text-green-500">Online</p>
                ) : (
                  <p className="text-sm text-gray-500">Offline</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
