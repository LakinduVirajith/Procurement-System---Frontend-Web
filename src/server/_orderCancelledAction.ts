'use server'
export async function orderCancelledAction(orderId: number, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/procurement-manager/order/cancel/${orderId}`
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