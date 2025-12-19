"use server";
import {
  changeDetailForm,
  changeDetailFormType,
  registerForm,
  registerFormType,
  subscribeForm,
  subscribeFormType,
} from "@/lib/propTypes";
import chromium from "@sparticuz/chromium";
import { Browser, launch } from "puppeteer-core";

import prismaClient from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies, headers } from "next/headers";

export const registerStudent = async (input: subscribeFormType) => {
  const { data, error } = subscribeForm.safeParse(input);
  if (error) {
    return {
      success: false,
      message: "Invalid input,please check your details",
    };
  }

  try {
    type paymentLinkType = {
      email: string;
      link: string;
    };
    const { email, password } = data;

    let paymentLink: string | undefined | paymentLinkType = (
      await cookies()
    ).get("hasLink")?.value;

    if (paymentLink) {
      paymentLink = JSON.parse(paymentLink) as paymentLinkType;
      if (paymentLink.email === email) {
        return {
          success: true,
          link: paymentLink.link,
        };
      }
    } else {
      const userExist = await prismaClient.students.findFirst({
        where: { email },
      });
      if (userExist) {
        throw new Error("Email already exists");
      }
    }
    const headersList = await headers();

    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

    const baseUrl = `${protocol}://${host}/verify-payment`;
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: "sub_" + Date.now(),
        amount: 200,
        currency: "NGN",
        redirect_url: baseUrl,
        customer: {
          email,
          name: data.email,
        },
        customizations: {
          title: `GouniBot Subscription `,
        },
        meta: {
          email,
          password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Payment failed to proceed");
    }

    const fData = await response.json();

    if (!fData?.data?.link) {
      throw new Error("Error from payment system. Please contact us on");
    }

    (await cookies()).set(
      "hasLink",
      JSON.stringify({
        email,
        link: fData.data.link,
      }),
      {
        maxAge: 60,
        httpOnly: true,
      }
    );

    return {
      success: true,
      link: fData.data.link as string,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error && error.message,
    };
  }
};

export const confirmPortalDetail = async (input: registerFormType) => {
  const { data, error } = registerForm.safeParse(input);
  if (error) {
    return {
      success: false,
      message: "Incorrect input",
    };
  }
  const { email, password, ...safeData } = data;

  let browser: Browser | undefined;

  try {
    const user = await prismaClient.students.findFirst({ where: { email } });
    if (!user) {
      throw new Error("Account Email or Password incorrect");
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      throw new Error("Account Email or Password incorrect");
    }
    if (user.gouni_password || user.gouni_username) {
      throw new Error(
        "Your details has already been stored. If you wish to change your information, go to the change-info page"
      );
    }

    const roomBooked = await prismaClient.students.findFirst({
      where: {
        hostel: safeData.hostel,
        bunk: safeData.bunk,
        room: safeData.room,
        block: safeData.block,
      },
    });
    if (roomBooked) {
      throw new Error("Room already been booked");
    }

    const browser = await launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto("https://student.erp.gouni.edu.ng/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.locator("input[name='username']").fill(data.gouni_username);
    await page.locator("input[name='password']").fill(data.gouni_password);

    await page.click("button");

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(4000);

    const errorExists = await page.$$eval("div", (divs) =>
      divs.some((div) =>
        div.textContent.includes("Invalid Username or Password")
      )
    );

    if (errorExists) {
      throw new Error("Your portal username or password doesn't match");
    }

    const buffer = await page.screenshot({ encoding: "base64" });
    await browser.close();

    await prismaClient.students.update({
      where: {
        email,
      },
      data: {
        ...safeData,
      },
    });
    return {
      success: true,
      message: "Account updated",
      buffer,
    };
  } catch (error) {
    await browser?.close();
    return {
      success: false,
      message: error instanceof Error && error.message,
    };
  }
};
export const modifyPortalDetail = async (input: changeDetailFormType) => {
  const { data, error } = changeDetailForm.safeParse(input);
  if (error) {
    return {
      success: false,
      message: "Incorrect input",
    };
  }

  const { email, password, ...mainContent } = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  const user = await prismaClient.students.findFirst({ where: { email } });
  if (!user) {
    throw new Error("Account Email or Password incorrect");
  }

  if (Object.keys(mainContent).length === 0) {
    throw new Error(
      "No field has been updated, please do not auto-complete but type"
    );
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    throw new Error("Account Email or Password incorrect");
  }

  const info = { ...user, ...mainContent };

  const roomBooked = await prismaClient.students.findFirst({
    where: {
      hostel: info.hostel,
      bunk: info.bunk,
      block: info.block,
      room: info.room,
    },
  });
  if (roomBooked) {
    throw new Error("Room has been booked");
  }

  await prismaClient.students.update({
    where: {
      email,
    },
    data: {
      ...mainContent,
    },
  });
  return {
    success: true,
    message: "Account updated",
  };
};
