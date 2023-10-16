'use server'
export async function getSuppliersAction(accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/procurement-manager/get/supplier`
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