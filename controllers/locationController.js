const Location = require('../models/location');
const { StatusCodes } = require('http-status-codes');

// set user location (manually or automatically)
const setLocation = async (req, res) => {
  const {userId} = req.user;
  const { name, latitude, longitude, isDefault } = req.body;

  try {
    // validate input 
    if (!name || !latitude || !longitude) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide name, latitude and longitude'});
    };

    // check if this location should be set as default
    if (isDefault) {
      // if this is a default location, unset any existing default
      await Location.updateMany(
        { user: userId, isDefault: true }, 
        { isDefault: false }
      );
    }

    // check if a location with this name already exists for this user
    const location = await Location.findOne({ user: userId, name });

    if (location) {
      // if it exists, update it
      location.coordinates.coordinates = [longitude, latitude];
      location.isDefault = isDefault || location.isDefault;
      location.updatedAt = Date.now();
      await location.save();

      return res.status(StatusCodes.OK).json({ message: 'Location updated successfully', location: existingLocation });
    }



  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to set location', error: error.message });
  }
}
