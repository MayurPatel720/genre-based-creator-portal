
const mongoose = require("mongoose");
const Location = require("./models/Location");

const predefinedLocations = [
	"Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", 
	"Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", 
	"Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
	"USA", "Canada", "UK", "Australia", "Singapore", "Dubai", "Germany", "France"
];

const seedLocations = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/creator-portal");
		
		console.log("🌱 Starting location seeding...");
		
		for (const locationName of predefinedLocations) {
			const existingLocation = await Location.findOne({ 
				name: { $regex: new RegExp(`^${locationName}$`, 'i') }
			});
			
			if (!existingLocation) {
				await Location.create({
					name: locationName,
					isPredefined: true,
					createdBy: "system"
				});
				console.log(`✅ Added: ${locationName}`);
			}
		}
		
		console.log("🎉 Location seeding completed!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding locations:", error);
		process.exit(1);
	}
};

seedLocations();
