'use server'
export async function createItemAction(formData: ItemDTO, accessToken: any) {
    
    const response = await fetch(`${process.env.BASE_URL_V1}/site-manager/item/add`, {
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