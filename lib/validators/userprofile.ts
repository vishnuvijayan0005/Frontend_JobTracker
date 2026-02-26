import * as v from "valibot";

/* ================= BASIC ================= */

export const nameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("This field is required"),
  v.minLength(2, "Must be at least 2 characters"),
  v.regex(/^[A-Za-z\s'-]+$/, "Invalid characters")
);

export const phoneSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Phone number is required"),
  v.regex(/^[6-9]\d{9}$/, "Enter a valid phone number")
);



export const locationSchema = v.object({
  city: v.pipe(v.string(), v.trim(), v.nonEmpty("City is required")),
  state: v.pipe(v.string(), v.trim(), v.nonEmpty("State is required")),
  country: v.pipe(v.string(), v.trim(), v.nonEmpty("Country is required")),
});

const urlSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("URL cannot be empty"),
  v.url("Enter a valid URL (include https://)")
);

export const socialsSchema = v.object({
  linkedin: urlSchema,
  github: urlSchema,
  portfolio: urlSchema,
  twitter: urlSchema,
});


export const UserProfileSchema = v.object({
  firstName: nameSchema,

  middleName: v.optional(
    v.union([v.literal(""), nameSchema]) 
  ),

  lastName: nameSchema,

  phone: phoneSchema,

  location: locationSchema,

  headline: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Headline is required"),
    v.maxLength(120)
  ),

  bio: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Bio is required"),
    v.maxLength(500)
  ),

skills: v.pipe(
  v.array(
    v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty("Skill cannot be empty"),
      v.minLength(1, "Skill must be at least 1 characters")
    )
  ),
  v.minLength(1, "At least one skill is required")
),

  experience: v.pipe(
    v.number(),
    v.minValue(0, "Experience cannot be negative"),
    v.maxValue(50, "Experience cannot exceed 50 years")
  ),

  gender: v.picklist(["male", "female", "other"]),

  education: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Education is required")
  ),

  socials: socialsSchema,
});
