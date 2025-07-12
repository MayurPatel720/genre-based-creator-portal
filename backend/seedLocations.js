require("dotenv").config();

const mongoose = require("mongoose");
const Location = require("./models/Location");
const { dbConnect } = require("./Configs/dbConnect");

const predefinedLocations = [
	"Agartala", // Tripura capital
	"Agra", // Million-plus, historical city
	"Ahmedabad", // Million-plus, economic hub (5.6M, 2011)[](https://en.wikipedia.org/wiki/List_of_cities_in_India_by_population)
	"Aizawl", // Mizoram capital
	"Ajmer", // Rajasthan, cultural center
	"Akola", // Maharashtra, commercial hub
	"Aligarh", // Uttar Pradesh, educational hub
	"Alwar", // Rajasthan, historical city
	"Amaravati", // Andhra Pradesh capital
	"Ambala", // Haryana, industrial city
	"Amravati", // Maharashtra, administrative hub
	"Amritsar", // Million-plus, cultural hub (1.1M, 2011)
	"Asansol", // Million-plus, industrial city (1.2M, 2011)
	"Aurangabad", // Million-plus, industrial hub (1.2M, 2011)
	"Bareilly", // Million-plus, commercial hub (1M, 2011)
	"Bangalore", // Million-plus, IT hub (~8.5M, 2011; ~13M, 2023)[](https://www.statista.com/statistics/275378/largest-cities-in-india/)
	"Bhagalpur", // Bihar, commercial center
	"Bharatpur", // Rajasthan, historical city
	"Bhavnagar", // Gujarat, port city
	"Bhilai", // Chhattisgarh, industrial city
	"Bhiwandi", // Million-plus, logistics hub (1.1M, 2011)
	"Bhopal", // Madhya Pradesh capital, million-plus (1.8M, 2011)
	"Bhubaneswar", // Odisha capital, IT hub
	"Bikaner", // Rajasthan, cultural city
	"Bilaspur", // Chhattisgarh, commercial hub
	"Bokaro Steel City", // Jharkhand, industrial city
	"Brahmapur", // Odisha, commercial center
	"Chandigarh", // Union Territory capital, planned city
	"Chennai", // Million-plus, industrial hub (~7.1M, 2011; ~12M, 2024)[](https://indianexpress.com/article/trending/top-10-listing/delhi-mumbai-or-kolkata-here-are-top-10-densely-populated-indian-cities-in-2024-9446056/)
	"Coimbatore", // Million-plus, industrial hub (1.6M, 2011)
	"Cuttack", // Odisha, historical city
	"Daman", // Daman & Diu capital
	"Davanagere", // Karnataka, educational hub
	"Dehradun", // Uttarakhand capital
	"Delhi", // Million-plus, national capital (~11M, 2011; ~33M, 2023)[](https://www.statista.com/statistics/275378/largest-cities-in-india/)
	"Dhanbad", // Million-plus, industrial city (1.2M, 2011)
	"Dharwad", // Karnataka, educational hub
	"Dibrugarh", // Assam, commercial center
	"Durgapur", // West Bengal, industrial city
	"Erode", // Tamil Nadu, textile hub
	"Faridabad", // Million-plus, industrial city (1.4M, 2011)
	"Firozabad", // Uttar Pradesh, glass industry
	"Gandhinagar", // Gujarat capital
	"Gangtok", // Sikkim capital
	"Gaya", // Bihar, cultural city
	"Ghaziabad", // Million-plus, industrial hub (1.6M, 2011)
	"Gorakhpur", // Uttar Pradesh, commercial hub
	"Gulbarga", // Karnataka, educational city
	"Guntur", // Andhra Pradesh, commercial hub
	"Gurgaon", // Million-plus, IT/financial hub
	"Guwahati", // Million-plus, Northeast gateway (1M, 2011)
	"Gwalior", // Million-plus, historical city (1.1M, 2011)
	"Haldia", // West Bengal, port city
	"Hapur", // Uttar Pradesh, industrial city
	"Haridwar", // Uttarakhand, cultural city
	"Hospet", // Karnataka, mining hub
	"Howrah", // Million-plus, industrial city (1.1M, 2011)
	"Hubli-Dharwad", // Million-plus, commercial hub (1M, 2011)
	"Hyderabad", // Million-plus, IT hub (~6.8M, 2011; ~11.2M, 2024)[](https://indianexpress.com/article/trending/top-10-listing/delhi-mumbai-or-kolkata-here-are-top-10-densely-populated-indian-cities-in-2024-9446056/)
	"Imphal", // Manipur capital
	"Indore", // Million-plus, cleanest city (2M, 2011)[](https://www.godigit.com/explore/city-list/list-of-cities-in-india)
	"Jabalpur", // Million-plus, industrial city (1.1M, 2011)
	"Jaipur", // Million-plus, Rajasthan capital (3.1M, 2011)
	"Jalandhar", // Punjab, commercial hub
	"Jalgaon", // Maharashtra, agricultural hub
	"Jammu", // Jammu & Kashmir, winter capital
	"Jamnagar", // Gujarat, industrial city
	"Jamshedpur", // Million-plus, industrial city (1.3M, 2011)
	"Jhansi", // Uttar Pradesh, historical city
	"Jodhpur", // Million-plus, cultural city (1.1M, 2011)
	"Jorhat", // Assam, commercial center
	"Kakinada", // Andhra Pradesh, port city
	"Kalyan-Dombivli", // Million-plus, part of Mumbai MMR (1.2M, 2011)
	"Kannur", // Kerala, commercial city
	"Kanpur", // Million-plus, industrial hub (2.8M, 2011)
	"Karnal", // Haryana, agricultural hub
	"Kochi", // Million-plus, port city (2.1M, 2011)
	"Kolhapur", // Maharashtra, cultural city
	"Kolkata", // Million-plus, cultural hub (~4.5M, 2011; ~15M, 2023)[](https://timesproperty.com/amp/webstories/complete-list-of-biggest-cities-in-india-wid-738)
	"Kollam", // Kerala, commercial city
	"Korba", // Chhattisgarh, industrial city
	"Kota", // Million-plus, educational hub (1M, 2011)
	"Kozhikode", // Kerala, commercial city
	"Kurnool", // Andhra Pradesh, historical city
	"Latur", // Maharashtra, educational hub
	"Lucknow", // Million-plus, Uttar Pradesh capital (2.8M, 2011)
	"Ludhiana", // Million-plus, industrial hub (1.6M, 2011)
	"Madurai", // Million-plus, cultural city (1.5M, 2011)
	"Malappuram", // Kerala, educational hub
	"Mangalore", // Karnataka, port city
	"Mathura", // Uttar Pradesh, cultural city
	"Meerut", // Million-plus, commercial hub (1.3M, 2011)
	"Moradabad", // Uttar Pradesh, industrial city
	"Mumbai", // Million-plus, financial capital (~12.4M, 2011; ~21.7M, 2023)[](https://www.statista.com/statistics/275378/largest-cities-in-india/)
	"Muzaffarpur", // Bihar, commercial hub
	"Mysore", // Karnataka, cultural city
	"Nagpur", // Million-plus, Maharashtra hub (2.4M, 2011)
	"Nanded", // Maharashtra, cultural city
	"Nashik", // Million-plus, industrial city (1.5M, 2011)
	"Navi Mumbai", // Million-plus, planned city (1.1M, 2011)
	"Nellore", // Andhra Pradesh, commercial city
	"Noida", // Million-plus, IT hub
	"Panaji", // Goa capital
	"Patna", // Million-plus, Bihar capital (1.7M, 2011)
	"Pimpri-Chinchwad", // Million-plus, industrial city (1.7M, 2011)
	"Port Blair", // Andaman & Nicobar capital
	"Puducherry", // Puducherry capital
	"Pune", // Million-plus, IT/educational hub (~3.1M, 2011)[](https://en.wikipedia.org/wiki/List_of_cities_in_India_by_population)
	"Raipur", // Million-plus, Chhattisgarh capital (1M, 2011)
	"Rajahmundry", // Andhra Pradesh, commercial city
	"Rajkot", // Million-plus, industrial city (1.3M, 2011)
	"Ranchi", // Million-plus, Jharkhand capital (1.1M, 2011)
	"Rohtak", // Haryana, educational hub
	"Rourkela", // Odisha, industrial city
	"Saharanpur", // Uttar Pradesh, commercial city
	"Salem", // Tamil Nadu, industrial city
	"Sangli", // Maharashtra, agricultural hub
	"Shillong", // Meghalaya capital
	"Shimla", // Himachal Pradesh capital
	"Siliguri", // West Bengal, commercial hub
	"Solapur", // Million-plus, industrial city (1M, 2011)
	"Srinagar", // Million-plus, Jammu & Kashmir summer capital (1.2M, 2011)
	"Surat", // Million-plus, diamond/textile hub (~4.5M, 2011)[](https://en.wikipedia.org/wiki/List_of_cities_in_India_by_population)
	"Thane", // Million-plus, part of Mumbai MMR (1.8M, 2011)
	"Thiruvananthapuram", // Kerala capital
	"Thrissur", // Kerala, cultural city
	"Tiruchirappalli", // Tamil Nadu, industrial city
	"Tirunelveli", // Tamil Nadu, commercial city
	"Tirupati", // Andhra Pradesh, pilgrimage city
	"Tiruppur", // Tamil Nadu, textile hub
	"Udaipur", // Rajasthan, tourism hub
	"Ujjain", // Madhya Pradesh, cultural city
	"Vadodara", // Million-plus, industrial hub (1.8M, 2011)
	"Varanasi", // Million-plus, cultural city (1.2M, 2011)
	"Vasai-Virar", // Million-plus, part of Mumbai MMR (1.2M, 2011)
	"Vijayawada", // Million-plus, commercial hub (1M, 2011)
	"Visakhapatnam", // Million-plus, port city (~1.7M, 2011)
	"Warangal", // Telangana, historical city
	"Yamunanagar",
];

const seedLocations = async () => {
	try {
		await dbConnect();

		console.log("🌱 Starting location seeding...");

		for (const locationName of predefinedLocations) {
			const existingLocation = await Location.findOne({
				name: { $regex: new RegExp(`^${locationName}$`, "i") },
			});

			if (!existingLocation) {
				await Location.create({
					name: locationName,
					isPredefined: true,
					createdBy: "system",
					isActive: true,
				});
				console.log(`✅ Added: ${locationName}`);
			} else {
				// Update existing location to ensure it's active and predefined
				await Location.updateOne(
					{ _id: existingLocation._id },
					{
						isPredefined: true,
						isActive: true,
						createdBy: "system",
					}
				);
				console.log(`🔄 Updated: ${locationName}`);
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
