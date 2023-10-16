'use server'
export async function deleteItemAction(itemId: string, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/site-manager/item/delete/${itemId}`
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