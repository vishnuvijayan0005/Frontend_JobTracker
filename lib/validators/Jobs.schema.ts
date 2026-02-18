import * as v from "valibot";

/* ================= HELPERS ================= */

const nonEmptyString = (msg = "This field is required") =>
  v.pipe(v.string(), v.trim(), v.nonEmpty(msg));

const optionalText = v.optional(v.pipe(v.string(), v.trim()));

/* ================= SCHEMA ================= */

export const JobSchema = v.object({
  title: nonEmptyString("Job title is required"),

  description: nonEmptyString("Job description is required"),

  location: nonEmptyString("Location is required"),

  jobType: v.picklist(["Full-time", "Part-time", "Internship", "Contract"]),

  jobMode: v.picklist(["Remote", "Onsite", "Hybrid", "Field Based"]),

  seniorityLevel: v.picklist(["Junior", "Mid", "Senior", "Lead"]),

  salary: optionalText,

  requirements: optionalText,

  qualifications: optionalText,

  interviewProcess: optionalText,

  experience: optionalText,

  benefits: v.array(v.string()),

  skills: v.pipe(
    v.array(v.string()),
    v.minLength(1, "At least one skill is required")
  ),

  tags: v.array(v.string()),
});
