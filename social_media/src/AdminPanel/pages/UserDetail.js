"use client"
import { useState, useEffect } from "react"
import { User, Heart, BookOpen, MessageCircle, Activity, ArrowLeft, Eye } from "lucide-react"
import LikeRecord from "./LikeRecord"
import StoryRecord from "./StoryRecord"
import CommentRecord from "./CommentRecord"
import ActivityRecord from "./ActivityRecord"
import Skeleton from "./Skeleton"

const UserDetail = ({ selectedUser, onViewUser, onBackToUsers }) => {
  console.log(selectedUser)
  const [activeTab, setActiveTab] = useState("Like Record")
  const [showLikeRecord, setShowLikeRecord] = useState(true)
  const [profileImageLoading, setProfileImageLoading] = useState(true)

  useEffect(() => {
    const imageTimer = setTimeout(() => {
      setProfileImageLoading(false)
    }, 800)
    return () => clearTimeout(imageTimer)
  }, [])

  const tabs = [
    { name: "Like Record", icon: Heart },
    { name: "Story Record", icon: BookOpen },
    { name: "Comment Record", icon: MessageCircle },
  ]

  const stats = [
    { label: "Total Likes", value: "2,847" },
    { label: "Total Comments", value: "156" },
    { label: "Total Following", value: "1,293" },
    { label: "Total Followers", value: "4,296" },
  ]

  const handleTabClick = (tabName) => {
    setActiveTab(tabName)
    if (tabName === "Like Record") {
      setShowLikeRecord(true)
    }
  }

  const handleBackFromLikeRecord = () => {
    setShowLikeRecord(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              {profileImageLoading ? (
                <Skeleton variant="circle" className="w-24 h-24 mb-3" />
              ) : selectedUser?.profileImage ? (
                <img 
                  src={selectedUser.profileImage || selectedUser?.name?.charAt(0) } 
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg mb-3"
                  onError={(e) => {
                    // If image fails to load, show first letter instead
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mb-3">
                  <span className="text-3xl font-bold text-white">
                    {selectedUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              {selectedUser?.profileImage && (
                <div 
                  className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mb-3" 
                  style={{ display: 'none' }}
                >
                  <span className="text-3xl font-bold text-white">
                    {selectedUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <button
                onClick={() => onBackToUsers && onBackToUsers()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Users</span>
              </button>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{selectedUser?.name || 'Unknown User'}</h1>
                  <p className="text-gray-600 text-sm sm:text-base">{selectedUser?.username || '@unknown'}</p>
                </div>
                <button
                  onClick={() => onViewUser && onViewUser()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B65FCF] transition-colors mx-auto lg:mx-0"
                >
                  <Eye className="mr-2" size={16} />
                  View User
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Tab Bar - Grid Layout */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-1 p-2">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.name
                return (
                  <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 font-medium text-xs border-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-[#B65FCF] border-[#B65FCF] bg-purple-50"
                        : "text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-center leading-tight">
                      {tab.name.split(' ').map((word, i) => (
                        <span key={i} className="block">
                          {word}
                        </span>
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Desktop Tab Bar */}
          <div className="hidden md:flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.name
              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "text-[#B65FCF] border-[#B65FCF] bg-purple-50"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        {activeTab === "Like Record" ? (
          <LikeRecord onBack={handleBackFromLikeRecord}  selectedUser={selectedUser} />
        ) : activeTab === "Story Record" ? (
          <StoryRecord />
        ) : activeTab === "Comment Record" ? (
          <CommentRecord selectedUser={selectedUser} />
        ) : activeTab === "Activity Record" ? (
          <ActivityRecord />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Content for {activeTab} will be displayed here
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetail
