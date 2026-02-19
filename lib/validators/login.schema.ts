// lib/validators/register.schema.ts
import * as v from "valibot";

export const nameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Name is required"),
  v.minLength(2, "Name must be at least 2 characters"),
  v.regex(/^[A-Za-z\s'-]+$/, "Invalid characters in name")
);

export const phoneSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Phone number is required"),
  v.regex(/^[6-9]\d{9}$/, "Enter a valid phone number")
);

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
  v.regex(/[A-Z]/, "Must contain one uppercase letter"),
  v.regex(/[a-z]/, "Must contain one lowercase letter"),
  v.regex(/[0-9]/, "Must contain one number"),
  v.regex(/[^A-Za-z0-9]/, "Must contain one special character")
);

export const RegisterSchema = v.object({
  firstName: nameSchema,
  middleName: v.optional(
    v.union([
      v.literal(""),
      nameSchema,
    ])
  ),
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});
export const LoginSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
});
export const resetpassword = v.object({

  password: passwordSchema,
});