"use client"; // Add this line to specify that this component is a client component

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Next.js hook for navigation
import Image from "next/image";
import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline"; // Icons for toggle, profile, and notifications

const AdminDashboard = () => {
  interface Post {
    id: number;
    title: string;
    content: string;
    image?: string; // Optional field for the image URL
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    username: "", // Add username field here
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // State to capture username
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State for sidebar toggle
  const [totalUsers, setTotalUsers] = useState<number>(0); // State for total users
  const [totalPosts, setTotalPosts] = useState<number>(0); // State for total posts

  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if not logged in
    }

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername); // Set username in state
    setFormData((prev) => ({ ...prev, username: storedUsername || "" })); // Set default username in formData

    fetchAnalytics(); // Fetch analytics data on load

    // Track page load analytics
    trackPageLoad();
  }, [router]);

  const trackPageLoad = async () => {
    console.log("Page loaded");
    // You can implement fetch or other methods to log this information
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not available");
      }

      const response = await fetch("/api/admin/post/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched posts and counts:", data);

      // Set posts and counts
      setPosts(data.posts);
      setTotalUsers(data.userCount);
      setTotalPosts(data.postCount);
    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to fetch posts: " + error.message);
      } else {
        setError("Failed to fetch posts: An unknown error occurred.");
      }
      console.error(error);
    }
  };

  // Use useEffect to call fetchPosts only when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      const response = await fetch("/api/admin/post/", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setTotalUsers(data.totalUsers);
      setTotalPosts(data.totalPosts);
    } catch (error) {
      setError("Failed to fetch analytics.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    formDataToSend.append("username", formData.username); // Append username to the form data

    try {
      const token = localStorage.getItem("token"); // Retrieve token
      const response = selectedPost
        ? await fetch(`/api/admin/post/${selectedPost.id}/`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
            body: formDataToSend,
          })
        : await fetch("/api/admin/post/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
            body: formDataToSend,
          });

      if (!response.ok) {
        throw new Error("Failed to save post.");
      }

      alert(
        selectedPost
          ? "Post updated successfully!"
          : "Post created successfully!"
      );
      setFormData({
        title: "",
        content: "",
        image: null,
        username: username || "",
      }); // Reset form data
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      setError("Failed to save post.");
    }
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: null,
      username: username || "",
    }); // Reset location on edit
  };

  const handleDeletePost = async (id: number) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      const response = await fetch(`/api/admin/post/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete post.");
      }
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      setError("Failed to delete post.");
    }
  };

  // Logout function to remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex">
      {/* Sidebar */}
      <nav
        className={`w-64 bg-gray-900 p-4 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          <li>
            <Link
              href="/admin/posts"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <Bars3Icon className="h-5 w-5 mr-2" /> Manage Posts
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <UserIcon className="h-5 w-5 mr-2" /> Manage Users
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-4 w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* Toggle Button for Sidebar */}
        <button
          onClick={toggleSidebar}
          className="md:hidden mb-4 p-2 bg-gray-700 rounded"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-white" />
        </button>

        {/* Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Welcome, {username}</h2>{" "}
          {/* Display the username */}
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Posts</h3>
            <p className="text-3xl font-bold">{totalPosts}</p>
          </div>
        </div>

        {/* Post Form */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedPost ? "Edit Post" : "Create New Post"}
          </h3>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <textarea
                name="content"
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium">
                Image (optional)
              </label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleImageChange}
                className="mt-1 p-2 w-full bg-gray-800 border border-gray-600 rounded focus:ring focus:ring-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {selectedPost ? "Update Post" : "Create Post"}
            </button>
          </form>
        </div>

        {/* Post List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Posts</h3>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold">{post.title}</h4>
                  <p>{post.content}</p>

                  <Image
                    src={post.image || "/default-image.jpg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="rounded-md mb-2"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
