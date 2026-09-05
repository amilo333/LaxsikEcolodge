import assert from "node:assert/strict";
import test from "node:test";

import {
  AdminUserUpdateError,
  normalizeAdminUserUpdate,
} from "../src/service/admin-user-update.js";

test("normalizes every editable admin user field", () => {
  assert.deepEqual(
    normalizeAdminUserUpdate({
      full_name: "  Nguyễn Văn An  ",
      email: "  AN@EXAMPLE.COM ",
      phone: "  0901234567 ",
      role: "admin",
      status: false,
      password: "must-not-be-updated",
    }),
    {
      full_name: "Nguyễn Văn An",
      email: "an@example.com",
      phone: "0901234567",
      role: "admin",
      status: false,
    },
  );
});

test("allows an administrator to clear an optional phone number", () => {
  assert.deepEqual(normalizeAdminUserUpdate({ phone: "  " }), { phone: null });
  assert.deepEqual(normalizeAdminUserUpdate({ phone: null }), { phone: null });
});

test("rejects invalid field values instead of coercing them", () => {
  const invalidUpdates = [
    null,
    [],
    {},
    { full_name: "A" },
    { email: "not-an-email" },
    { phone: 123 },
    { role: "owner" },
    { status: "false" },
  ];

  for (const update of invalidUpdates) {
    assert.throws(() => normalizeAdminUserUpdate(update), AdminUserUpdateError);
  }
});

test("ignores fields that administrators are not allowed to edit", () => {
  assert.throws(
    () =>
      normalizeAdminUserUpdate({
        password: "new-password",
        google_id: "new-id",
      }),
    /No user fields to update/,
  );
});
