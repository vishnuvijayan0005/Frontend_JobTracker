// lib/validators/login.schema.ts
import * as v from "valibot";

const emailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Email is required"),
  v.email("Enter a valid email address")
);

const passwordSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Password is required"),
  v.minLength(8, "Password must be at least 8 characters"),
  v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  v.regex(/[0-9]/, "Password must contain at least one number"),
  v.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
);

export const LoginSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
});
