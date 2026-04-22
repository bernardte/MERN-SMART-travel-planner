import * as z from "zod";

export const userSignUpSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .min(3, { message: "Username must be at least 3 characters." })
    .max(20, { message: "Username must not exceed 20 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscore.",
    }),

  fullname: z
    .string()
    .min(1, { message: "Full name is required." })
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(50, { message: "Full name must not exceed 50 characters." }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(30, { message: "Password must not exceed 30 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    }),
});

export type UserSignUpSchemaType = z.infer<typeof userSignUpSchema>;

export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .min(1, { message: "Password is required." })
});

export type UserLoginSchemaType = z.infer<typeof userLoginSchema>;

export const userResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
});

export type UserResetPasswordSchemaType = z.infer<typeof userResetPasswordSchema>;