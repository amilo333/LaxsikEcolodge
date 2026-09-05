const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPDATABLE_FIELDS = ["full_name", "email", "phone", "role", "status"];

export class AdminUserUpdateError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminUserUpdateError";
  }
}

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export const normalizeAdminUserUpdate = (body = {}) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AdminUserUpdateError("Invalid user data");
  }

  const update = {};

  if (hasOwn(body, "full_name")) {
    const fullName =
      typeof body.full_name === "string" ? body.full_name.trim() : "";
    if (fullName.length < 2 || fullName.length > 100) {
      throw new AdminUserUpdateError(
        "Full name must be between 2 and 100 characters",
      );
    }
    update.full_name = fullName;
  }

  if (hasOwn(body, "email")) {
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      throw new AdminUserUpdateError("Invalid email address");
    }
    update.email = email;
  }

  if (hasOwn(body, "phone")) {
    if (body.phone !== null && typeof body.phone !== "string") {
      throw new AdminUserUpdateError("Invalid phone number");
    }
    const phone = body.phone?.trim() || null;
    if (phone && phone.length > 30) {
      throw new AdminUserUpdateError(
        "Phone number must not exceed 30 characters",
      );
    }
    update.phone = phone;
  }

  if (hasOwn(body, "role")) {
    if (!["user", "admin"].includes(body.role)) {
      throw new AdminUserUpdateError("Invalid user role");
    }
    update.role = body.role;
  }

  if (hasOwn(body, "status")) {
    if (typeof body.status !== "boolean") {
      throw new AdminUserUpdateError("Invalid user status");
    }
    update.status = body.status;
  }

  if (!UPDATABLE_FIELDS.some((field) => hasOwn(update, field))) {
    throw new AdminUserUpdateError("No user fields to update");
  }

  return update;
};
