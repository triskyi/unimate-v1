import React, { useEffect, useState, useCallback } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel as StreamChannel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEYY as string;

interface User {
  id: string; // Ensure this is a string
  username: string;
  isOnline: boolean;
  university: string;
  profileImage?: string; // Optional field for user image
}

const App = () => {
  const router = useRouter();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [channel, setChannel] = useState<StreamChat.Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>("Both");

  // Fetch chat token from your API
  const fetchChatToken = async (): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    const response = await fetch("/api/token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.chatToken;
  };

  // Fetch all users from your API and check online status via StreamChat
  const fetchAllUsers = useCallback(async () => {
    if (!client || !currentUserId) return;
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersList: User[] = await response.json();
      console.log("Fetched users:", usersList);

      const registeredUsers = await Promise.all(
        usersList.map(async (user) => {
          try {
            const userExists = await client.queryUsers({
              id: user.id.toString(),
            });

            if (userExists?.users && userExists.users.length > 0) {
              return { ...user, isOnline: userExists.users[0].online };
            } else {
              console.warn(`User not found in StreamChat: ${user.username}`);
              return null;
            }
          } catch (error) {
            console.error(`Error querying user ${user.id}:`, error);
            return null;
          }
        })
      );

      const validUsers = registeredUsers.filter(
        (user): user is User => user !== null
      );
      setAllUsers(validUsers);
      filterUsers(validUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [client, currentUserId]);

  const filterUsers = (users: User[]) => {
    if (selectedCampus === "Both") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) => user.university === selectedCampus
      );
      setFilteredUsers(filtered);
    }
  };

  const initializeChat = async (userToken: string, userId: string) => {
    if (client) {
      console.warn("Chat client is already initialized");
      return;
    }

    const chatClient = StreamChat.getInstance(apiKey);
    await chatClient.connectUser(
      {
        id: userId,
        username: localStorage.getItem("username") || undefined,
        profileImage: localStorage.getItem("profileImage") || undefined,
      },
      userToken
    );

    setClient(chatClient);
    setCurrentUserId(userId);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchChatToken()
        .then((chatToken) =>
          initializeChat(chatToken, localStorage.getItem("userId")!)
        )
        .catch((error) => console.error("Error initializing chat:", error));
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    filterUsers(allUsers);
  }, [selectedCampus, allUsers]);

  const startChatWithUser = async (userId: string) => {
    if (!client || currentUserId === userId) return;

    const directChannel = client.channel("messaging", {
      members: [currentUserId!.toString(), userId.toString()],
    });
    await directChannel.watch();
    setChannel(directChannel);
  };

  const getOtherUser = (
    members: Record<
      string,
      { user: { userId: string; username?: string; profileImage?: string } }
    >,
    currentUserId: string,
    filteredUsers: User[]
  ): { username: string; image?: string } => {
    const otherUserId = Object.values(members).find(
      (member) => member.user.userId !== currentUserId
    )?.user.userId;

    console.log("Other User ID:", otherUserId);

    if (otherUserId) {
      const otherUser = filteredUsers.find((user) => user.id === otherUserId);
      console.log("Found Other User:", otherUser);
      if (otherUser) {
        return {
          username: otherUser.username || "User not found",
          image: otherUser.profileImage || undefined,
        };
      } else {
        console.warn("Other user not found in the filteredUsers list");
      }
    } else {
      console.warn("No other user ID found, returning default values");
    }
    return { username: "User", image: undefined };
  };

  const handleBackToDashboard = () => {
    router.push("/Dashboard");
  };

  // If still loading, show a loader.
  if (loading) {
    return <div className="text-center text-xl p-4">Loading chat...</div>;
  }

  // Sidebar component markup
  const renderSidebar = () => (
    <div className="bg-gray-800 text-white p-4 rounded-lg h-full overflow-y-auto shadow-lg">
      <button
        className="flex items-center mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        onClick={handleBackToDashboard}
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      {/* Campus Selection */}
      <h3 className="text-xl font-semibold mb-4">Select Campus</h3>
      <div className="mb-6 flex space-x-2">
        {["Kampala Campus", "Main Campus", "Both"].map((campus) => (
          <button
            key={campus}
            className={`px-4 py-2 w-full rounded-lg border ${
              selectedCampus === campus
                ? "bg-green-500 border-green-600"
                : "bg-blue-600 border-blue-700 hover:bg-blue-700"
            } transition duration-200`}
            onClick={() => {
              setSelectedCampus(campus);
              filterUsers(allUsers);
            }}
          >
            {campus}
          </button>
        ))}
      </div>

      {/* User List */}
      <h3 className="text-xl font-semibold mb-4">All Users</h3>
      <ul className="space-y-2 mb-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user.id}
              className="cursor-pointer p-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 flex justify-between items-center transition duration-200"
              onClick={() => startChatWithUser(user.id)}
            >
              <div className="flex items-center">
                <Image
                  src={user.profileImage || "/avata.jpg"}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                <span>{user.username || "Unknown User"}</span>
              </div>
              <span
                className={`text-sm ${
                  user.isOnline ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.isOnline ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <XCircleIcon className="w-5 h-5" />
                )}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No users found</li>
        )}
      </ul>
    </div>
  );

  // Chat area markup
  const renderChatArea = () => (
    <div className="h-full p-4 flex flex-col">
      {channel && client ? (
        <Chat client={client} theme="messaging light">
          <StreamChannel channel={channel}>
            <Window>
              <ChannelHeader
                title={
                  getOtherUser(
                    channel.state.members,
                    currentUserId!,
                    filteredUsers
                  ).username
                }
              />
              <MessageList />
              <MessageInput />
              <Thread />
            </Window>
          </StreamChannel>
        </Chat>
      ) : (
        <div className="text-center text-xl p-4">Select a user to chat</div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:flex container mx-auto p-4 h-screen">
        <div className="w-1/4">{renderSidebar()}</div>
        <div className="w-3/4">{renderChatArea()}</div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden container mx-auto p-4 h-screen">
        {channel ? (
          <div className="flex flex-col h-full">
            {/* Back button to return to user list */}
            <div className="mb-4">
              <button
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                onClick={() => setChannel(null)}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Users
              </button>
            </div>
            {renderChatArea()}
          </div>
        ) : (
          renderSidebar()
        )}
      </div>
    </>
  );
};

export default App;
