
import React, { useState } from "react";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { creatorAPI } from "../../services/api";

interface CSVImportProps {
	onImportComplete: () => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith('.csv')) {
			setUploadStatus({
				type: "error",
				message: "Please upload a CSV file"
			});
			return;
		}

		setIsUploading(true);
		setUploadStatus({ type: null, message: "" });

		try {
			const text = await file.text();
			const lines = text.split('\n').filter(line => line.trim());
			const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
			
			const creators = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
				if (values.length < headers.length) continue;

				const creator = {
					name: values[headers.indexOf('name')] || '',
					genre: values[headers.indexOf('genre')] || '',
					avatar: values[headers.indexOf('avatar')] || '',
					platform: values[headers.indexOf('platform')] || 'Instagram',
					socialLink: values[headers.indexOf('socialLink')] || '',
					mediaKitUrl: values[headers.indexOf('mediaKitUrl')] || '',
					contactNumber: values[headers.indexOf('contactNumber')] || '',
					location: values[headers.indexOf('location')] || 'Other',
					bio: values[headers.indexOf('bio')] || '',
					followers: parseInt(values[headers.indexOf('followers')]) || 0,
					totalViews: parseInt(values[headers.indexOf('totalViews')]) || 0,
					averageViews: parseInt(values[headers.indexOf('averageViews')]) || 0,
					engagement: values[headers.indexOf('engagement')] || '',
					reels: [],
					tags: values[headers.indexOf('tags')] ? values[headers.indexOf('tags')].split(';') : []
				};

				if (creator.name && creator.socialLink) {
					creators.push(creator);
				}
			}

			// Import creators
			let successCount = 0;
			let errorCount = 0;

			for (const creator of creators) {
				try {
					await creatorAPI.create(creator);
					successCount++;
				} catch (error) {
					errorCount++;
					console.error('Error importing creator:', creator.name, error);
				}
			}

			setUploadStatus({
				type: "success",
				message: `Successfully imported ${successCount} creators. ${errorCount > 0 ? `${errorCount} failed.` : ''}`
			});

			onImportComplete();
		} catch (error) {
			console.error('CSV import error:', error);
			setUploadStatus({
				type: "error",
				message: "Error processing CSV file. Please check the format."
			});
		} finally {
			setIsUploading(false);
		}
	};

	const downloadSampleCSV = () => {
		const sampleData = [
			'name,genre,avatar,platform,socialLink,mediaKitUrl,contactNumber,location,bio,followers,totalViews,averageViews,engagement,tags',
			'"John Doe","AI Creators","https://example.com/avatar.jpg","Instagram","https://instagram.com/johndoe","https://drive.google.com/mediakit","+911234567890","Mumbai","Tech content creator",10000,500000,25000,"5.2%","tech;ai;content"',
			'"Jane Smith","Lifestyle","https://example.com/avatar2.jpg","YouTube","https://youtube.com/janesmith","","+911234567891","Delhi","Lifestyle blogger",25000,1000000,40000,"4.8%","lifestyle;fashion"'
		].join('\n');

		const blob = new Blob([sampleData], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'creators_sample.csv';
		a.click();
		window.URL.revokeObjectURL(url);
	};

	return (
		<div className="p-6 border rounded-lg bg-gray-50">
			<h3 className="text-lg font-semibold mb-4">Import Creators from CSV</h3>
			
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Button
						onClick={downloadSampleCSV}
						variant="outline"
						className="flex items-center gap-2"
					>
						<Download size={16} />
						Download Sample CSV
					</Button>
					
					<div className="text-sm text-gray-600">
						Download sample CSV to see the required format
					</div>
				</div>

				<div className="border-t pt-4">
					<label className="block text-sm font-medium mb-2">
						Upload CSV File
					</label>
					<Input
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
						disabled={isUploading}
						className="mb-2"
					/>
					<div className="text-xs text-gray-500">
						Required columns: name, genre, avatar, platform, socialLink, location, bio, followers, totalViews, averageViews, contactNumber, mediaKitUrl, engagement, tags
					</div>
				</div>

				{isUploading && (
					<div className="flex items-center gap-2 text-blue-600">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
						<span>Importing creators...</span>
					</div>
				)}

				{uploadStatus.type && (
					<div className={`flex items-center gap-2 p-3 rounded ${
						uploadStatus.type === 'success' 
							? 'bg-green-100 text-green-700' 
							: 'bg-red-100 text-red-700'
					}`}>
						{uploadStatus.type === 'success' ? (
							<CheckCircle size={16} />
						) : (
							<AlertCircle size={16} />
						)}
						<span>{uploadStatus.message}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default CSVImport;
