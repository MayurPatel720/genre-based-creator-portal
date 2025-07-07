
import { useState } from "react";
import { Plus, Users, TrendingUp, Eye } from "lucide-react";
import CreatorForm from "../components/admin/CreatorForm";
import CreatorList from "../components/admin/CreatorList";
import { useCreators } from "../hooks/useCreators";
import { Creator } from "../types/Creator";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

const Admin = () => {
	const [activeTab, setActiveTab] = useState<"list" | "form">("list");
	const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
	const { creators, loading, error } = useCreators();

	const handleEdit = (creator: Creator) => {
		setEditingCreator(creator);
		setActiveTab("form");
	};

	const handleFormSuccess = () => {
		setActiveTab("list");
		setEditingCreator(null);
	};

	const handleAddNew = () => {
		setEditingCreator(null);
		setActiveTab("form");
	};

	// Calculate stats
	const totalCreators = creators.length;
	const totalFollowers = creators.reduce(
		(sum, creator) => sum + (creator.details.analytics.followers || 0),
		0
	);
	const totalViews = creators.reduce(
		(sum, creator) => sum + (creator.details.analytics.totalViews || 0),
		0
	);

	return (
		<div className="min-h-screen bg-gray-50 font-poppins">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2 font-anton">
						Admin Dashboard
					</h1>
					<p className="text-gray-600">Manage creator profiles and content</p>
				</div>

				{/* Error Display */}
				{error && (
					<div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
						{error}
					</div>
				)}

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Creators
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{loading ? "..." : totalCreators}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Followers
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{loading ? "..." : totalFollowers.toLocaleString()}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Views</CardTitle>
							<Eye className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{loading ? "..." : totalViews.toLocaleString()}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Navigation */}
				<div className="flex gap-4 mb-6">
					<Button
						variant={activeTab === "list" ? "default" : "outline"}
						onClick={() => setActiveTab("list")}
					>
						Creator List
					</Button>
					<Button
						variant={activeTab === "form" ? "default" : "outline"}
						onClick={handleAddNew}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Creator
					</Button>
				</div>

				{/* Content */}
				<div className="bg-white rounded-lg shadow">
					{activeTab === "list" ? (
						<CreatorList onEdit={handleEdit} />
					) : (
						<CreatorForm
							creator={editingCreator}
							onSuccess={handleFormSuccess}
							onCancel={() => {
								setActiveTab("list");
								setEditingCreator(null);
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Admin;
