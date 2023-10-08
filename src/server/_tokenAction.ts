
'use server'
export async function tokenAction(refreshToken: string) {
    const URL = `${process.env.BASE_URL_V1}/user/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`;
  
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
  
    return response.json();
  }