'use server'
export async function logoutAction(accessToken: any) {
    const response = await fetch(`${process.env.BASE_URL_V1}/all-users/logout` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}