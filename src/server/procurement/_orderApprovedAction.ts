'use server'
export async function orderApprovedAction(orderId: number, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/procurement-manager/order/approval/${orderId}`
    const response = await fetch(URL , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-cache",
    });
    
    return await response.json()
}