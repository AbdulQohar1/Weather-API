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

      return res.status(StatusCodes.OK).json({ 
        message: 'Location updated successfully', 
        location,
      });
    }

    // if it doesn't exist, create a new location
    const newLocation = await Location.create({
      user: userId,
      name,
      coordinates: {
        coordinates: [longitude, latitude],
      },
      isDefault,
    });

    res.status(StatusCodes.CREATED).json({ 
      message: 'Location created successfully', 
      location: newLocation,
    });

  } catch (error) {
    console.log('Error setting location: ',error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({     
      message: 'Failed to set location', 
      error: error.message 
    });
  }
};

// get all user locations
const getUserLocations = async (req, res) => {
  const { userId } = req.user;

  try {
    const locations = await Location.find({ user: userId });

    res.status(StatusCodes.OK).json({ 
      count: locations.length,  
      locations 
    }); 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to retrieve user locations', 
      error: error.message 
    });
  }
};

// delete a location
const deleteLocation = async (req, res) => {
  const { userId } = req.user;
  const { locationId } = req.params;

  try {
    const location = await Location.findOne({ 
      user: userId, 
      _id: locationId 
    });

    if (!location) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
    }

    await location.deleteOne();

    res.status(StatusCodes.OK).json({ 
      message: 'Location deleted successfully' 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to delete location', 
      error: error.message 
    });
  }
};

module.exports = {
  setLocation,
  getUserLocations,
  deleteLocation,
};
