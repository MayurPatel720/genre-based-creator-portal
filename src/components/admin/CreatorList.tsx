import React from "react";

import { Trash2, Edit } from "lucide-react";
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

interface CreatorListProps {
	onEdit: (creator: Creator) => void;
}

const CreatorList: React.FC<CreatorListProps> = ({ onEdit }) => {
	const { creators, deleteCreator, loading, error } = useCreators();

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this creator?")) {
			try {
				await deleteCreator(id);
			} catch (err) {
				console.error("Failed to delete creator:", err);
			}
		}
	};

	return (
		<div className="p-6">
			{error && (
				<div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
			)}
			{loading ? (
				<p>Loading creators...</p>
			) : creators.length === 0 ? (
				<p>No creators found.</p>
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
			)}
		</div>
	);
};

export default CreatorList;
