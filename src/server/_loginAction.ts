'use server'
import { loginSchema } from "@/validation/loginSchema";

export async function loginAction(reqEmail: string, reqPassword: string): Promise<AuthenticationResponse> {
    const request: AuthenticationRequest = {
      email: reqEmail,
      password: reqPassword
    }

    /* ZOD VALIDATIONS */
    try {
      loginSchema.parse(request);
    } catch (error: any) {
      return {
        statusCode: 400,
        status: "BAD_REQUEST",
        message: error.errors[0].message
      }
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
    
    return await response.json()
  }