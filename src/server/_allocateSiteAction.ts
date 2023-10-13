'use server'
export async function allocateSiteAction(formData: deallocateSite, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/site/allocate?userEmail=${formData.userEmail}`
    const response = await fetch(URL , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData.siteId,
        cache: "no-cache",
    });
    
    return await response.json()
}