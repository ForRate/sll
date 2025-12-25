"use client";
import Loader from "@/app/loader";
import styles from "@/app/main.module.css";
import { modifyPortalDetail } from "@/lib/actions";
import { changeDetailForm, changeDetailFormType } from "@/lib/propTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
export default function ChangeInfo() {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<changeDetailFormType>({
    resolver: zodResolver(changeDetailForm),
  });
  const resetDetail = async (data: changeDetailFormType) => {
    const response = await modifyPortalDetail(data);
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
          Input your subscribed email and password and choose any of the detail
          you want to change (This apply to those whose account are recorded in
          the system)
        </small>
        <input
          {...register("email")}
          type="email"
          placeholder=" Account Email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm ">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Account Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm ">{errors.password.message}</p>
        )}
        <input
          {...register("gouni_username")}
          type="text"
          placeholder="GOUNI Portal Username"
        />
        {errors.gouni_username && (
          <p className="text-red-500 text-sm ">
            {errors.gouni_username.message}
          </p>
        )}
        <input
          {...register("gouni_password")}
          type="text"
          placeholder="GOUNI Portal Password"
        />
        {errors.gouni_password && (
          <p className="text-red-500 text-sm ">
            {errors.gouni_password.message}
          </p>
        )}

        <input
          {...register("hostel")}
          type="text"
          placeholder="Hostel Name (e.g. SACRED HEART HOSTEL)"
        />
        <input
          {...register("block")}
          type="text"
          placeholder="Block (e.g. Block-C)"
        />
        {errors.block && (
          <p className="text-red-500 text-sm ">{errors.block.message}</p>
        )}

        <input
          {...register("room")}
          type="text"
          placeholder="Room Number (e.g. 2)"
        />
        {errors.room && (
          <p className="text-red-500 text-sm ">{errors.room.message}</p>
        )}

        <input
          {...register("bunk")}
          type="text"
          placeholder="Bunk (e.g. 002 Upper_Bunk or Upper_Bunk(i.e for 2 in a room))"
        />
        {errors.bunk && (
          <p className="text-red-500 text-sm ">{errors.bunk.message}</p>
        )}

        <button disabled={isSubmitting} type="submit" className={styles.submit}>
          {isSubmitting ? <Loader /> : "Change Info"}
        </button>
        <Link href={"/"} className={`${styles.submit} text-center`}>
          Create Account
        </Link>
      </form>
    </>
  );
}
