
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import CreatorModal from "../components/CreatorModal";
import { Creator } from "../types/Creator";
import { Menu, X } from "lucide-react";

const Index = () => {
	const [activeGenre, setActiveGenre] = useState("All Creators");
	const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleGenreChange = (genre: string) => {
		setActiveGenre(genre);
		setIsMobileMenuOpen(false);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex h-screen">
				{/* Desktop Sidebar */}
				<div className="hidden md:block">
					<Sidebar
						activeGenre={activeGenre}
						onGenreChange={handleGenreChange}
						isCollapsed={isSidebarCollapsed}
						onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
					/>
				</div>

				{/* Mobile Sidebar Overlay */}
				{isMobileMenuOpen && (
					<>
						<div
							className="fixed inset-0 bg-black/50 z-40 md:hidden"
							onClick={() => setIsMobileMenuOpen(false)}
						/>
						<div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 md:hidden">
							<div className="p-4 border-b border-gray-200 flex items-center justify-between">
								<div>
									<img
										src="https://res.cloudinary.com/ds7bybp6g/image/upload/v1750859567/creatordream_nlvcgd.png"
										alt="logo"
										className="w-32 h-8 object-contain"
									/>
								</div>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 rounded-lg hover:bg-gray-100"
								>
									<X size={20} />
								</button>
							</div>
							<nav className="flex-1 p-2 space-y-1">
								{[
									{ name: "All Creators", icon: "Users" },
									{ name: "AI Creators", icon: "Lightbulb" },
									{ name: "Video Editing", icon: "Video" },
									{ name: "Tech Product", icon: "Laptop" },
									{ name: "Business", icon: "Building2" },
									{ name: "Lifestyle", icon: "Heart" },
								].map((genre) => {
									const isActive = activeGenre === genre.name;

									return (
										<button
											key={genre.name}
											onClick={() => handleGenreChange(genre.name)}
											className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
												isActive
													? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
													: "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
											}`}
										>
											<span className="font-medium">{genre.name}</span>
										</button>
									);
								})}
							</nav>
						</div>
					</>
				)}

				{/* Main content */}
				<div
					className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
						isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
					}`}
				>
					{/* Mobile header */}
					<div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
						<h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							CreatorHub
						</h1>
						<button
							onClick={() => setIsMobileMenuOpen(true)}
							className="p-2 rounded-lg hover:bg-gray-100"
						>
							<Menu size={24} />
						</button>
					</div>

					<Dashboard
						activeGenre={activeGenre}
						onCreatorClick={setSelectedCreator}
					/>
				</div>
			</div>

			{selectedCreator && (
				<CreatorModal
					creator={selectedCreator}
					onClose={() => setSelectedCreator(null)}
				/>
			)}
		</div>
	);
};

export default Index;
