import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

// ==========================================
// 1. ZOD VALIDATION SCHEMA
// ==========================================
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .or(z.literal("")), // Allows empty string handling if optional in edit mode
  occupation: z.string().min(1, "Occupation is required"),
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  address: z.string().min(1, "Address is required").trim(),
});

// ==========================================
// 2. REUSABLE FORM INPUT COMPONENT
// ==========================================
const FormInput = ({
  label,
  name,
  register,
  error,
  type = "text",
  required = false,
  maxLength,
  onChangeCustom,
}) => {
  const { onChange, ...restRegister } = register(name);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        maxLength={maxLength}
        {...restRegister}
        onChange={(e) => {
          if (onChangeCustom) {
            onChangeCustom(e);
          }
          onChange(e);
        }}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  );
};

// ==========================================
// 3. MAIN ADD / EDIT USER COMPONENT
// ==========================================
export default function AddUser({ userReport = [], onSaveUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      occupation: "",
      country: "",
      phone: "",
      address: "",
    },
  });

  // Handle Mode Shifts & Pre-populating Existing Data
  useEffect(() => {
    if (isEditMode) {
      const existingUser = userReport.find(
        (user) => String(user.id) === String(editId)
      );
      if (existingUser) {
        reset(existingUser);
      } else {
        navigate("/", { replace: true });
      }
    } else {
      reset({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        occupation: "",
        country: "",
        phone: "",
        address: "",
      });
    }
  }, [editId, isEditMode, userReport, reset, navigate]);

  // Form Submission & Duplicate Validation
  const onSubmit = (data) => {
    // 1. Check for duplicate email
    const isDuplicateEmail = userReport.some(
      (user) =>
        user.email.toLowerCase() === data.email.toLowerCase() &&
        String(user.id) !== String(editId)
    );

    if (isDuplicateEmail) {
      setError("email", {
        type: "manual",
        message: "This email is already in use.",
      });
      return;
    }

    // 2. Check for duplicate phone
    const isDuplicatePhone = userReport.some(
      (user) => user.phone === data.phone && String(user.id) !== String(editId)
    );

    if (isDuplicatePhone) {
      setError("phone", {
        type: "manual",
        message: "This phone number is already registered.",
      });
      return;
    }

    // 3. Pass payloads back to parent controller
    const userPayload = {
      ...data,
      id: isEditMode ? editId : Date.now(),
    };

    if (onSaveUser) {
      onSaveUser(userPayload, isEditMode);
    }

    navigate("/");
  };

  return (
    <div className="mx-auto my-8 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {isEditMode ? "Edit User Details" : "Register New User"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        {/* Name Fields */}
        <FormInput
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName}
          required
        />

        <FormInput
          label="Middle Name"
          name="middleName"
          register={register}
          error={errors.middleName}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName}
          required
        />

        {/* Contact Info */}
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          maxLength={10}
          register={register}
          error={errors.phone}
          required
          onChangeCustom={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
          }}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          required={!isEditMode}
        />

        {/* Background Details */}
        <FormInput
          label="Occupation"
          name="occupation"
          register={register}
          error={errors.occupation}
          required
        />

        <FormInput
          label="Country"
          name="country"
          register={register}
          error={errors.country}
          required
        />

        {/* Full Address */}
        <div className="col-span-2">
          <FormInput
            label="Address"
            name="address"
            register={register}
            error={errors.address}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}