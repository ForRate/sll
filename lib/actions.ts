// import { prisma } from "@/lib/prisma";
"use server";
import {
  changeDetailForm,
  changeDetailFormType,
  registerForm,
  registerFormType,
  subscribeForm,
  subscribeFormType,
} from "@/lib/propTypes";
import puppeteer from "puppeteer";
import prismaClient from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

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
        redirect_url: "http://localhost:3000/verify-payment",
        payment_options: "card",
        customer: {
          email,
          name: data.email,
        },
        customizations: {
          title: `GouniBot subscription `,
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

  let browser;
  try {
    const user = await prismaClient.students.findFirst({ where: { email } });
    if (!user) {
      throw new Error("Account Email or Password incorrect");
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      throw new Error("Account Email or Password incorrect");
    }

    browser = await puppeteer.launch({
      slowMo: 2,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://student.erp.gouni.edu.ng/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await page.type("input[name='username']", data.gouni_username);
    await page.type("input[name='password']", data.gouni_password);

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
  const { email, password, ...safeData } = data;

  const user = await prismaClient.students.findFirst({ where: { email } });
  if (!user) {
    throw new Error("Account Email or Password incorrect");
  }

  const mainContent = Object.fromEntries(
    Object.entries(safeData).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  if (Object.keys(mainContent).length === 0) {
    throw new Error(
      "No field has been updated, please check your connection and do not auto-complete but type"
    );
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    throw new Error("Account Email or Password incorrect");
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
