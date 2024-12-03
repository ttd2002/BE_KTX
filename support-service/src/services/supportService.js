const Support = require('../database/models/Support');

exports.addSupport = async (user, data) => {
    const { email, phoneNumber, requestType, urgency } = data;

    if (!email || !phoneNumber || !requestType || !urgency) {
        return { message: "Email, phoneNumber, urgency and requestType are required." };
    }
    console.log("user", user);
    const newSupport = new Support({
        studentId: user.studentId,
        studentName: user.name,
        roomAddress: user.roomName,
        email,
        phoneNumber,
        requestType,
        urgency,
        status: "pending",
    });

    await newSupport.save();

    return {
        message: "Support created successfully.",
        data: newSupport
    };
};
exports.updateSupport = async (user, data, supportId) => {
    const { status, solution } = data;
    const support = await Support.findById(supportId);
    if (!support) {
        return { message: "Support not found." };
    }

    const previousStatus = support.status;

    if (previousStatus === 'pending') {
        if (status === 'processing') {
            if (!user.isAdmin) {
                return { message: "Only admins can move status from 'pending' to 'processing'." };
            }
        } else {
            return { message: "Invalid status transition from 'pending' to any status other than 'processing'." };
        }
    } else if (previousStatus === 'processing') {
        if (status === 'processed(waitingForConfirm)') {
            if (!user.isAdmin) {
                return { message: "Only admins can move status from 'processing' to 'processed(waitingForConfirm)'." };
            }
            if (!solution || solution.trim() === "") {
                return { message: "Solution is required to move to 'processed(waitingForConfirm)'." };
            }
            support.solution = solution;
            support.receiver = user.name;
        } else {
            return { message: "Invalid status transition from 'processing' to any status other than 'processed(waitingForConfirm)'." };
        }
    } else if (previousStatus === 'processed(waitingForConfirm)') {
        if (status === 'finished') {
            if (user.isAdmin) {
                return { message: "Only students can move status from 'processed(waitingForConfirm)' to 'finished'." };
            }
        } else {
            return { message: "Invalid status transition from 'processed(waitingForConfirm)' to any status other than 'finished'." };
        }
    } else {
        return {
            message: `Invalid status transition from '${previousStatus}' to '${status}'.`
        };
    }

    support.status = status;
    await support.save();

    return {
        message: "Status updated successfully.",
        data: support
    };
};

exports.getSupports = async () => {
    const suports = Support.find();
    return suports
};

exports.getSupportsByRoom = async (roomAddress) => {
    const suports = Support.find({roomAddress});
    return suports
};
