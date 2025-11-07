import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Menu, Video, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import { useSearch } from '../context/SearchContext'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/apiService';
import Sidebar from './Sidebar';
import { useMediaQuery } from "@react-hook/media-query";

const Navbar = () => {
	const [localSearchQuery, setLocalSearchQuery] = useState('');
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const { user, isAuthenticated, getCurrentUser } = useAuth();
	const { setSearchQuery } = useSearch();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchQuery(localSearchQuery);
		navigate("/home");
		setIsSearchExpanded(false);
	};

	const handleSignOut = async () => {
		try {
			await api.get("/users/logout");
			await getCurrentUser();
			navigate("/auth");
		} catch (error) {
			console.log("Something went wrong while signing out :: ", error);
		}
	}

	const toggleSearch = () => {
		setIsSearchExpanded(!isSearchExpanded);
		if (isSearchExpanded) {
			setLocalSearchQuery('');
		}
	};

	return (
		<>
			<Sidebar isOpen={isSidebarOpen} />
			<header className='w-full sticky top-0 z-50'>
				{/* Navbar */}
				<nav className="bg-blue-600 shadow-lg">
					<div className="mx-auto px-2 h-fit md:px-6">
						<div className="flex items-center justify-between h-16">
							{/* Left Section - Menu & Logo */}
							<div className={`flex items-center space-x-2 sm:space-x-4 transition-all duration-300 ${isSearchExpanded ? 'opacity-0 md:opacity-100 scale-95 md:scale-100 hidden' : 'opacity-100 scale-100 block'
										}`}>
								<button
									onClick={() => setIsSidebarOpen(!isSidebarOpen)}
									className="p-2 hover:bg-blue-700 rounded-full transition cursor-pointer"
								>
									<Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
								</button>

								<Link
									to={"/home"}
									className={`flex items-center space-x-2 cursor-pointer group transition-all duration-300 ${isSearchExpanded ? 'opacity-0 md:opacity-100 scale-95 md:scale-100 hidden' : 'opacity-100 scale-100 block'
										}`}
								>
									<div className="bg-white rounded-lg p-1.5">
										<Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
									</div>
									<span className="text-white font-bold text-xl tracking-tight group-hover:text-blue-100 transition whitespace-nowrap">
										CopyTube
									</span>
								</Link>
							</div>

							{/* Center Section - Search Bar (Desktop) */}
							{!isMobile && (
								<div className="flex-1 max-w-2xl mx-8">
									<div className="relative">
										<div className="flex items-center">
											<input
												type="text"
												value={localSearchQuery}
												onChange={(e) => setLocalSearchQuery(e.target.value)}
												onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
												placeholder="Search videos..."
												className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 bg-white rounded-l-full border-2 border-blue-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
											/>
											<button
												onClick={handleSearch}
												className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 rounded-r-full border-2 border-blue-700 transition flex items-center justify-center"
											>
												<Search className="w-5 h-5 text-white" />
											</button>
										</div>
									</div>
								</div>
							)}

							{/* Mobile Expanded Search */}
							{isMobile && (
								<div className={`flex-1 mx-2 overflow-hidden transition-all duration-300 ease-in-out ${isSearchExpanded ? 'max-w-full opacity-100' : 'max-w-0 opacity-0 mx-0'
									}`}>
									{isSearchExpanded && (
										<div className="relative w-full">
											<div className="flex items-center">
												<input
													type="text"
													value={localSearchQuery}
													onChange={(e) => setLocalSearchQuery(e.target.value)}
													onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
													placeholder="Search..."
													className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white rounded-l-full border-2 border-blue-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-sm"
													autoFocus
												/>
												<button
													onClick={handleSearch}
													className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-r-full border-2 border-blue-700 transition flex items-center justify-center"
												>
													<Search className="w-5 h-5 text-white" />
												</button>
											</div>
										</div>
									)}
								</div>
							)}

							{/* Right Section - Search Icon (Mobile), Create & Profile */}
							<div className="flex items-center space-x-2 sm:space-x-4">
								{/* Mobile Search Toggle */}
								{isMobile && (
									<button
										onClick={toggleSearch}
										className="p-2 hover:bg-blue-700 rounded-full transition"
									>
										{isSearchExpanded ? (
											<X className="w-5 h-5 text-white" />
										) : (
											<Search className="w-5 h-5 text-white" />
										)}
									</button>
								)}

								{/* Create Button */}
								<Link
									to={"/upload"}
									className={`flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-full transition group ${isMobile && isSearchExpanded ? 'opacity-0 scale-95 pointer-events-none hidden' : 'opacity-100 scale-100 block'
										} transition-all duration-300`}
								>
									<Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
									{!isMobile && <span className="text-white font-medium">Create</span>}
								</Link>

								{/* Profile Icon */}
								<div className={`relative ${isMobile && isSearchExpanded ? 'opacity-0 scale-95 pointer-events-none hidden' : 'opacity-100 scale-100 block'} transition-all duration-300 `}>
									<button
										onClick={() => setIsProfileOpen(!isProfileOpen)}
										className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition ring-2 ring-blue-400 overflow-hidden cursor-pointer"
									>
										{isAuthenticated && user ? (
											<img
												src={user.avatar}
												alt="Profile"
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
										)}
									</button>

									{/* Profile Dropdown */}
									{isProfileOpen && user && (
										<div className="absolute right-0 mt-4 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
											<div className="px-4 py-3 border-b border-gray-200">
												<p className="text-sm font-semibold text-gray-800">{user.username}</p>
												<p className="text-xs text-gray-500">{user.email}</p>
											</div>
											<Link to={`/channel/${user.username}`}>
												<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition">
													Your Channel
												</button>
											</Link>
											<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition">
												Settings
											</button>
											<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition">
												Help
											</button>
											<div className="border-t border-gray-200 my-1"></div>
											<button onClick={() => handleSignOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
												Sign Out
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</>
	);
}

export default Navbar