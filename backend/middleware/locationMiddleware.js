
const Location = require("../models/Location");

// Middleware to automatically add custom locations when creators are created/updated
const handleCustomLocation = async (req, res, next) => {
	try {
		if (req.body.location && req.body.location.trim()) {
			const locationName = req.body.location.trim();
			
			// Check if location exists in Location model
			const existingLocation = await Location.findOne({ 
				name: { $regex: new RegExp(`^${locationName}$`, 'i') }
			});
			
			// If location doesn't exist, create it as a custom location
			if (!existingLocation) {
				const newLocation = new Location({
					name: locationName,
					isPredefined: false,
					createdBy: "admin"
				});
				
				await newLocation.save();
				console.log(`✅ Added new custom location: ${locationName}`);
			}
		}
		
		next();
	} catch (error) {
		console.error("Error in location middleware:", error);
		// Don't block the request if location handling fails
		next();
	}
};

module.exports = { handleCustomLocation };
