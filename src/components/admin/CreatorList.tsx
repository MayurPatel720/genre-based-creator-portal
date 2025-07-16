
import React, { useState, useEffect } from "react";
import { Trash2, Edit, Search, Filter } from "lucide-react";
import { useCreators } from "@/hooks/useCreators";
import { Creator } from "@/types/Creator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface CreatorListProps {
	onEdit: (creator: Creator) => void;
}

const CreatorList: React.FC<CreatorListProps> = ({ onEdit }) => {
	const { creators, genres, fetchCreators, deleteCreator, loading, error } = useCreators();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("all");

	// Fetch creators when search term or genre changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchCreators(searchTerm, selectedGenre === "all" ? undefined : selectedGenre);
			} catch (err) {
				console.error("Failed to fetch creators:", err);
			}
		};
		fetchData();
	}, [searchTerm, selectedGenre, fetchCreators]);

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this creator?")) {
			try {
				await deleteCreator(id);
				// Refresh the list after deletion
				await fetchCreators(searchTerm, selectedGenre === "all" ? undefined : selectedGenre);
			} catch (err) {
				console.error("Failed to delete creator:", err);
			}
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleGenreChange = (value: string) => {
		setSelectedGenre(value);
	};

	return (
		<div className="p-6">
			{error && (
				<div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
			)}

			{/* Search and Filter Controls */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search creators by name, platform, or genre..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="pl-10"
					/>
				</div>
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-gray-500" />
					<Select value={selectedGenre} onValueChange={handleGenreChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by genre" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Genres</SelectItem>
							{genres.map((genre) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Results Summary */}
			<div className="mb-4 text-sm text-gray-600">
				Showing {creators.length} creators
				{searchTerm && ` for "${searchTerm}"`}
				{selectedGenre !== "all" && ` in ${selectedGenre}`}
			</div>

			{loading ? (
				<div className="flex justify-center items-center py-8">
					<p>Loading creators...</p>
				</div>
			) : creators.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-500 mb-2">No creators found.</p>
					{(searchTerm || selectedGenre !== "all") && (
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setSearchTerm("")}
							>
								Clear search
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setSelectedGenre("all")}
							>
								Clear filters
							</Button>
						</div>
					)}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Genre</TableHead>
							<TableHead>Platform</TableHead>
							<TableHead>Followers</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{creators.map((creator) => (
							<TableRow key={creator._id}>
								<TableCell>{creator.name}</TableCell>
								<TableCell>{creator.genre}</TableCell>
								<TableCell>{creator.platform}</TableCell>
								<TableCell>
									{creator.details.analytics.followers.toLocaleString()}
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => onEdit(creator)}
										>
											<Edit className="w-4 h-4 mr-1" />
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(creator._id!)}
										>
											<Trash2 className="w-4 h-4 mr-1" />
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default CreatorList;
