'use server'
export async function getItemInfoAction(itemId: string, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/site-manager/item/get/${itemId}`
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