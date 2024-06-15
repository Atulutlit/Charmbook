const { tables } = require("../db/index");
const config = require("../constant");
const error = require("../error.js");
const jwt = require("jsonwebtoken");

const FCM = require("push-fcm");
// const { notificationModel } = require("../module/master/notification/model/notificationModel");
// const fcm = new FCM(config.fcmServerKey);

const createOTP = () => {
  const randomNumber = Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');

  const otp = config.DUMMY_OTP || randomNumber;
  return otp
}

const sendOtp = async (user) => {

  const findOtp = await tables.Otp.findOne({ where: { user_id: user.id } });
  
  const otp = createOTP()

  if (!findOtp) {
    await tables.Otp.create({ user_id: user.id, otp: otp, expires_at: Date.now() + 300000 });
  } else {
    await tables.Otp.update({ otp: otp, expires_at: Date.now() + 300000 }, { where: { user_id: user.id }, raw: true });
  }
}

const createToken = async (user) => {
  const token = jwt.sign({ id: user.id, }, config.USER_TOKEN_KEY, { expiresIn: "30d" });
  if (!token) throw error.SERVER_ERROR();
  return token;
}


const generateEnrollmentNumber = () => {
  const timestamp = new Date().getTime().toString(); 
  const enrollmentNumber = 'CB' + timestamp.slice(-6); 
  return enrollmentNumber;
};


function findDatesBetween(start_date, end_date) {
  const dates = [];

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {

    if (currentDate.getDay() !== 0) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function isSunday(today) {
  const currentDate = new Date(today);
  return currentDate.getDay() === 6; 
}


const fcmNotification = async function (title, body, url, deviceToken, notificationBy, req, data) {
//     const { userData } = req;
//     let message = {
//         to: deviceToken,
//         notification: {
//             title: title,
//             body: body,
//             //image: image,
//             // sound: "default",
//             url: url || ""
//         },
//         data: {  //you can send only notification or only data(or include both)
//             my_key: 'my value',
//             my_another_key: 'my another value'
//         },
//         // content_available: true  
//     };
//     const fcmData = await fcm.send(message);
//     if (fcmData) {
//         console.log("Successfully sent with response: ", fcmData);
//         const notificationData = {
//             userId: userData.userId,
//             userName: userData.name || '',
//             ...(data.orderId && { orderId: data.orderId }),
//             ...(data.menuOrderId && { menuOrderId: data.menuOrderId }),
//             ...(data.tableId && { tableId: data.tableId }),
//             ...(data.voucherOrderId && { voucherOrderId: data.voucherOrderId }),
//             ...(data.roomOrderId && { roomOrderId: data.roomOrderId }),
//             title,
//             body,
//             url,
//             notificationBy: notificationBy.toUpperCase(),
//             response: fcmData
//         }
//         const addNotification = notificationModel.create(notificationData)
//     } else {
//         console.log("Something has gone wrong!", err);
//     }
}

module.exports = { sendOtp, createToken, generateEnrollmentNumber, findDatesBetween ,isSunday, fcmNotification}