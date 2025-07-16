
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
	const { paginationData, genres, fetchCreators, deleteCreator, loading, error } = useCreators();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("all");

	// Fetch creators when page, search term, or genre changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchCreators(currentPage, ITEMS_PER_PAGE, selectedGenre);
			} catch (err) {
				console.error("Failed to fetch creators:", err);
			}
		};
		fetchData();
	}, [currentPage, selectedGenre, fetchCreators]);

	// Reset to page 1 when filters change
	useEffect(() => {
		if (currentPage !== 1) {
			setCurrentPage(1);
		}
	}, [searchTerm, selectedGenre]);

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this creator?")) {
			try {
				await deleteCreator(id);
				// Refresh the current page after deletion
				await fetchCreators(currentPage, ITEMS_PER_PAGE, selectedGenre);
			} catch (err) {
				console.error("Failed to delete creator:", err);
			}
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Filter creators by search term (client-side filtering)
	const filteredCreators = paginationData.creators.filter(creator => {
		if (!searchTerm) return true;
		
		return creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			creator.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
			creator.genre.toLowerCase().includes(searchTerm.toLowerCase());
	});

	// Calculate pagination range
	const generatePageNumbers = () => {
		const pages = [];
		const totalPages = paginationData.totalPages;
		const current = currentPage;
		
		// Always show first page
		if (totalPages > 0) pages.push(1);
		
		// Show ellipsis if needed
		if (current > 3) pages.push("...");
		
		// Show pages around current
		for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
			if (!pages.includes(i)) pages.push(i);
		}
		
		// Show ellipsis if needed
		if (current < totalPages - 2) pages.push("...");
		
		// Always show last page
		if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
		
		return pages;
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
				Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredCreators.length)} of {filteredCreators.length} creators
				{searchTerm && ` for "${searchTerm}"`}
				{selectedGenre !== "all" && ` in ${selectedGenre}`}
				{paginationData.totalPages > 1 && ` (Page ${currentPage} of ${paginationData.totalPages})`}
			</div>

			{loading ? (
				<div className="flex justify-center items-center py-8">
					<p>Loading creators...</p>
				</div>
			) : filteredCreators.length === 0 ? (
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
							{filteredCreators.map((creator) => (
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

					{/* Pagination */}
					{paginationData.totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious 
											onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
											className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
										/>
									</PaginationItem>
									
									{generatePageNumbers().map((page, index) => (
										<PaginationItem key={index}>
											{page === "..." ? (
												<span className="px-3 py-2">...</span>
											) : (
												<PaginationLink
													onClick={() => handlePageChange(page as number)}
													isActive={page === currentPage}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											)}
										</PaginationItem>
									))}
									
									<PaginationItem>
										<PaginationNext 
											onClick={() => handlePageChange(Math.min(paginationData.totalPages, currentPage + 1))}
											className={currentPage === paginationData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
