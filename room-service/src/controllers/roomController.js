const roomService = require('../services/roomService');

const getBuildings = async (req, res) => {
  try {
    const buildings = await roomService.getRooms();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBuildings };
