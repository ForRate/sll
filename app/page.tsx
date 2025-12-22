"use client";
import Link from "next/link";
import styles from "./main.module.css";
import { useForm } from "react-hook-form";
import {
  registerForm,
  registerFormType,
  subscribeForm,
  subscribeFormType,
} from "@/lib/propTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPortalDetail, registerStudent } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/app/loader";
import { useState } from "react";
export default function Home() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,

    register,
    reset,
  } = useForm<registerFormType>({
    resolver: zodResolver(registerForm),
  });

  const [successImageBuffer, setSuccessImageBuffer] = useState<string>();

  const {
    formState: { isSubmitting: sSubmitting, errors: sError },
    register: sRegister,
    handleSubmit: sHandleSubmit,
  } = useForm<subscribeFormType>({
    resolver: zodResolver(subscribeForm),
  });
  const router = useRouter();
  const handleSubscription = async (data: subscribeFormType) => {
    if (isSubmitting && sSubmitting) {
      return;
    }
    const response = await registerStudent(data);
    if (response?.success) {
      router.push(response.link!);
    }
    return toast.error(response?.message);
  };
  const handleRegister = async (data: registerFormType) => {
    if (isSubmitting && sSubmitting) {
      return;
    }
    const response = await confirmPortalDetail(data);
    if (response?.success) {
      reset();
      toast.success("Your account has successfully been uploaded");
      return setSuccessImageBuffer(response.buffer);
    }
    return toast.error(response?.message);
  };
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1>🎓 GOUNI Bot</h1>
        <p>
          Automatically book a hostel for GOUNI students as soon as the portal
          opens.
        </p>
        <p>
          We need your <strong>GOUNI Portal Username</strong> and{" "}
          <strong>Password</strong> to access your portal and to book the hostel
          automatically. We assure you that the bot is only programmed to book
          hostels
        </p>
        <p>
          We aim at building solution in helping students across different
          schools to ease their stress. If you which to contact us or have an
          inquire or you want us to build things like this, please contact us at{" "}
          <strong>gounibot@outlook.com</strong>
        </p>
        <p>
          Enter the <strong>hostel name</strong> as it appears (e.g.,{" "}
          <code>SACRED HEART</code>), the <strong>block</strong> (e.g.,{" "}
          <code>Block-C</code>), <strong>room number</strong> (e.g.,{" "}
          <code>2</code>), and <strong>bunk</strong> (e.g.,{" "}
          <code>Upper_Bunk</code>). Please ensure the necessary fees are paid
        </p>
      </header>

      {successImageBuffer ? (
        <img
          width={100}
          height={100}
          className={styles.form}
          src={`data:image/png;base64,${successImageBuffer}`}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <form
            onSubmit={sHandleSubmit(handleSubscription)}
            className={`${styles.form} w-full`}
          >
            <p className="text-[20px] text-gray-500">Subscribe your email</p>
            <input
              type="email"
              className={`${sError.email && "bg-red-300"}`}
              placeholder="Any email of your choice"
              {...sRegister("email")}
              required
            />

            {sError.email && (
              <p className="text-sm text-red-600">{sError.email.message}</p>
            )}

            <input
              type="password"
              className={`${sError.password && "bg-red-300"}`}
              placeholder="Account Password"
              {...sRegister("password")}
              required
            />

            {sError.password && (
              <p className="text-sm text-red-600">{sError.password.message}</p>
            )}

            <button
              disabled={sSubmitting || isSubmitting}
              type="submit"
              className={styles.submit}
            >
              {sSubmitting ? <Loader /> : "Subscribe"}
            </button>

            <Link href={"/test-bot"} className={`${styles.submit} text-center`}>
              Or test our bot
            </Link>
          </form>

          <form
            onSubmit={handleSubmit(handleRegister)}
            className={`${styles.form} w-full`}
          >
            <p className="text-[20px] text-gray-500">
              Subscribe your email above if you haven&apos;t done so
            </p>
            <input
              className={`${errors.email && "bg-red-300"}`}
              placeholder="Account Email"
              {...register("email")}
              type="email"
              required
            />

            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            <input
              className={`${errors.password && "bg-red-300"}`}
              placeholder="Account Password"
              {...register("password")}
              type="password"
              required
            />

            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <input
              type="text"
              className={`${errors.gouni_username && "bg-red-300"}`}
              placeholder="GOUNI Portal Username"
              {...register("gouni_username")}
              required
            />

            {errors.gouni_username && (
              <p className="text-sm text-red-600">
                {errors.gouni_username.message}
              </p>
            )}

            <input
              type="text"
              className={`${errors.gouni_password && "bg-red-300"}`}
              placeholder="GOUNI Portal Password"
              {...register("gouni_password")}
              required
            />

            {errors.gouni_password && (
              <p className="text-sm text-red-600">
                {errors.gouni_password.message}
              </p>
            )}
            <input
              type="text"
              className={`${errors.faculty && "bg-red-300"}`}
              placeholder="Faculty"
              {...register("faculty")}
              required
            />

            {errors.faculty && (
              <p className="text-sm text-red-600">{errors.faculty.message}</p>
            )}
            <input
              type="text"
              className={`${errors.hostel && "bg-red-300"}`}
              placeholder="Hostel Name (e.g. SACRED HEART)"
              {...register("hostel")}
              required
            />

            {errors.hostel && (
              <p className="text-sm text-red-600">{errors.hostel.message}</p>
            )}
            <input
              type="text"
              className={`${errors.block && "bg-red-300"}`}
              placeholder="Block (e.g. Block-C)"
              {...register("block")}
              required
            />

            {errors.block && (
              <p className="text-sm text-red-600">{errors.block.message}</p>
            )}
            <input
              type="text"
              className={`${errors.room && "bg-red-300"}`}
              placeholder="Room Number (e.g. 2)"
              {...register("room")}
              required
            />

            {errors.room && (
              <p className="text-sm text-red-600">{errors.room.message}</p>
            )}
            <input
              type="text"
              className={`${errors.bunk && "bg-red-300"}`}
              placeholder="Bunk (e.g. 002 Upper_Bunk or Upper_Bunk (i.e for two in a room))"
              {...register("bunk")}
            />

            {errors.bunk && (
              <p className="text-sm text-red-600">{errors.bunk.message}</p>
            )}
            <button
              disabled={sSubmitting || isSubmitting}
              type="submit"
              className={styles.submit}
            >
              {isSubmitting ? <Loader /> : " Submit"}
            </button>
            <Link
              href={"/change-info"}
              className={`${styles.submit} text-center`}
            >
              Change Information
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}
