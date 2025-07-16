
import React, { useState, useMemo } from "react";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../ui/pagination";

interface CreatorListProps {
	onEdit: (creator: Creator) => void;
}

const ITEMS_PER_PAGE = 10;

const CreatorList: React.FC<CreatorListProps> = ({ onEdit }) => {
	const { creators, deleteCreator, loading, error } = useCreators();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("all");

	// Get unique genres for filter
	const genres = useMemo(() => {
		const uniqueGenres = [...new Set(creators.map(creator => creator.genre))];
		return uniqueGenres.filter(Boolean).sort();
	}, [creators]);

	// Filter and search creators
	const filteredCreators = useMemo(() => {
		if (!Array.isArray(creators)) return [];
		
		return creators.filter(creator => {
			const matchesSearch = !searchTerm || 
				creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				creator.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
				creator.genre.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesGenre = selectedGenre === "all" || 
				creator.genre.toLowerCase() === selectedGenre.toLowerCase();
			
			return matchesSearch && matchesGenre;
		});
	}, [creators, searchTerm, selectedGenre]);

	// Pagination
	const totalPages = Math.ceil(filteredCreators.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentCreators = filteredCreators.slice(startIndex, endIndex);

	// Reset to page 1 when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedGenre]);

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this creator?")) {
			try {
				await deleteCreator(id);
			} catch (err) {
				console.error("Failed to delete creator:", err);
			}
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
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
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-gray-500" />
					<Select value={selectedGenre} onValueChange={setSelectedGenre}>
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
				Showing {startIndex + 1}-{Math.min(endIndex, filteredCreators.length)} of {filteredCreators.length} creators
				{searchTerm && ` for "${searchTerm}"`}
				{selectedGenre !== "all" && ` in ${selectedGenre}`}
			</div>

			{loading ? (
				<p>Loading creators...</p>
			) : currentCreators.length === 0 ? (
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
				<>
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
							{currentCreators.map((creator) => (
								<TableRow key={creator._id}>
									<TableCell>{creator.name}</TableCell>
									<TableCell>{creator.genre}</TableCell>
									<TableCell>{creator.platform}</TableCell>
									<TableCell>
										{creator.details.analytics.followers.toLocaleString()}
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											className="mr-2"
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious 
											onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
											className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
										/>
									</PaginationItem>
									
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<PaginationItem key={page}>
											<PaginationLink
												onClick={() => handlePageChange(page)}
												isActive={page === currentPage}
												className="cursor-pointer"
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}
									
									<PaginationItem>
										<PaginationNext 
											onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
											className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default CreatorList;
