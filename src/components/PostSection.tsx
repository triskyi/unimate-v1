import React from "react";

const PostSection = () => {
  return (
    <div className="flex-1 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        rows={4}
        placeholder="What's on your mind?"
      ></textarea>
      <div className="flex justify-between mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Post
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Cancel
        </button>
      </div>
      {/* Add functionality for like, comment, share here */}
    </div>
  );
};

export default PostSection;
