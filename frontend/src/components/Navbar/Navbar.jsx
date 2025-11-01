import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Menu, Video } from 'lucide-react';
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
	const { user, isAuthenticated, getCurrentUser } = useAuth();
	const { setSearchQuery } = useSearch();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Debounce search query updates
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchQuery(localSearchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [localSearchQuery, setSearchQuery]);

	const handleSearch = (e) => {
		e.preventDefault();
		console.log('Searching for:', localSearchQuery);
		setSearchQuery(localSearchQuery);
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

	return (
		<>
			<Sidebar isOpen={isSidebarOpen} />
			<header className='w-full sticky top-0 z-50'>
				{/* Navbar */}
				< nav className="bg-blue-600 shadow-lg " >
					<div className="mx-auto px-4 pb-2 md:pb-0 h-fit">
						<div className="flex items-center justify-between h-16">
							{/* Left Section - Menu & Logo */}
							<div className="flex items-center space-x-4">
								<button
									onClick={() => setIsSidebarOpen(!isSidebarOpen)}
									className="p-2 hover:bg-blue-700 rounded-full transition"
								>
									<Menu className="w-6 h-6 text-white" />
								</button>

								<Link to={"/home"} className="flex items-center space-x-2 cursor-pointer group">
									<div className="bg-white rounded-lg p-1.5">
										<Video className="w-6 h-6 text-blue-600" />
									</div>
									<span className="text-white font-bold text-xl tracking-tight group-hover:text-blue-100 transition">
										CopyTube
									</span>
								</Link>
							</div>

							{/* Center Section - Search Bar */}
							{!isMobile && 
							(<div className="flex-1 max-w-2xl mx-8">
								<div className="relative">
									<div className="flex items-center">
										<input
											type="text"
											value={localSearchQuery}
											onChange={(e) => setLocalSearchQuery(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
											placeholder="Search videos..."
											className="w-full px-4 py-2.5 pr-12 text-white rounded-l-full border-2 border-blue-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-white"
										/>
										<button
											onClick={handleSearch}
											className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 rounded-r-full border-2 border-blue-700 transition flex items-center justify-center"
										>
											<Search className="w-5 h-5 text-white" />
										</button>
									</div>
								</div>
							</div>)}

							{/* Right Section - Create & Profile */}
							<div className="flex items-center space-x-4">
								{/* Create Button */}
								<button className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-full transition group">
									<Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
									{!isMobile && <span className="text-white font-medium">Create</span>}
								</button>

								{/* Profile Icon */}
								<div className="relative">
									<button
										onClick={() => setIsProfileOpen(!isProfileOpen)}
										className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition ring-2 ring-blue-400 overflow-hidden"
									>
										{isAuthenticated && user ? (
											<img
												src={user.avatar}
												alt="Profile"
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="w-5 h-5 text-white" />
										)}

									</button>

									{/* Profile Dropdown */}
									{isProfileOpen && user && (
										<div className="absolute right-0 top-25 md:top-11 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
											<div className="px-4 py-3 border-b border-gray-200">
												<p className="text-sm font-semibold text-gray-800">{user.username}</p>
												<p className="text-xs text-gray-500">{user.email}</p>
											</div>
											<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition">
												Your Channel
											</button>
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

						{isMobile && 
							(<div className=" w-full  ">
								<div className="relative">
									<div className="flex items-center">
										<input
											type="text"
											value={localSearchQuery}
											onChange={(e) => setLocalSearchQuery(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
											placeholder="Search videos..."
											className="w-full px-4 py-2.5 pr-12 text-white rounded-l-full border-2 border-blue-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-white"
										/>
										<button
											onClick={handleSearch}
											className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 rounded-r-full border-2 border-blue-700 transition flex items-center justify-center"
										>
											<Search className="w-5 h-5 text-white" />
										</button>
									</div>
								</div>
							</div>)}
					</div>
				</nav >
			</header>
		</>
	);
}

export default Navbar