import { z } from "zod";

export const makeFullName = ({ firstName, middleName, lastName }) =>
  [firstName, middleName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

const nameRule = z
  .string()
  .trim()
  .min(2, "Must contain at least 2 characters")
  .max(50, "Must not exceed 50 characters")
  .regex(
    /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
    "Only letters and spaces are allowed",
  );

const optionalNameRule = z
  .string()
  .trim()
  .max(50, "Must not exceed 50 characters")
  .refine(
    (value) =>
      value === "" ||
      (value.length >= 2 && /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)),
    "Use 2–50 letters only",
  );

export const userSchema = z.object({
  // First Name
  firstName: nameRule,

  // Middle Name - optional
  middleName: optionalNameRule,

  // Last Name - optional
  lastName: optionalNameRule,

  // Email
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  // Password
  password: z.string().min(8, "Password must contain at least 8 characters"),

  // Occupation
  occupation: z.string().min(1, "Please select an occupation"),

  // Country
  country: z.string().min(1, "Please select a country"),

  // Phone
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),

  // Address
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address is too long"),
});
