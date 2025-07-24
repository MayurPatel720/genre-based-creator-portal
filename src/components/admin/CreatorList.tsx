
import React from "react";
import { useCreators } from "@/hooks/useCreators";
import { Creator } from "@/types/Creator";
import CreatorTable from "./CreatorTable";

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
			<CreatorTable
				creators={creators}
				onEdit={onEdit}
				onDelete={handleDelete}
				loading={loading}
			/>
		</div>
	);
};

export default CreatorList;
