/* eslint-disable @typescript-eslint/no-explicit-any */
import { creatorAPI } from "@/services/api";
import React, { useMemo, useState, ChangeEvent, FormEvent } from "react";

// Type definitions
interface FormField {
	label: string;
	name: keyof CreatorForm;
	type: "text" | "tel" | "url" | "number" | "textarea";
	autoComplete?: string;
	required?: boolean;
	placeholder?: string;
	pattern?: string;
	min?: number;
}

interface FormSection {
	title: string;
	fields: FormField[];
}

interface CreatorForm {
	name: string;
	avatar: string;
	genre: string;
	bio: string;
	platform: string;
	followers: string;
	socialLink: string;
	totalViews: string;
	avgViews: string;
	location: string;
	phone: string;
	mediaKit: string;
}

interface StatProps {
	label: string;
	value: string;
}

// Enhanced responsive white UI with comprehensive live preview
export default function CreatorForm(): JSX.Element {
	const [form, setForm] = useState<CreatorForm>({
		name: "",
		avatar: "",
		genre: "",
		bio: "",
		platform: "",
		followers: "",
		socialLink: "",
		totalViews: "",
		avgViews: "",
		location: "",
		phone: "",
		mediaKit: "",
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const prettyNumber = (v: string): string => {
		if (!v) return "—";
		const n = Number(v);
		if (Number.isNaN(n)) return v;
		if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
		if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
		return String(n);
	};

	const sections = useMemo<FormSection[]>(
		() => [
			{
				title: "Profile",
				fields: [
					{
						label: "Name",
						name: "name",
						type: "text",
						autoComplete: "name",
						required: true,
					},
					{
						label: "Location",
						name: "location",
						type: "text",
						autoComplete: "address-level2",
						placeholder: "City, Country",
					},
					{
						label: "Phone Number",
						name: "phone",
						type: "tel",
						autoComplete: "tel",
						pattern: "[0-9()+-s]{7,20}",
						placeholder: "+1 (555) 123-4567",
					},
					{
						label: "Avatar URL",
						name: "avatar",
						type: "url",
						placeholder: "https://example.com/avatar.jpg",
					},
				],
			},
			{
				title: "Social Presence",
				fields: [
					{
						label: "Primary Platform",
						name: "platform",
						type: "text",
						placeholder: "YouTube, Instagram, TikTok…",
						required: true,
					},
					{
						label: "Followers",
						name: "followers",
						type: "number",
						min: 0,
						placeholder: "100000",
					},
					{
						label: "Social Profile Link",
						name: "socialLink",
						type: "url",
						placeholder: "https://instagram.com/username",
					},
					{
						label: "Media Kit URL",
						name: "mediaKit",
						type: "url",
						placeholder: "https://yourmediakit.com",
					},
				],
			},
			{
				title: "Content & Performance",
				fields: [
					{
						label: "Total Views",
						name: "totalViews",
						type: "number",
						min: 0,
						placeholder: "1000000",
					},
					{
						label: "Average Views per Post",
						name: "avgViews",
						type: "number",
						min: 0,
						placeholder: "50000",
					},
					{
						label: "Content Genre",
						name: "genre",
						type: "text",
						placeholder: "Lifestyle, Tech, Gaming, Fashion…",
					},
					{
						label: "Bio",
						name: "bio",
						type: "textarea",
						placeholder:
							"Tell your story in 2-3 sentences. What makes your content unique?",
					},
				],
			},
		],
		[]
	);

	const completionPercentage = useMemo<number>(() => {
		const totalFields = Object.keys(form).length;
		const filledFields = Object.values(form).filter(
			(value) => value && value.trim() !== ""
		).length;
		return Math.round((filledFields / totalFields) * 100);
	}, [form]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		// Allowed platforms for API
		const allowedPlatforms = [
			"Other",
			"Instagram",
			"YouTube",
			"TikTok",
			"Twitter",
		] as const;
		const platformValue = allowedPlatforms.includes(form.platform as any)
			? (form.platform as (typeof allowedPlatforms)[number])
			: "Other";

		// Transform flat form → API payload
		const payload = {
			name: form.name,
			genre: form.genre,
			avatar: form.avatar,
			platform: platformValue,
			socialLink: form.socialLink,
			location: form.location || "Other",
			phoneNumber: form.phone,
			mediaKit: form.mediaKit,
			details: {
				location: form.location || "Other",
				bio: form.bio,
				analytics: {
					followers: Number(form.followers) || 0,
					totalViews: Number(form.totalViews) || 0,
					averageViews: Number(form.avgViews) || 0,
				},
				reels: [], // if you don’t collect reels now, send empty
			},
		};

		try {
			const res = await creatorAPI.create(payload);
			console.log("✅ Creator created:", res);
			alert("Creator profile saved successfully!");
			handleReset(); // clear form
		} catch (err) {
			console.error("❌ Error creating creator:", err);
			alert("Failed to save creator profile.");
		}
	};

	const handleReset = (): void => {
		setForm({
			name: "",
			avatar: "",
			genre: "",
			bio: "",
			platform: "",
			followers: "",
			socialLink: "",
			totalViews: "",
			avgViews: "",
			location: "",
			phone: "",
			mediaKit: "",
		});
	};

	const handleImageError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>
	): void => {
		const target = e.target as HTMLImageElement;
		const nextSibling = target.nextElementSibling as HTMLElement;
		target.style.display = "none";
		if (nextSibling) {
			nextSibling.style.display = "flex";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Enhanced page header */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
				<div className="text-center sm:text-left">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
						Creators Dream
					</h1>
					<p className="text-gray-600 mt-2 text-base sm:text-lg max-w-2xl">
						Build your professional creator profile and showcase your digital
						presence.
					</p>
					<div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
						<div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
							<div
								className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
								style={{ width: `${completionPercentage}%` }}
							/>
						</div>
						<span className="text-sm font-medium text-gray-700 min-w-[60px]">
							{completionPercentage}% complete
						</span>
					</div>
				</div>
			</div>

			{/* Enhanced content grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
				{/* Main form - takes more space on larger screens */}
				<div className="xl:col-span-3">
					<form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
						{sections.map((section) => (
							<section
								key={section.title}
								className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
							>
								<div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
									<h2 className="text-lg sm:text-xl font-semibold text-gray-900">
										{section.title}
									</h2>
								</div>
								<div className="p-4 sm:p-6">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
										{section.fields.map((f) => (
											<div
												key={f.name}
												className={f.type === "textarea" ? "lg:col-span-2" : ""}
											>
												<label className="block">
													<span className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
														{f.label}
														{f.required && (
															<span className="text-red-500 text-xs">
																Required
															</span>
														)}
													</span>
													{f.type === "textarea" ? (
														<textarea
															name={f.name}
															rows={4}
															placeholder={f.placeholder}
															value={form[f.name]}
															onChange={handleChange}
															className="w-full resize-y min-h-[120px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
														/>
													) : (
														<input
															type={f.type}
															name={f.name}
															min={f.min}
															pattern={f.pattern}
															placeholder={f.placeholder}
															autoComplete={f.autoComplete}
															value={form[f.name]}
															onChange={handleChange}
															className="w-full h-11 sm:h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
														/>
													)}
													{/* Enhanced helper text */}
													{f.name === "phone" && (
														<span className="mt-2 block text-xs text-gray-500">
															Include country code. Digits, spaces, +, - and
															parentheses allowed.
														</span>
													)}
													{f.name === "avatar" && (
														<span className="mt-2 block text-xs text-gray-500">
															Recommended: Square image, at least 400×400 pixels
														</span>
													)}
													{f.name === "bio" && (
														<span className="mt-2 block text-xs text-gray-500">
															{form.bio?.length || 0}/280 characters
														</span>
													)}
												</label>
											</div>
										))}
									</div>
								</div>
							</section>
						))}

						{/* Enhanced Actions */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
							<button
								type="submit"
								className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[.98] hover:from-blue-700 hover:to-purple-700 p-3"
							>
								Save Creator Profile
							</button>
						</div>
					</form>
				</div>

				{/* Enhanced Live Preview - takes more space and shows more details */}
				<aside className="xl:col-span-2 space-y-6">
					{/* Profile Preview Card */}
					<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 relative">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Live Preview
						</h3>

						{/* Profile Header */}
						<div className="flex items-start gap-4 mb-6">
							<div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gray-100 overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
								{form.avatar ? (
									<img
										src={form.avatar}
										alt="Creator avatar"
										className="h-full w-full object-cover"
										onError={handleImageError}
									/>
								) : null}
								<div
									className={`h-full w-full grid place-items-center text-gray-400 text-xs ${
										form.avatar ? "hidden" : "flex"
									}`}
								>
									No Avatar
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
									{form.name || "Your Creator Name"}
								</h4>
								<p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
									<span>{form.platform || "Platform"}</span>
									{form.platform && form.location && <span>•</span>}
									<span>{form.location || "Location"}</span>
								</p>
								{form.genre && (
									<p className="text-xs text-purple-600 font-medium mt-1 bg-purple-50 inline-block px-2 py-1 rounded-full">
										{form.genre}
									</p>
								)}
							</div>
						</div>

						{/* Bio Preview */}
						{form.bio && (
							<div className="mb-6 p-4 bg-gray-50 rounded-xl">
								<p className="text-sm text-gray-700 leading-relaxed">
									{form.bio}
								</p>
							</div>
						)}

						{/* Stats Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
							<Stat label="Followers" value={prettyNumber(form.followers)} />
							<Stat label="Total Views" value={prettyNumber(form.totalViews)} />
							<Stat label="Avg Views" value={prettyNumber(form.avgViews)} />
						</div>

						{/* Links Section */}
						<div className="space-y-3">
							{form.socialLink && (
								<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
									<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"
												clipRule="evenodd"
											/>
											<path
												fillRule="evenodd"
												d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-blue-600 font-medium">
											Social Profile
										</p>
										<p className="text-sm text-gray-700 truncate">
											{form.socialLink}
										</p>
									</div>
								</div>
							)}

							{form.mediaKit && (
								<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
									<div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-purple-600 font-medium">
											Media Kit
										</p>
										<p className="text-sm text-gray-700 truncate">
											{form.mediaKit}
										</p>
									</div>
								</div>
							)}

							{form.phone && (
								<div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
									<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-green-600 font-medium">
											Contact
										</p>
										<p className="text-sm text-gray-700">{form.phone}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Tips Card */}
					<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Pro Tips
						</h3>
						<ul className="space-y-3 text-sm text-gray-600">
							<li className="flex items-start gap-3">
								<span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
									✓
								</span>
								Keep your bio concise but engaging (2-3 sentences max)
							</li>
							<li className="flex items-start gap-3">
								<span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
									i
								</span>
								Use your most active platform as primary
							</li>
							<li className="flex items-start gap-3">
								<span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
									⚡
								</span>
								Square avatars work best (400×400px minimum)
							</li>
							<li className="flex items-start gap-3">
								<span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
									📈
								</span>
								Update your stats regularly for accuracy
							</li>
						</ul>
					</div>
				</aside>
			</div>
		</div>
	);
}

function Stat({ label, value }: StatProps): JSX.Element {
	return (
		<div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center">
			<p className="text-xs text-gray-500 font-medium">{label}</p>
			<p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
		</div>
	);
}
