import assert from "node:assert/strict";
import crypto from "node:crypto";
import { test } from "node:test";
import qs from "qs";

import Booking from "../src/models/Booking.js";
import Payment from "../src/models/Payment.js";
import {
  createVnpayPayment,
  vnpayIpn,
} from "../src/controllers/vnpay-controller.js";
import { getDepositAmount } from "../src/utils/deposit.js";
import { updateBookingAdmin } from "../src/controllers/booking-controller.js";

const makeResponse = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("rounds the online deposit to whole VND and leaves the balance", () => {
  assert.equal(getDepositAmount(1_001), 501);
  assert.equal(1_001 - getDepositAmount(1_001), 500);
});

test("older paid bookings keep their historical paid amount fallback", () => {
  const booking = Booking.hydrate({ totalAmount: 1_001, paymentStatus: "paid" });
  assert.equal(booking.paidAmount, undefined);
});

test("creates a VNPay transaction for only the booking deposit", async () => {
  const originalFindOne = Booking.findOne;
  const originalCreate = Payment.create;
  const previousEnv = {
    VNP_TMN_CODE: process.env.VNP_TMN_CODE,
    VNP_HASH_SECRET: process.env.VNP_HASH_SECRET,
    VNP_URL: process.env.VNP_URL,
    VNP_RETURN_URL: process.env.VNP_RETURN_URL,
  };
  const booking = {
    _id: "booking-1",
    userId: "user-1",
    bookingCode: "BOOK-1",
    bookingStatus: "pending",
    paymentStatus: "unpaid",
    totalAmount: 1_001,
    depositAmount: 501,
    async save() {},
  };
  let createdPayment;

  try {
    process.env.VNP_TMN_CODE = "TEST";
    process.env.VNP_HASH_SECRET = "test-secret";
    process.env.VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    process.env.VNP_RETURN_URL = "https://example.com/return";
    Booking.findOne = async () => booking;
    Payment.create = async (payment) => {
      createdPayment = payment;
      return { _id: "payment-1" };
    };

    const response = makeResponse();
    await createVnpayPayment(
      {
        user: { _id: "user-1" },
        body: { bookingId: booking._id },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      },
      response,
    );

    assert.equal(response.statusCode, 200);
    assert.equal(createdPayment.amount, 501);
    assert.equal(response.body.data.amount, 501);
    assert.equal(new URL(response.body.data.payUrl).searchParams.get("vnp_Amount"), "50100");
    assert.equal(booking.paymentStatus, "pending");
  } finally {
    Booking.findOne = originalFindOne;
    Payment.create = originalCreate;
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

for (const scenario of [
  { name: "new deposit", amount: 501, status: "deposit_paid" },
  { name: "older full payment", amount: 1_001, status: "paid" },
]) {
  test(`a verified ${scenario.name} records only the amount collected`, async () => {
    const originalFindOne = Payment.findOne;
    const originalFindById = Booking.findById;
    const originalFindOneAndUpdate = Booking.findOneAndUpdate;
    const previousSecret = process.env.VNP_HASH_SECRET;
    const payment = {
      bookingId: "booking-1",
      amount: scenario.amount,
      paymentStatus: "pending",
      async save() {},
    };
    let bookingUpdate;

    try {
      process.env.VNP_HASH_SECRET = "test-secret";
      Payment.findOne = async () => payment;
      Booking.findById = async () => ({ _id: "booking-1", totalAmount: 1_001 });
      Booking.findOneAndUpdate = async (filter, update) => {
        bookingUpdate = { filter, update };
      };

      const params = {
        vnp_TxnRef: "VNP-1",
        vnp_Amount: String(scenario.amount * 100),
        vnp_ResponseCode: "00",
        vnp_TransactionStatus: "00",
        vnp_TransactionNo: "TXN-1",
      };
      const sorted = Object.fromEntries(
        Object.keys(params)
          .sort()
          .map((key) => [
            key,
            encodeURIComponent(params[key]).replace(/%20/g, "+"),
          ]),
      );
      const signature = crypto
        .createHmac("sha512", process.env.VNP_HASH_SECRET)
        .update(Buffer.from(qs.stringify(sorted, { encode: false }), "utf-8"))
        .digest("hex");

      const response = makeResponse();
      await vnpayIpn(
        { query: { ...params, vnp_SecureHash: signature } },
        response,
      );

      assert.equal(response.body.RspCode, "00");
      assert.equal(payment.paymentStatus, "success");
      assert.equal(bookingUpdate.update.paymentStatus, scenario.status);
      assert.equal(bookingUpdate.update.paidAmount, scenario.amount);
      assert.equal(bookingUpdate.update.bookingStatus, "confirmed");
      assert.deepEqual(
        bookingUpdate.filter.paymentStatus.$in,
        scenario.status === "paid"
          ? ["unpaid", "pending", "failed", "deposit_paid"]
          : ["unpaid", "pending", "failed"],
      );
    } finally {
      Payment.findOne = originalFindOne;
      Booking.findById = originalFindById;
      Booking.findOneAndUpdate = originalFindOneAndUpdate;
      if (previousSecret === undefined) delete process.env.VNP_HASH_SECRET;
      else process.env.VNP_HASH_SECRET = previousSecret;
    }
  });
}

test("admin can record the balance collected at the resort", async () => {
  const originalFindById = Booking.findById;
  const booking = {
    _id: "booking-1",
    bookingStatus: "confirmed",
    paymentStatus: "deposit_paid",
    totalAmount: 1_001,
    depositAmount: 501,
    paidAmount: 501,
    async save() {},
    async populate() {
      return this;
    },
  };

  try {
    Booking.findById = async () => booking;
    const response = makeResponse();
    await updateBookingAdmin(
      { params: { id: booking._id }, body: { paymentStatus: "paid" } },
      response,
    );

    assert.equal(response.statusCode, 200);
    assert.equal(booking.paymentStatus, "paid");
    assert.equal(booking.paidAmount, 1_001);
  } finally {
    Booking.findById = originalFindById;
  }
});
