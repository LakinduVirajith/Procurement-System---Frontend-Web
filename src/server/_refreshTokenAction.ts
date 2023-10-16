'use server'
export async function refreshTokenAction(refreshToken: any) {
    const URL = `${process.env.BASE_URL_V1}/user/refresh-token?refreshToken=${refreshToken}`
    const response = await fetch(URL , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: "no-cache",
    });
    
    return await response.json()
}