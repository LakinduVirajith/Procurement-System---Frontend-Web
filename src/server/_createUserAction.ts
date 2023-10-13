'use server'
export async function createUserAction(formData: userDTO, accessToken: any) {

    const response = await fetch(`${process.env.BASE_URL_V1}/super-admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
        cache: "no-cache",
    });
    
    return await response.json()
}