'use server'
export async function deactivateUserAction(userId: string, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/deactivate/${userId}`
    const response = await fetch(URL , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}