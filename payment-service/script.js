const qs = require('qs');
const crypto = require('crypto');

const sortedParams = {
    vnp_Amount: '550000000',
    vnp_Command: 'pay',
    vnp_CreateDate: '20241128160226',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '192.168.0.105',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Pay',
    vnp_OrderType: 'billpayment',
    vnp_ReturnUrl: 'http://localhost:6000/payments/handleVnpayCallback',
    vnp_TmnCode: 'BHVETB91',
    vnp_TxnRef: '67458f9b2510f8f6395b70a7',
    vnp_Version: '2.1.0'
};

const signData = qs.stringify(sortedParams, { encode: false });
const hashSecret = '91L94C9K0KVHUQU8QABHLSCGVZHPDDRJ'; // Replace with your secret
const hmac = crypto.createHmac('sha512', hashSecret);
const computedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('Computed Secure Hash:', computedHash);
