import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import { 
    IoMdAnalytics, 
    IoMdSettings, 
    IoMdHelpCircle, 
    IoMdTrendingUp,
    IoMdCalendar,
    IoMdNotifications
} from 'react-icons/io';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    // New menu items for enhanced functionality
    const additionalMenuItems = [
        {
            label: "Analytics",
            path: "/analytics",
            icon: IoMdAnalytics,
            description: "Advanced insights & reports"
        },
        {
            label: "Goals",
            path: "/goals",
            icon: IoMdTrendingUp,
            description: "Financial goals & tracking"
        },
        {
            label: "Calendar",
            path: "/calendar",
            icon: IoMdCalendar,
            description: "Bill reminders & events"
        },
        {
            label: "Notifications",
            path: "/notifications",
            icon: IoMdNotifications,
            description: "Smart alerts & updates"
        },
        {
            label: "Settings",
            path: "/settings",
            icon: IoMdSettings,
            description: "Preferences & account"
        },
        {
            label: "Help",
            path: "/help",
            icon: IoMdHelpCircle,
            description: "Support & tutorials"
        }
    ];

    return (
        <div className="w-72 h-[calc(100vh-61px)] bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-6 sticky top-[61px] z-20 shadow-lg">
            {/* User Profile Section */}
            <div className="flex flex-col items-center justify-center gap-4 mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl || ""}
                        alt="Profile Image"
                        className="w-16 h-16 bg-slate-400 rounded-full ring-4 ring-white shadow-lg"
                    />) : <CharAvatar
                        fullName={user?.fullName}
                        width="w-16"
                        height="h-16"
                        style="text-lg"
                    />} 

                <div className="text-center">
                    <h5 className="text-gray-900 font-semibold leading-6">
                        {user?.fullName || ""}
                    </h5>
                    <p className="text-xs text-gray-500 mt-1">Financial Tracker</p>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-2 mb-6">
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Main
                </h6>
                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-sm font-medium transition-all duration-200 ${
                            activeMenu == item.label 
                                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg" 
                                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        } py-3 px-4 rounded-xl mb-1`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-lg" />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Additional Features */}
            <div className="space-y-2 mb-6">
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Features
                </h6>
                {additionalMenuItems.slice(0, 4).map((item, index) => (
                    <button
                        key={`additional_${index}`}
                        className={`w-full flex items-center gap-4 text-sm font-medium transition-all duration-200 ${
                            activeMenu == item.label 
                                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg" 
                                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        } py-3 px-4 rounded-xl mb-1 group relative`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-lg" />
                        <span>{item.label}</span>
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.description}
                        </div>
                    </button>
                ))}
            </div>

            {/* Settings & Help */}
            <div className="space-y-2">
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Support
                </h6>
                {additionalMenuItems.slice(4).map((item, index) => (
                    <button
                        key={`support_${index}`}
                        className={`w-full flex items-center gap-4 text-sm font-medium transition-all duration-200 ${
                            activeMenu == item.label 
                                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg" 
                                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                        } py-3 px-4 rounded-xl mb-1 group relative`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-lg" />
                        <span>{item.label}</span>
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.description}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SideMenu;