'use server'
export async function activateUserAction(userId: string, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/activate/${userId}`
    const response = await fetch(URL , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}