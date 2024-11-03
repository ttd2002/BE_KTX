const Building = require('../database/models/Room');

const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBuildings };
