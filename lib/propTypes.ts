import * as z from "zod";

export const changeDetailForm = z.object({
  faculty: z.string("Your faculty is missing").optional(),
  email: z.email("Account Email is missing"),
  password: z.string().min(6, "Account Password should be at least 6"),

  gouni_username: z.string("Your Gouni username is missing").optional(),
  gouni_password: z.string("Your Gouni password is missing").optional(),
  hostel: z.string("Your hostel name is missing").optional(),
  block: z.string("Your hostel block is missing").optional(),
  room: z.string("Your hostel room number is missing").optional(),
  bunk: z.string("Bunk number is missing").optional(),
});
export const registerForm = z.object({
  faculty: z.string("Your faculty is missing"),
  email: z.email("Account Email is missing"),
  password: z.string().min(6, "Account Password should be at least 6"),

  gouni_username: z.string("Your Gouni username is missing"),
  gouni_password: z.string("Your Gouni password is missing"),
  hostel: z.string("Your hostel name is missing"),
  block: z.string("Your hostel block is missing"),
  room: z.string("Your hostel room number is missing"),
  bunk: z.string("Bunk number is missing"),
});

export const subscribeForm = z.object({
  email: z.email("Account Email is missing"),
  password: z.string().min(6, "Account Password should be at least 6"),
});

export type subscribeFormType = z.infer<typeof subscribeForm>;
export type registerFormType = z.infer<typeof registerForm>;
export type changeDetailFormType = z.infer<typeof changeDetailForm>;
