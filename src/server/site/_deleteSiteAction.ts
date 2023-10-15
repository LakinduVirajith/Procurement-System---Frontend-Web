'use server'
export async function deleteSiteAction(siteId: string, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/site/delete/${siteId}`
    const response = await fetch(URL , {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}