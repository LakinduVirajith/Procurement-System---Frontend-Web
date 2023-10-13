'use server'
export async function resetPasswordAction(formData: resetPassword, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/reset-password?email=${formData.email}`
    const response = await fetch(URL , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData.password,
        cache: "no-cache",
    });
    
    return await response.json()
}