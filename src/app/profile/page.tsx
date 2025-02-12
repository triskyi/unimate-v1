// pages/dashboard/profile.js
import React from "react";
import Image from "next/image";

interface User {
  profileImage?: string;
  username: string;
  university: string;
  gender: string;
  nationality: string;
  phone: string;
}

const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="min-h-screen bg-[#1d2327] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-gray-400">Welcome to your profile page!</p>
        </div>

        {/* Profile Content */}
        <div className="bg-[#2a2f33] rounded-lg shadow-lg p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <Image
              src={user.profileImage || "/default-profile.png"}
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Username
            </label>
            <p className="p-3 bg-[#1d2327] rounded-lg border border-gray-500">
              {user.username}
            </p>
          </div>

          {/* University */}
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              University
            </label>
            <p className="p-3 bg-[#1d2327] rounded-lg border border-gray-500">
              {user.university}
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Gender
            </label>
            <p className="p-3 bg-[#1d2327] rounded-lg border border-gray-500">
              {user.gender}
            </p>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Nationality
            </label>
            <p className="p-3 bg-[#1d2327] rounded-lg border border-gray-500">
              {user.nationality}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <p className="p-3 bg-[#1d2327] rounded-lg border border-gray-500">
              {user.phone}
            </p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 text-center">
          <button className="py-3 px-6 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
