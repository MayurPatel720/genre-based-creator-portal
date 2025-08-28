
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Eye, Clock } from "lucide-react";
import { creatorAPI } from "@/services/api";
import { Creator } from "@/types/Creator";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import CreatorModal from "../CreatorModal";

const CreatorApproval: React.FC = () => {
	const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { data: pendingCreators = [], isLoading } = useQuery({
		queryKey: ["pendingCreators"],
		queryFn: () => creatorAPI.getPending(),
	});

	const approveMutation = useMutation({
		mutationFn: creatorAPI.approve,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingCreators"] });
			queryClient.invalidateQueries({ queryKey: ["creators"] });
			toast({
				title: "Success!",
				description: "Creator approved successfully.",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to approve creator.",
				variant: "destructive",
			});
		},
	});

	const rejectMutation = useMutation({
		mutationFn: creatorAPI.reject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingCreators"] });
			toast({
				title: "Success!",
				description: "Creator rejected.",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to reject creator.",
				variant: "destructive",
			});
		},
	});

	const handleApprove = (id: string) => {
		approveMutation.mutate(id);
	};

	const handleReject = (id: string) => {
		rejectMutation.mutate(id);
	};

	if (isLoading) {
		return <div className="p-6 text-center">Loading pending creators...</div>;
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Creator Approvals</h2>
				<Badge variant="secondary" className="flex items-center gap-2">
					<Clock size={16} />
					{pendingCreators.length} Pending
				</Badge>
			</div>

			{pendingCreators.length === 0 ? (
				<Card>
					<CardContent className="p-8 text-center">
						<Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							All caught up!
						</h3>
						<p className="text-gray-600">No creators pending approval.</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6">
					{pendingCreators.map((creator) => (
						<Card key={creator._id} className="overflow-hidden">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<img
											src={creator.avatar || "/fallback-avatar.png"}
											alt={creator.name}
											className="w-16 h-16 rounded-full object-cover"
										/>
										<div>
											<CardTitle className="text-xl">{creator.name}</CardTitle>
											<p className="text-gray-600">
												{creator.genre} • {creator.platform}
											</p>
										</div>
									</div>
									<Badge variant="outline" className="text-yellow-600 border-yellow-600">
										Pending Approval
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div>
										<h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
										<p className="text-gray-600 text-sm line-clamp-3">
											{creator.details.bio}
										</p>
									</div>
									<div>
										<h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
										<div className="text-sm text-gray-600 space-y-1">
											<p>Followers: {creator.details.analytics.followers.toLocaleString()}</p>
											<p>Total Views: {creator.details.analytics.totalViews.toLocaleString()}</p>
											<p>Location: {creator.location}</p>
										</div>
									</div>
								</div>
								<div className="flex gap-3">
									<Button
										variant="outline"
										onClick={() => setSelectedCreator(creator)}
									>
										<Eye className="w-4 h-4 mr-2" />
										View Details
									</Button>
									<Button
										onClick={() => handleApprove(creator._id!)}
										disabled={approveMutation.isPending}
										className="bg-green-600 hover:bg-green-700"
									>
										<Check className="w-4 h-4 mr-2" />
										Approve
									</Button>
									<Button
										variant="destructive"
										onClick={() => handleReject(creator._id!)}
										disabled={rejectMutation.isPending}
									>
										<X className="w-4 h-4 mr-2" />
										Reject
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{selectedCreator && (
				<CreatorModal
					creator={selectedCreator}
					onClose={() => setSelectedCreator(null)}
				/>
			)}
		</div>
	);
};

export default CreatorApproval;
