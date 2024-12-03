const mongoose = require('mongoose');
const Contract = require('./models/Contract'); // Thay đường dẫn này thành đường dẫn tới model Contract
const Registration = require('./models/Registration'); // Thay đường dẫn này thành đường dẫn tới model Registration

// Hàm sinh contractNumber ngẫu nhiên
const generateContractNumber = async () => {
    let contractNumber;
    let isUnique = false;

    do {
        contractNumber = Math.random().toString(36).substring(2, 10).toUpperCase(); // Sinh số và chữ ngẫu nhiên
        const existingContract = await Contract.findOne({ contractNumber });
        isUnique = !existingContract;
    } while (!isUnique);

    return contractNumber;
};

// Lấy startDate và endDate dựa trên description
const getDatesFromDescription = (description) => {
    const academicYearMatch = description.match(/Năm học (\d{4})-(\d{4})/);
    if (academicYearMatch) {
        const startYear = academicYearMatch[1]; // Lấy năm bắt đầu
        const endYear = academicYearMatch[2];   // Lấy năm kết thúc
        return {
            startDate: new Date(`${startYear}-08-01`),
            endDate: new Date(`${endYear}-05-30`),
        };
    }

    // Xử lý mô tả dạng "2 tháng hè xxxx"
    const summerMatch = description.match(/2 tháng hè (\d{4})/);
    if (summerMatch) {
        const year = summerMatch[1]; // Lấy năm
        return {
            startDate: new Date(`${year}-06-01`),
            endDate: new Date(`${year}-07-30`),
        };
    }

    throw new Error(`Unsupported description format: ${description}`);
};

// Hàm tạo hợp đồng
const createContracts = async () => {
    try {
        await mongoose.connect(''); // Thay đổi URI của database của bạn

        const registrations = await Registration.find({ status: 'inactive' });
        await Contract.deleteMany();
        for (const registration of registrations) {
            const { startDate, endDate } = getDatesFromDescription(registration.description);

            for (const application of registration.applications) {
                const contractNumber = await generateContractNumber();

                const newContract = new Contract({
                    contractNumber,
                    startDate,
                    endDate,
                    status: 'inactive',
                    attachment: 'https://vgu.edu.vn/documents/48694/2370092/20160616_hop_dong_ktx.pdf/6521a7a5-17eb-46d2-870f-3e33259405ee',
                    studentId: application.studentId,
                });

                await newContract.save();
                console.log(`Contract created for application with studentId: ${application.studentId}`);
            }
        }

        console.log('All contracts created successfully.');
    } catch (error) {
        console.error('Error creating contracts:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Thực thi hàm
createContracts();
