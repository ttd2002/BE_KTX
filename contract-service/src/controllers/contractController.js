const contractService = require('../services/contractService');

exports.getContractsByStudentId = async (req, res) => {
    try {
      if (!req.user || !req.user.studentId) {
        return res.status(403).json({ message: 'Access denied. Students only.' });
      }
      const data = await contractService.getContractsByStudentId(req.user.studentId);
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };