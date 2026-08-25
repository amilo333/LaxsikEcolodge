import crypto from "crypto";
import qs from "qs";
import moment from "moment";

import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

// ======================================
// Sort params theo yêu cầu VNPay
// ======================================

const sortObject = (obj) => {
  const sorted = {};

  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
};

// ======================================
// Get IP
// ======================================

const getIpAddress = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection?.remoteAddress ||
    "127.0.0.1";

  if (typeof ip === "string" && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (typeof ip === "string") {
    return ip.replace("::ffff:", "");
  }

  return "127.0.0.1";
};

// ======================================
// CREATE VNPAY PAYMENT
// ======================================

export const createVnpayPayment = async (req, res) => {
  try {
    console.log(req.user._id);
    const userId = req.user._id;

    const { bookingId, bankCode } = req.body;

    // ======================================
    // 1. Kiểm tra booking
    // ======================================

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        message: "Booking has been cancelled",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Booking has already been paid",
      });
    }

    // ======================================
    // 2. VNPay config
    // ======================================

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      return res.status(500).json({
        message: "VNPAY configuration is missing",
      });
    }

    // ======================================
    // 3. Thời gian
    // ======================================

    const date = new Date();

    const createDate = moment(date).utcOffset(7).format("YYYYMMDDHHmmss");

    // ======================================
    // 4. Tạo mã giao dịch
    // ======================================

    const orderId = `VNP${Date.now()}`;

    // QUAN TRỌNG:
    // lấy từ Booking DB
    const amount = Math.round(booking.totalAmount);

    const ipAddr = getIpAddress(req);

    // ======================================
    // 5. Tạo Payment
    // ======================================

    const payment = await Payment.create({
      bookingId: booking._id,

      userId: booking.userId,

      providerOrderId: orderId,

      amount,

      paymentMethod: "vnpay",

      paymentStatus: "pending",
    });

    // ======================================
    // 6. Tạo VNPay params
    // ======================================

    let vnpParams = {};

    vnpParams["vnp_Version"] = "2.1.0";

    vnpParams["vnp_Command"] = "pay";

    vnpParams["vnp_TmnCode"] = tmnCode;

    vnpParams["vnp_Locale"] = "vn";

    vnpParams["vnp_CurrCode"] = "VND";

    vnpParams["vnp_TxnRef"] = orderId;

    vnpParams["vnp_OrderInfo"] = `Thanh toan booking ${booking.bookingCode}`;

    vnpParams["vnp_OrderType"] = "other";

    // VNPay yêu cầu amount * 100
    vnpParams["vnp_Amount"] = amount * 100;

    vnpParams["vnp_ReturnUrl"] = returnUrl;

    vnpParams["vnp_IpAddr"] = ipAddr;

    vnpParams["vnp_CreateDate"] = createDate;

    // Cho phép chọn ngân hàng cụ thể
    if (bankCode) {
      vnpParams["vnp_BankCode"] = bankCode;
    }

    // ======================================
    // 7. Sort params
    // ======================================

    vnpParams = sortObject(vnpParams);

    // ======================================
    // 8. Tạo chữ ký
    // ======================================

    const signData = qs.stringify(vnpParams, {
      encode: false,
    });

    const hmac = crypto.createHmac("sha512", secretKey);

    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams["vnp_SecureHash"] = signed;

    // ======================================
    // 9. URL thanh toán
    // ======================================

    vnpUrl +=
      "?" +
      qs.stringify(vnpParams, {
        encode: false,
      });

    // ======================================
    // 10. Update booking
    // ======================================

    booking.paymentStatus = "pending";
    booking.paymentMethod = "vnpay";

    await booking.save();

    // ======================================
    // 11. Response
    // ======================================

    return res.status(200).json({
      message: "Create VNPay payment successfully",

      data: {
        paymentId: payment._id,

        bookingId: booking._id,

        orderId,

        amount,

        payUrl: vnpUrl,
      },
    });
  } catch (error) {
    console.error("Create VNPay payment error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
// ======================================
// VNPAY RETURN
// ======================================

export const vnpayReturn = async (req, res) => {
  try {
    let vnpParams = {
      ...req.query,
    };

    // Chữ ký VNPay gửi về
    const secureHash = vnpParams["vnp_SecureHash"];

    // Xóa SecureHash trước khi tạo lại chữ ký
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    // Sort params giống lúc tạo payment
    vnpParams = sortObject(vnpParams);

    const secretKey = process.env.VNP_HASH_SECRET;

    const signData = qs.stringify(vnpParams, {
      encode: false,
    });

    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    // ======================================
    // 1. Kiểm tra chữ ký
    // ======================================

    if (secureHash !== signed) {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-result?provider=vnpay&status=invalid&code=97`,
      );
    }

    // ======================================
    // 2. Lấy kết quả thanh toán
    // ======================================

    const orderId = vnpParams["vnp_TxnRef"];

    const responseCode = vnpParams["vnp_ResponseCode"];

    const transactionStatus = vnpParams["vnp_TransactionStatus"];

    const success = responseCode === "00" && transactionStatus === "00";

    // ======================================
    // 3. Redirect về frontend React
    // ======================================

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-result` +
        `?provider=vnpay` +
        `&orderId=${orderId}` +
        `&status=${success ? "success" : "failed"}` +
        `&code=${responseCode}`,
    );
  } catch (error) {
    console.error("VNPay return error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
// ======================================
// VNPAY IPN
// ======================================

export const vnpayIpn = async (req, res) => {
  try {
    let vnpParams = {
      ...req.query,
    };

    const secureHash = vnpParams["vnp_SecureHash"];

    const orderId = vnpParams["vnp_TxnRef"];

    const responseCode = vnpParams["vnp_ResponseCode"];

    const transactionStatus = vnpParams["vnp_TransactionStatus"];

    const transactionNo = vnpParams["vnp_TransactionNo"];

    const amount = Number(vnpParams["vnp_Amount"]);

    // ======================================
    // 1. Verify signature
    // ======================================

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, {
      encode: false,
    });

    const signed = crypto
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash !== signed) {
      return res.status(200).json({
        RspCode: "97",
        Message: "Checksum failed",
      });
    }

    // ======================================
    // 2. Tìm Payment
    // ======================================

    const payment = await Payment.findOne({
      providerOrderId: orderId,
    });

    if (!payment) {
      return res.status(200).json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    // ======================================
    // 3. Kiểm tra amount
    // ======================================

    if (payment.amount * 100 !== amount) {
      return res.status(200).json({
        RspCode: "04",
        Message: "Amount invalid",
      });
    }

    // ======================================
    // 4. Đã xử lý rồi
    // ======================================

    if (
      payment.paymentStatus === "success" ||
      payment.paymentStatus === "failed"
    ) {
      return res.status(200).json({
        RspCode: "02",
        Message: "This order has been updated",
      });
    }

    // ======================================
    // 5. Lưu response VNPay
    // ======================================

    payment.gatewayResponse = req.query;

    payment.transactionCode = transactionNo || null;

    // ======================================
    // 6. Thanh toán thành công
    // ======================================

    if (responseCode === "00" && transactionStatus === "00") {
      payment.paymentStatus = "success";
      payment.paidAt = new Date();

      await payment.save();

      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentStatus: "paid",

        paymentMethod: "vnpay",

        bookingStatus: "confirmed",
      });

      return res.status(200).json({
        RspCode: "00",
        Message: "Success",
      });
    }

    // ======================================
    // 7. Thanh toán thất bại
    // ======================================

    payment.paymentStatus = "failed";

    await payment.save();

    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: "failed",
    });

    return res.status(200).json({
      RspCode: "00",
      Message: "Success",
    });
  } catch (error) {
    console.error("VNPay IPN error:", error);

    return res.status(200).json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
};
