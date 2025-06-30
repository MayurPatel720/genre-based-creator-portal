
import React from "react";
import {
	Users,
	Video,
	Lightbulb,
	Laptop,
	Heart,
	Building2,
	ChevronLeft,
	ChevronRight,
	MessageCircleMore,
} from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

interface SidebarProps {
	activeGenre: string;
	onGenreChange: (genre: string) => void;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

const genres = [
	{ name: "All Creators", icon: Users },
	{ name: "Video Editing/AI", icon: Video },
	{ name: "Tips & Tricks/AI", icon: Lightbulb },
	{ name: "Tech Products", icon: Laptop },
	{ name: "Lifestyle", icon: Heart },
	{ name: "Business", icon: Building2 },
];

const Sidebar: React.FC<SidebarProps> = ({
	activeGenre,
	onGenreChange,
	isCollapsed,
	onToggleCollapse,
}) => {
	return (
		<div
			className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r-2 border-aureolin transition-all duration-300 z-30 ${
				isCollapsed ? "w-16" : "w-64"
			} flex flex-col`}
		>
			{/* Header */}
			<div className="p-4 border-b-2 border-aureolin flex items-center justify-between bg-gradient-to-r from-aureolin/10 to-safety-orange/10">
				{!isCollapsed && (
					<div className="w-full">
						<img
							src="https://res.cloudinary.com/ds7bybp6g/image/upload/v1750859567/creatordream_nlvcgd.png"
							alt="logo"
							className="max-w-full h-auto"
						/>
					</div>
				)}
				<button
					onClick={onToggleCollapse}
					className="p-2 rounded-xl hover:bg-aureolin/20 transition-all duration-200 border-2 border-transparent hover:border-aureolin"
				>
					{isCollapsed ? (
						<ChevronRight size={20} className="text-purpleureus" />
					) : (
						<ChevronLeft size={20} className="text-purpleureus" />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-3 space-y-2">
				{genres.map((genre) => {
					const Icon = genre.icon;
					const isActive = activeGenre === genre.name;

					return (
						<button
							key={genre.name}
							onClick={() => onGenreChange(genre.name)}
							className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative group font-medium ${
								isActive
									? "gradient-aureolin-orange text-black shadow-lg transform scale-105 border-2 border-safety-orange"
									: "text-gray-800 hover:bg-gradient-to-r hover:from-aureolin/20 hover:to-safety-orange/20 hover:text-purpleureus border-2 border-transparent hover:border-aureolin/50"
							}`}
							title={isCollapsed ? genre.name : undefined}
						>
							<Icon size={20} className="flex-shrink-0" />
							{!isCollapsed && (
								<span className="font-quinn font-semibold">{genre.name}</span>
							)}

							{/* Tooltip */}
							{isCollapsed && (
								<div className="absolute left-full ml-3 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-aureolin">
									{genre.name}
								</div>
							)}
						</button>
					);
				})}
			</nav>

			{/* WhatsApp Button at Bottom */}
			<div className="p-4 border-t-2 border-aureolin mt-auto bg-gradient-to-r from-aureolin/5 to-safety-orange/5">
				{isCollapsed ? (
					<div className="flex justify-center">
						<MessageCircleMore className="text-purpleureus" size={24} />
					</div>
				) : (
					<WhatsAppButton variant="sidebar" />
				)}
			</div>
		</div>
	);
};

export default Sidebar;
