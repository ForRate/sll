"use client";
import { useForm } from "react-hook-form";
import styles from "../main.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { testBotForm, testBotFormType } from "@/lib/propTypes";
import { useState } from "react";
import { testBot } from "@/lib/actions";
import Loader from "@/app/loader";
import Link from "next/link";
import { toast } from "react-toastify";

export default function TestBot() {
  const [successImageBuffer, setSuccessImageBuffer] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<testBotFormType>({ resolver: zodResolver(testBotForm) });

  const handleSubscription = async (data: testBotFormType) => {
    const response = await testBot(data);
    if (!response.success) {
      return toast.error(response.message);
    }

    setSuccessImageBuffer(response.buffer);
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
          Input your Gouni Portal Username or Password below. Our bot will
          display an image of your portal logged in
        </p>
        <p>
          This is to assure you that our bot can successfully book your hostel
          with the necessary information
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
        <div>
          <form
            onSubmit={handleSubmit(handleSubscription)}
            className={`${styles.form} mb-4`}
          >
            <input
              type="text"
              className={`${errors.gouni_password && "bg-red-300"}`}
              placeholder="GOUNI Portal Username"
              {...register("gouni_username")}
              required
            />

            {errors.gouni_password && (
              <p className="text-sm text-red-600">
                {errors.gouni_password.message}
              </p>
            )}

            <input
              type="text"
              className={`${errors.gouni_password && "bg-red-300"}`}
              placeholder="Gouni Portal Password"
              {...register("gouni_password")}
              required
            />

            {errors.gouni_password && (
              <p className="text-sm text-red-600">
                {errors.gouni_password.message}
              </p>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className={styles.submit}
            >
              {isSubmitting ? <Loader /> : "Test Bot"}
            </button>

            <Link href={"/"} className={`${styles.submit} text-center`}>
              Go Back
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}
