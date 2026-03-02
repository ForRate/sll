import * as z from "zod";

export const changeDetailForm = z.object({
  faculty: z.string("Your faculty is missing").optional(),
  email: z.email("Account Email is missing"),
  password: z.string().min(6, "Account Password should be at least 6"),

  gouni_username: z.string("Your Gouni username is missing").optional(),
  gouni_password: z.string("Your Gouni password is missing").optional(),
  hostel: z
    .string("Your hostel name is missing")
    .trim()
    .toUpperCase()
    .optional(),
  block: z
    .string("Your hostel block is missing")
    .trim()
    .toUpperCase()
    .optional(),
  room: z
    .string("Your hostel room number is missing")
    .trim()
    .toUpperCase()
    .optional(),
  bunk: z.string("Bunk number is missing").trim().toUpperCase().optional(),
});
export const registerForm = z.object({
  faculty: z.string("Your faculty is missing"),
  email: z.email("Account Email is missing"),
  password: z.string().min(6, "Account Password should be at least 6"),

  gouni_username: z.string("Your Gouni Portal Username is missing"),
  gouni_password: z.string("Your Gouni Portal Password is missing"),
  hostel: z.string("Your hostel name is missing").trim().toUpperCase(),
  block: z.string("Your hostel block is missing").trim().toUpperCase(),
  room: z.string("Your hostel room number is missing").trim().toUpperCase(),
  bunk: z.string("Bunk number is missing").trim().toUpperCase(),
});

export const subscribeForm = z.object({
  email: z.email("Account Email is missing"),
  whatsapp_number: z
    .string()
    .length(10, "Your Number should be 10. Skip the first zero e.g 81234"),
  password: z.string().min(6, "Account Password should be at least 6"),
});
export const testBotForm = z.object({
  gouni_username: z.string("Your Gouni Portal Username is missing"),
  gouni_password: z.string("Your Gouni Portal Password is missing"),
});

export const testimonialSchema = z.object({
  displayname: z
    .string()
    .min(3, "Your display name is missing")
    .max(10, "Name too long"),
  email: z.email("Account Email is missing"),

  message: z.string().min(4, "Your hostel block is missing"),
  star: z
    .number()
    .min(1, "Can't go below 1 star")
    .max(5, "Can't go beyond 5 stars"),
});

export type subscribeFormType = z.infer<typeof subscribeForm>;
export type testBotFormType = z.infer<typeof testBotForm>;
export type registerFormType = z.infer<typeof registerForm>;
export type changeDetailFormType = z.infer<typeof changeDetailForm>;
export type testimonialType = z.infer<typeof testimonialSchema>;

export type auth = {
  success: 0;
  testBotTrial: 0;
  executablePath: string;
};
