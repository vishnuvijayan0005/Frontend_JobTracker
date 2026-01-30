import {
  object,
  string,
  pipe,
  minLength,
  nonEmpty,
  regex,
  email,
} from "valibot";

export const CompanyRegisterSchema = object({
  companyName: pipe(
    string(),
    nonEmpty("Company name is required"),
    minLength(2, "Company name must be at least 2 characters")
  ),

  companyLocation: pipe(
    string(),
    nonEmpty("Company location is required"),
    minLength(2, "Location must be at least 2 characters")
  ),

  category: pipe(
    string(),
    nonEmpty("Category is required")
  ),

  phone: pipe(
    string(),
    nonEmpty("Phone number is required"),
    regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits")
  ),

  website: pipe(
    string(),
    regex(/^$|https?:\/\/.+/, "Enter a valid website URL")
  ),

  email: pipe(
    string(),
    nonEmpty("Email is required"),
    email("Enter a valid email address")
  ),

  password: pipe(
    string(),
    nonEmpty("Password is required"),
    minLength(8, "Password must be at least 8 characters"),
    regex(/[A-Z]/, "Password must contain an uppercase letter"),
    regex(/[a-z]/, "Password must contain a lowercase letter"),
    regex(/[0-9]/, "Password must contain a number"),
    regex(/[^A-Za-z0-9]/, "Password must contain a special character")
  ),
});
