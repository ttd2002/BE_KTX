const Payment = require('../database/models/Payment');
const Building = require('../database/models/Room');
const Student = require('../database/models/Student');
const Contract = require('../database/models/Contract');

const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
require('dotenv').config();
const crypto = require('crypto');
const querystring = require('qs');


const vnpayConfig = {
    vnp_TmnCode: 'SSVEUKQW',
    vnp_HashSecret: '85PR0VC0TKIUAQW560GDXPWLPCKC4GJB',
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    // vnp_ReturnUrl: 'http://localhost:6000/payments/handleVnpayCallback', 
    vnp_ReturnUrl: 'https://be-ktx-payment-service-utwo.onrender.com/payments/handleVnpayCallback',
};

exports.getPaymentsByStudentId = async (studentId) => {
    return await Payment.find({ studentId });
};
// exports.payPaymentById = async (paymentId) => {
//     const payment = await Payment.findById(paymentId);
//     if (!payment) {
//         throw new Error('Payment not found');
//     }
//     payment.paymentStatus = 'paid';
//     await payment.save();
//     return payment;
// };
const getDescription = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let baseDescription;

    if (currentMonth >= 8 && currentMonth <= 12) {
        baseDescription = `Tiền phòng năm học ${currentYear}-${currentYear + 1}`;
    } else if (currentMonth >= 1 && currentMonth <= 5) {
        baseDescription = `Tiền phòng năm học ${currentYear - 1}-${currentYear}`;
    } else if (currentMonth >= 6 && currentMonth <= 7) {
        baseDescription = `2 tháng hè ${currentYear}`;
    }

    return baseDescription;
};

exports.getRoomPaymentDetails = async () => {
    try {
        const description = getDescription();
        const buildings = await Building.find();

        const result = [];

        for (const building of buildings) {
            for (const floor of building.floors) {
                for (const room of floor.rooms) {
                    const roomName = room.gender === 'male' ? `Phòng Nam ${room.roomNumber}` : `Phòng Nữ ${room.roomNumber}`;
                    const students = await Student.find({ roomName: room.roomNumber });

                    let unpaidAmount = 0;

                    const roomDetails = {
                        room: roomName,
                        unpaidAmount: 0,
                        description: description,
                        students: [],
                    };

                    for (const student of students) {
                        const payments = await Payment.find({
                            studentId: student.studentId,
                            type: 'roomFee',
                            description: description,
                        });

                        payments.forEach((payment) => {
                            roomDetails.students.push({
                                name: student.name,
                                studentId: student.studentId,
                                Type: payment.type,
                                dueDate: payment.dueDate,
                                status: payment.paymentStatus,
                                amount: payment.paymentStatus === 'unpaid' ? payment.amount : 0,
                            });

                            if (payment.paymentStatus === 'unpaid') {
                                unpaidAmount += payment.amount;
                            }
                        });
                    }

                    roomDetails.unpaidAmount = unpaidAmount;

                    result.push(roomDetails);
                }
            }
        }

        return result;
    } catch (error) {
        throw new Error("error to get data");
    }
};
exports.getUtilityPayments = async () => {
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại
    const description = `Tiền điện, nước tháng ${currentMonth}`;
    console.log('description', description)
    // const buildings = await Building.find(); // Lấy tất cả các tòa nhà

    // const result = []; // Kết quả cuối cùng

    // for (const building of buildings) {
    //     for (const floor of building.floors) {
    //         for (const room of floor.rooms) {
    //             // Tìm các hóa đơn cho phòng này với type = 'utilityFee' và description tương ứng
    //             const payments = await Payment.find({
    //                 studentId: room.roomNumber, // roomNumber đóng vai trò là studentId trong Payment
    //                 type: 'utilityFee',
    //                 description: description,
    //             });

    //             // Tổng tiền chưa thanh toán
    //             let unpaidAmount = 0;

    //             const paymentDetails = payments.map((payment) => {
    //                 if (payment.paymentStatus === 'unpaid') {
    //                     unpaidAmount += payment.amount;
    //                 }

    //                 return {
    //                     type: payment.type,
    //                     dueDate: payment.dueDate,
    //                     status: payment.paymentStatus,
    //                     amount: payment.amount,
    //                 };
    //             });

    //             // Thêm thông tin phòng và hóa đơn vào kết quả
    //             result.push({
    //                 room: room.roomNumber,
    //                 description: description,
    //                 unpaidAmount: unpaidAmount,
    //                 payments: paymentDetails,
    //             });
    //         }
    //     }
    // }
    const result = Payment.find({ description })
    console.log('result', result);
    return result;

};
exports.getUtilityPaymentsByRoom = async (roomNumber) => {

    const result = Payment.find({ studentId: roomNumber })
    return result;

};
exports.createPaymentUrl = async (paymentId, clientIp, isLeader) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new Error('Payment not found');
    }
    if (payment.type === 'utilityFee' && !isLeader) {
        throw new Error('Only leader can pay the utility payment');
    }
    let date = new Date();
    // let eDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let createExDate = moment(payment.dueDate).format('YYYYMMDDHHmmss');
    // Cấu hình các tham số cho VNPay
    let vnpParams = {};

    vnpParams['vnp_Version'] = '2.1.0';
    vnpParams['vnp_Command'] = 'pay';
    vnpParams['vnp_TmnCode'] = vnpayConfig.vnp_TmnCode;
    vnpParams['vnp_Locale'] = 'vn';
    vnpParams['vnp_CurrCode'] = 'VND';
    vnpParams['vnp_TxnRef'] = paymentId;
    vnpParams['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + paymentId;
    vnpParams['vnp_OrderType'] = 'other';
    vnpParams['vnp_Amount'] = payment.amount * 100;
    vnpParams['vnp_ReturnUrl'] = vnpayConfig.vnp_ReturnUrl;
    vnpParams['vnp_IpAddr'] = clientIp;
    vnpParams['vnp_CreateDate'] = createDate;
    vnpParams['vnp_ExpireDate'] = createExDate;
    // vnpParams['vnp_BankCode'] = 'NCB';
    vnpParams = sortObject(vnpParams);
    let signData = querystring.stringify(vnpParams, { encode: false });
    let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnpParams['vnp_SecureHash'] = signed;

    console.log("Request Parameters:", vnpParams);
    let payment_url = vnpayConfig.vnp_Url;
    payment_url += '?' + querystring.stringify(vnpParams, { encode: false });
    console.log("vnp_Url:", vnpayConfig.vnp_Url);

    return payment_url;
};

// Xử lý callback từ VNPay
exports.handleVnpayReturn = async (query) => {
    const vnpParams = query; // Lấy tham số từ query
    let secureHash = vnpParams['vnp_SecureHash'];
    let paymentId = vnpParams['vnp_TxnRef'];

    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Tạo lại chữ ký để xác minh
    const sortedParams = sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra trạng thái thanh toán
    const transactionStatus = vnpParams['vnp_TransactionStatus'];  // Mã trạng thái giao dịch
    if (secureHash === checkSum) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if (transactionStatus == '00') {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }
            payment.paymentStatus = 'paid';
            payment.paymentMethod = 'vnpay';
            payment.vnp_PaymentDate = new Date();
            payment.vnp_TxnRef = paymentId;

            await payment.save();

            // create contract
            if (payment.type === 'roomFee') {
                const { startDate, endDate } = getDatesFromDescription(payment.description);
                const contractNumber = await generateContractNumber();

                const newContract = new Contract({
                    contractNumber,
                    startDate,
                    endDate,
                    status: 'active',
                    attachment: 'https://vgu.edu.vn/documents/48694/2370092/20160616_hop_dong_ktx.pdf/6521a7a5-17eb-46d2-870f-3e33259405ee',
                    studentId: payment.studentId,
                });

                await newContract.save();
            }
            return { message: 'payment success' };
        }
    } else {
        return { message: 'transaction failed' };
    }
};
const getDatesFromDescription = (description) => {
    const academicYearMatch = description.match(/năm học (\d{4})-(\d{4})/);
    if (academicYearMatch) {
        const startYear = academicYearMatch[1];
        const endYear = academicYearMatch[2];
        return {
            startDate: new Date(`${startYear}-08-01`),
            endDate: new Date(`${endYear}-05-30`),
        };
    }

    const summerMatch = description.match(/2 tháng hè (\d{4})/);
    if (summerMatch) {
        const year = summerMatch[1];
        return {
            startDate: new Date(`${year}-06-01`),
            endDate: new Date(`${year}-07-30`),
        };
    }

    throw new Error(`Unsupported description format: ${description}`);
};
const generateContractNumber = async () => {
    let contractNumber;
    let isUnique = false;

    do {
        contractNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
        const existingContract = await Contract.findOne({ contractNumber });
        isUnique = !existingContract;
    } while (!isUnique);

    return contractNumber;
};
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


exports.createUtilityPayments = async (dueDate) => {
    if (!dueDate) {
        return { message: 'dueDate is required.' };
    }

    const currentMonth = new Date().getMonth() + 1;
    const buildings = await Building.find({});

    for (const building of buildings) {
        for (const floor of building.floors) {
            for (const room of floor.rooms) {
                if (!room.isElectricityWaterCharged) {
                    const { totalCost } = await calculateRoomCost(room.roomNumber);

                    const payment = new Payment({
                        description: `Tiền điện, nước tháng ${currentMonth}`,
                        amount: totalCost,
                        type: 'utilityFee',
                        dueDate,
                        paymentStatus: 'unpaid',
                        studentId: room.roomNumber,
                        vnp_TxnRef: null,
                        paymentMethod: 'unknown',
                        vnp_PaymentDate: null,
                    });
                    room.oldElectricity = room.newElectricity;
                    room.oldWater = room.newWater;
                    room.isElectricityWaterCharged = true;
                    // try {
                    //     const [updateResult, saveResult] = await Promise.all([
                    //         payment.save(),
                    //         Building.updateMany({}, { $set: buildings })
                    //     ]);

                    //     console.log("Building update result:", updateResult);
                    //     console.log("Payment save result:", saveResult);
                    // } catch (error) {
                    //     console.error("Error in Promise.all:", error);
                    // }
                    await payment.save();
                    await Building.updateMany({}, { $set: buildings });
                }
            }
        }
    }


    return { message: 'Utility payments created successfully.' };

};
exports.createUtilityPaymentForRoom = async (roomNumber, dueDate) => {
    try {
        if (!roomNumber) {
            return { message: 'roomNumber is required.' };
        }
        if (!dueDate) {
            return { message: 'dueDate is required.' };
        }

        const currentMonth = new Date().getMonth() + 1;
        const { building, floor, room } = await findRoom(roomNumber);

        if (room.isElectricityWaterCharged) {
            return { message: `Room ${roomNumber} has already been charged for electricity and water.` };
        }
        const { totalCost } = await calculateRoomCost(roomNumber);

        // Tạo hóa đơn thanh toán
        const payment = new Payment({
            description: `Tiền điện, nước tháng ${currentMonth}`,
            amount: totalCost,
            type: 'utilityFee',
            dueDate,
            paymentStatus: 'unpaid',
            studentId: roomNumber,
            paymentMethod: 'unknown',
        });

        await payment.save();
        room.oldElectricity = room.newElectricity;
        room.oldWater = room.newWater;
        room.isElectricityWaterCharged = true;
        await building.save();
        return { message: 'Utility payment created successfully.', payment };
    } catch (error) {
        console.error(error);
        return { message: 'Internal server error.', error: error.message };
    }
};


const calculateRoomCost = async (roomId) => {
    const prices = await getElectricityPrices();
    const { building, floor, room } = await findRoom(roomId);

    const electricityCost = calculateElectricityCost(room.newElectricity, room.oldElectricity, prices) * 1000;

    const waterCost = calculateWaterCost(room.newWater - room.oldWater);

    const totalCost = electricityCost + waterCost;

    // console.log(`Room: ${room.roomNumber}`);
    // console.log(`Electricity Cost: ${electricityCost.toFixed(2)} VND`);
    // console.log(`Water Cost: ${waterCost.toFixed(2)} VND`);
    // console.log(`Total Cost: ${totalCost.toFixed(2)} VND`);

    return { electricityCost, waterCost, totalCost };

};

const findRoom = async (roomName) => {
    const roomIdentifier = roomName;
    const [buildingKey, floorPart, roomPart] = roomIdentifier.match(/([A-Z])(\d+)\.(\d+)/).slice(1);
    const floorNumber = parseInt(floorPart);
    const roomNumber = `${buildingKey}${floorNumber}.${roomPart}`;

    const building = await Building.findOne({ key: buildingKey });
    if (!building) {
        throw new Error('Building does not exist');
    }

    const floor = building.floors.find(f => f.floorNumber === floorNumber);
    if (!floor) {
        throw new Error('Floor does not exist');
    }

    const room = floor.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) {
        throw new Error('Room does not exist');
    }

    return { building, floor, room };
};
const getElectricityPrices = async () => {
    const url = 'https://cskh.evnhcmc.vn/Tracuu/giabandien';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const priceTableRows = $('.table-giabandien tbody tr');

        const prices = {
            'Bậc 1': null,
            'Bậc 2': null,
            'Bậc 3': null,
            'Bậc 4': null,
            'Bậc 5': null,
            'Bậc 6': null,
        };

        priceTableRows.each((index, row) => {
            const cells = $(row).find('td');
            if (cells.length > 0) {
                const level = $(cells[0]).text().trim();
                const price = $(cells[2]).text().trim();

                if (level && price) {
                    switch (true) {
                        case level.includes("Bậc 1"):
                            prices['Bậc 1'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 2"):
                            prices['Bậc 2'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 3"):
                            prices['Bậc 3'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 4"):
                            prices['Bậc 4'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 5"):
                            prices['Bậc 5'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 6"):
                            prices['Bậc 6'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                    }
                }
            }
        });
        return prices;
    } catch (error) {
        console.error('Error fetching electricity prices:', error);
    }
};



const calculateWaterCost = (waterUsage) => {
    const waterPrice = 14400;
    return waterUsage * waterPrice;
};

const calculateElectricityCost = (newElectricity, oldElectricity, prices) => {
    let totalCost = 0;
    const usage = newElectricity - oldElectricity;
    if (usage > 0) {
        if (usage <= 50) {
            totalCost += usage * prices['Bậc 1'];
        } else if (usage <= 100) {
            totalCost += 50 * prices['Bậc 1'] + (usage - 50) * prices['Bậc 2'];
        } else if (usage <= 200) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + (usage - 100) * prices['Bậc 3'];
        } else if (usage <= 300) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + (usage - 200) * prices['Bậc 4'];
        } else if (usage <= 400) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + 100 * prices['Bậc 4'] + (usage - 300) * prices['Bậc 5'];
        } else {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + 100 * prices['Bậc 4'] + 100 * prices['Bậc 5'] + (usage - 400) * prices['Bậc 6'];
        }
    }

    return totalCost;
};

