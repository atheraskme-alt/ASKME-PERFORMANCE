
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Megaphone,
  BarChart,
  LogOut,
  Menu,
  X,
  Calendar,
  Award,
  Globe, // New icon import
  MessageSquare, // New icon import
  Mail, // New icon import
} from "lucide-react";

const commonNav = [
  { title: "Dashboard", url: "Dashboard", icon: LayoutDashboard },
  { title: "Updates", url: "Updates", icon: Megaphone },
];

const adminNav = [
  { title: "Manage Employees", url: "ManageEmployees", icon: Users },
  { title: "Daily Attendance", url: "ManageAttendance", icon: Calendar },
  { title: "Log Performance", url: "ManagePerformance", icon: ClipboardList },
  { title: "Incentives & Bonus", url: "ManageIncentives", icon: Award },
  { title: "Send Notification", url: "SendNotification", icon: Mail }, // New item for admin
  { title: "Post Update", url: "ManageUpdates", icon: Megaphone },
];

const employeeNav = [
  { title: "My Performance", url: "MyPerformance", icon: BarChart },
  { title: "My Attendance", url: "MyAttendance", icon: Calendar },
  { title: "My Incentives", url: "MyIncentives", icon: Award },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        User.login();
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  const navItems = user?.role === 'admin' 
    ? [...commonNav.filter(item => item.title !== 'Updates'), ...adminNav] 
    : [...commonNav.filter(item => item.url !== 'AdminDashboard'), ...employeeNav];
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Ask Me Solutions</h2>
          <p className="text-blue-700">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-blue-600">
        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" /> {/* Changed icon from Users to Globe */}
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Ask Me Solutions</h2>
            <p className="text-blue-100 text-xs">Employee Portal</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={createPageUrl(item.url)}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === createPageUrl(item.url)
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      {/* New Support Section */}
      <div className="px-4 py-2 border-t">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Support</h3>
        <a href="https://wa.me/919103877377" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Contact HR</span>
        </a>
        <a href="https://www.askmesolutions.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <Globe className="w-5 h-5" />
            <span className="font-medium">Company Website</span>
        </a>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=2563eb&color=fff`} alt={user.full_name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800 truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.role === 'admin' ? 'HR Admin' : 'Employee'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" /> {/* Changed icon from Users to Globe */}
            </div>
            <span className="font-bold text-blue-900">Ask Me Solutions</span>
          </div>
          <div className="w-6"></div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          {React.cloneElement(children, { user })}
        </div>
      </main>
    </div>
  );
}
