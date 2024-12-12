const axios = require('axios');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const cloudinary = require('cloudinary').v2;
const fontkit = require('@pdf-lib/fontkit');
const Student = require('../database/models/Student');
const os = require('os');
const path = require('path');

cloudinary.config({
    cloud_name: 'dwu4fcnse',
    api_key: '949445116215179',
    api_secret: 'CoxZM60DA3dxEyXCGZ6h26tF0ps'
});


async function editAndUploadPDF(student, payment, startDate, endDate) {
    try {
        const pdfUrl = 'https://res.cloudinary.com/dwu4fcnse/image/upload/v1733843961/contract/n25ad2chostxmtql4nrs.pdf';

        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBytes = response.data;

        // const fontBytes = fs.readFileSync('../font/Roboto-Regular.ttf');
        const fontBytes = fs.readFileSync('/app/font/Roboto-Regular.ttf');

        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.registerFontkit(fontkit);

        const font = await pdfDoc.embedFont(fontBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const { height } = firstPage.getSize();

        const { day: Sday, month: Smonth, year: Syear } = formatDate(startDate);
        const { day: Eday, month: Emonth, year: Eyear } = formatDate(endDate);

        firstPage.drawText(student.name, { x: 230, y: height - 390, size: 10, font: font, olor: rgb(0, 0, 0), });
        firstPage.drawText(student.studentId, { x: 470, y: height - 390, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(student.className, { x: 110, y: height - 405, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(student.phoneNumber, { x: 110, y: height - 420, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(student.email, { x: 310, y: height - 420, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(student.address, { x: 210, y: height - 435, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(student.roomName, { x: 70, y: height - 520, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Sday.toString(), { x: 330, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Smonth.toString(), { x: 350, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Syear.toString(), { x: 375, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Eday.toString(), { x: 460, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Emonth.toString(), { x: 480, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });
        firstPage.drawText(Eyear.toString(), { x: 502, y: height - 622, size: 10, font: font, color: rgb(0, 0, 0), });

        const { day: Dday, month: Dmonth, year: Dyear } = formatDate(payment.dueDate);
        const formattedAmount = payment.amount.toLocaleString('vi-VN');
        secondPage.drawText(formattedAmount, { x: 120, y: height - 198, size: 10, font: font, color: rgb(0, 0, 0), });

        secondPage.drawText(Dday.toString(), { x: 338, y: height - 198, size: 10, font: font, color: rgb(0, 0, 0), });
        secondPage.drawText(Dmonth.toString(), { x: 358, y: height - 198, size: 10, font: font, color: rgb(0, 0, 0), });
        secondPage.drawText(Dyear.toString(), { x: 383, y: height - 198, size: 10, font: font, color: rgb(0, 0, 0), });

        const modifiedPdfBytes = await pdfDoc.save();
        // const tempFilePath = './modified-contract.pdf';
        // fs.writeFileSync(tempFilePath, modifiedPdfBytes);
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, 'modified-contract.pdf');
        fs.writeFileSync(tempFilePath, modifiedPdfBytes);
        
        const result = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: 'raw',
            folder: 'contract',
        });
        return result.secure_url;
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}
function formatDate(date) {
    if (!(date instanceof Date)) {
        throw new Error('Input must be a Date object');
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year }
}
module.exports = { editAndUploadPDF };
