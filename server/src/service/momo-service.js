import crypto from "node:crypto";

const DEFAULT_MOMO_ENDPOINT =
  "https://test-payment.momo.vn/v2/gateway/api/create";
const MOMO_REQUEST_TYPE = "payWithMethod";
const MOMO_MIN_AMOUNT = 1_000;
const MOMO_MAX_AMOUNT = 50_000_000;

export class MomoServiceError extends Error {
  constructor(message, statusCode = 502, details = null) {
    super(message);
    this.name = "MomoServiceError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const requireMomoConfig = () => {
  const config = {
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    partnerCode: process.env.MOMO_PARTNER_CODE,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    ipnUrl: process.env.MOMO_IPN_URL,
    endpoint: process.env.MOMO_ENDPOINT || DEFAULT_MOMO_ENDPOINT,
    partnerName: process.env.MOMO_PARTNER_NAME || "Laxsik Ecolodge",
    storeId: process.env.MOMO_STORE_ID || "LaxsikEcolodge",
  };

  const missingKeys = [
    ["MOMO_ACCESS_KEY", config.accessKey],
    ["MOMO_SECRET_KEY", config.secretKey],
    ["MOMO_PARTNER_CODE", config.partnerCode],
    ["MOMO_REDIRECT_URL", config.redirectUrl],
    ["MOMO_IPN_URL", config.ipnUrl],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new MomoServiceError(
      `Missing MoMo configuration: ${missingKeys.join(", ")}`,
      500,
    );
  }

  return config;
};

const createHmacSignature = (rawSignature, secretKey) =>
  crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

const safeSignatureEquals = (providedSignature, expectedSignature) => {
  if (
    typeof providedSignature !== "string" ||
    providedSignature.length !== expectedSignature.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(providedSignature, "utf8"),
    Buffer.from(expectedSignature, "utf8"),
  );
};

export const createMomoPayment = async ({
  bookingId,
  bookingCode,
  totalAmount,
  customerInfo,
}) => {
  const config = requireMomoConfig();
  const amount = Math.round(Number(totalAmount));

  if (
    !Number.isSafeInteger(amount) ||
    amount < MOMO_MIN_AMOUNT ||
    amount > MOMO_MAX_AMOUNT
  ) {
    throw new MomoServiceError(
      `MoMo amount must be an integer from ${MOMO_MIN_AMOUNT.toLocaleString(
        "en-US",
      )} to ${MOMO_MAX_AMOUNT.toLocaleString("en-US")} VND`,
      400,
    );
  }

  const timestamp = Date.now();
  const orderId = `${bookingCode}-${timestamp}`;
  const requestId = orderId;
  const orderInfo = `Payment for booking ${bookingCode}`;
  const extraData = Buffer.from(JSON.stringify({ bookingId })).toString(
    "base64",
  );
  const rawSignature =
    `accessKey=${config.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${config.ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${config.partnerCode}` +
    `&redirectUrl=${config.redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${MOMO_REQUEST_TYPE}`;
  const signature = createHmacSignature(rawSignature, config.secretKey);
  const requestBody = {
    partnerCode: config.partnerCode,
    partnerName: config.partnerName,
    storeId: config.storeId,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: "vi",
    requestType: MOMO_REQUEST_TYPE,
    autoCapture: true,
    extraData,
    orderGroupId: "",
    signature,
    userInfo: {
      name: customerInfo.fullNameContact,
      phoneNumber: customerInfo.phoneContact,
      email: customerInfo.emailContact,
    },
  };

  let response;

  try {
    response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new MomoServiceError(
      error.name === "TimeoutError"
        ? "MoMo payment request timed out"
        : "Unable to connect to MoMo payment gateway",
    );
  }

  let gatewayResponse;

  try {
    gatewayResponse = await response.json();
  } catch {
    throw new MomoServiceError("MoMo returned an invalid response");
  }

  if (
    !response.ok ||
    Number(gatewayResponse.resultCode) !== 0 ||
    !gatewayResponse.payUrl
  ) {
    throw new MomoServiceError(
      gatewayResponse.message || "MoMo could not create the payment",
      response.ok ? 400 : 502,
      gatewayResponse,
    );
  }

  return {
    amount,
    orderId,
    requestId,
    payUrl: gatewayResponse.payUrl,
    deeplink: gatewayResponse.deeplink ?? null,
    qrCodeUrl: gatewayResponse.qrCodeUrl ?? null,
    response: gatewayResponse,
  };
};

export const verifyMomoResultSignature = (payload) => {
  const config = requireMomoConfig();
  const rawSignature =
    `accessKey=${config.accessKey}` +
    `&amount=${payload.amount}` +
    `&extraData=${payload.extraData ?? ""}` +
    `&message=${payload.message ?? ""}` +
    `&orderId=${payload.orderId}` +
    `&orderInfo=${payload.orderInfo ?? ""}` +
    `&orderType=${payload.orderType ?? ""}` +
    `&partnerCode=${payload.partnerCode}` +
    `&payType=${payload.payType ?? ""}` +
    `&requestId=${payload.requestId}` +
    `&responseTime=${payload.responseTime}` +
    `&resultCode=${payload.resultCode}` +
    `&transId=${payload.transId}`;
  const expectedSignature = createHmacSignature(rawSignature, config.secretKey);

  return (
    payload.partnerCode === config.partnerCode &&
    safeSignatureEquals(payload.signature, expectedSignature)
  );
};
