'use server'
export async function getAllOrdersAction(accessToken: any) {
    const response = await fetch(`${process.env.BASE_URL_V1}/all-users/order/all/details` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}