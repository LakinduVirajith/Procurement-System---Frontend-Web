'use server'
import { loginSchema } from "@/validation/loginSchema";
import { NextResponse } from "next/server";

export async function loginAction(form: FormData) {
    const { email, password } = Object.fromEntries(form)
    
    const request: AuthenticationRequest = {
      email: email.toString(),
      password: password.toString()
    }

    /* ZOD VALIDATIONS */
    try {
      loginSchema.parse(request);
    } catch (error: any) {
      return {
        statusCode: 400,
        message: error.errors[0].message,
      };
    }    

    /* USER LOGIN */
    const response = await fetch(`${process.env.BASE_URL_V1}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      cache: "no-cache",
    });
    
    return response.json();
  }