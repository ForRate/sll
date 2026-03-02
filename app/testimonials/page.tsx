"use client";
import Loader from "@/app/loader";
import styles from "@/app/main.module.css";
import { sendReview } from "@/lib/actions";
import { testimonialSchema, testimonialType } from "@/lib/propTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ChangeInfo() {
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<testimonialType>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      star: 0,
    },
  });
  const rating = watch("star");

  const resetDetail = async (data: testimonialType) => {
    const response = await sendReview(data);
    if (response.success) {
      reset();
      return toast.success(response.message);
    }
    toast.error(response.message);
  };

  return (
    <>
      <form onSubmit={handleSubmit(resetDetail)} className={styles.form}>
        <small className="text-gray-500 text-[20px]">
          Give us a review. Your opinion makes us improve our platform base on
          your preference
        </small>
        <input
          {...register("email")}
          type="email"
          placeholder="Email(Private)"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm ">{errors.email.message}</p>
        )}
        <input
          {...register("displayname")}
          type="text"
          placeholder="Displayname(what people will see)"
          required
        />
        {errors.displayname && (
          <p className="text-red-500 text-sm ">{errors.displayname.message}</p>
        )}

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((el) => (
            <span
              key={el}
              className={`cursor-pointer text-[2rem] ${rating >= el ? "text-amber-300" : "text-gray-300"} `}
              onClick={() => setValue("star", el, { shouldValidate: true })}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          {...register("message")}
          placeholder="Write your review"
          required
        />
        {errors.message && (
          <p className="text-red-500 text-sm ">{errors.message.message}</p>
        )}

        <button disabled={isSubmitting} type="submit" className={styles.submit}>
          {isSubmitting ? <Loader /> : "Send Review"}
        </button>
        <Link href={"/"} className={`${styles.submit} text-center`}>
          Create Account
        </Link>
      </form>
    </>
  );
}
