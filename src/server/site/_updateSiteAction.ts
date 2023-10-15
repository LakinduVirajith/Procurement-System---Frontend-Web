'use server'
export async function updateSiteAction(formData: SiteDTO, accessToken: any) {    
    const response = await fetch(`${process.env.BASE_URL_V1}/super-admin/site/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
        cache: "no-cache",
    });
    
    return await response.json()
}