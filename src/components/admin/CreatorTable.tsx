
import React, { useState, useMemo } from "react";
import { Trash2, Edit, Search, Filter } from "lucide-react";
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

interface CreatorTableProps {
	creators: Creator[];
	onEdit: (creator: Creator) => void;
	onDelete: (id: string) => void;
	loading: boolean;
}

const ITEMS_PER_PAGE = 10;

const GENRE_OPTIONS = [
	"All",
	"AI Creators",
	"Video Editing",
	"Tech Product",
	"Tips & Tricks",
	"Business",
	"Lifestyle",
];

const PLATFORM_OPTIONS = [
	"All",
	"Instagram",
	"YouTube",
	"TikTok",
	"Twitter",
	"Other",
];

const CreatorTable: React.FC<CreatorTableProps> = ({
	creators,
	onEdit,
	onDelete,
	loading,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [genreFilter, setGenreFilter] = useState("All");
	const [platformFilter, setPlatformFilter] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredCreators = useMemo(() => {
		return creators.filter((creator) => {
			const matchesSearch = creator.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesGenre = genreFilter === "All" || creator.genre === genreFilter;
			const matchesPlatform =
				platformFilter === "All" || creator.platform === platformFilter;

			return matchesSearch && matchesGenre && matchesPlatform;
		});
	}, [creators, searchTerm, genreFilter, platformFilter]);

	const totalPages = Math.ceil(filteredCreators.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedCreators = filteredCreators.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleClearFilters = () => {
		setSearchTerm("");
		setGenreFilter("All");
		setPlatformFilter("All");
		setCurrentPage(1);
	};

	const hasActiveFilters =
		searchTerm || genreFilter !== "All" || platformFilter !== "All";

	return (
		<div className="space-y-4">
			{/* Search and Filter Bar */}
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<div className="flex flex-col sm:flex-row gap-2 flex-1">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search creators..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={genreFilter} onValueChange={setGenreFilter}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by genre" />
						</SelectTrigger>
						<SelectContent>
							{GENRE_OPTIONS.map((genre) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={platformFilter} onValueChange={setPlatformFilter}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by platform" />
						</SelectTrigger>
						<SelectContent>
							{PLATFORM_OPTIONS.map((platform) => (
								<SelectItem key={platform} value={platform}>
									{platform}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{hasActiveFilters && (
					<Button variant="outline" onClick={handleClearFilters}>
						Clear Filters
					</Button>
				)}
			</div>

			{/* Results Info */}
			<div className="text-sm text-gray-600">
				Showing {paginatedCreators.length} of {filteredCreators.length} creators
			</div>

			{/* Table */}
			{loading ? (
				<div className="text-center py-8">Loading creators...</div>
			) : paginatedCreators.length === 0 ? (
				<div className="text-center py-8">
					{hasActiveFilters ? (
						<div>
							<p className="text-gray-500 mb-2">No creators match your filters.</p>
							<Button variant="outline" onClick={handleClearFilters}>
								Clear Filters
							</Button>
						</div>
					) : (
						<p className="text-gray-500">No creators found.</p>
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
							<TableHead>Total Views</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedCreators.map((creator) => (
							<TableRow key={creator._id}>
								<TableCell className="font-medium">{creator.name}</TableCell>
								<TableCell>{creator.genre}</TableCell>
								<TableCell>{creator.platform}</TableCell>
								<TableCell>
									{creator.details.analytics.followers.toLocaleString()}
								</TableCell>
								<TableCell>
									{creator.details.analytics.totalViews.toLocaleString()}
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
											onClick={() => onDelete(creator._id!)}
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

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-6">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
									className={
										currentPage === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
								<PaginationItem key={page}>
									<PaginationLink
										onClick={() => handlePageChange(page)}
										isActive={currentPage === page}
										className="cursor-pointer"
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										handlePageChange(Math.min(totalPages, currentPage + 1))
									}
									className={
										currentPage === totalPages
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
};

export default CreatorTable;
