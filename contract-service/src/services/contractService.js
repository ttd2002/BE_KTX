const Contract = require('../database/models/Contract'); 

exports.getContractsByStudentId = async (studentId) => {
    try {
        if (!studentId) {
            throw new Error("Student ID is required");
        }
        const contracts = await Contract.find({ studentId });
        return contracts;
    } catch (error) {
        throw new Error("Internal server error");
    }
};


