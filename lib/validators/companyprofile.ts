import * as v from "valibot";

export const companySchema = v.object({
  companyName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Company name is required"),
    v.minLength(2, "Company name must be at least 2 characters"),
  ),

  Companylocation: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Location is required"),
  ),

  Companytype: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Industry is required"),
  ),

  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Email is required"),
    v.email("Enter a valid email"),
  ),

  phone: v.pipe(
    v.number(),
    v.minValue(6000000000, "Enter a valid phone number"),
    v.maxValue(9999999999, "Enter a valid phone number"),
  ),

  siteId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Website is required"),
    v.url("Enter a valid URL (https://...)"),
  ),

  description: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Description is required"),
    v.minLength(10, "Description must be at least 10 characters"),
  ),
});
