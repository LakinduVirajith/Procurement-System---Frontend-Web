'use server'
export async function assignSupplierAction(formData: AssignSupplier, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/procurement-manager/order/assign/${formData.orderId}`
    const response = await fetch(URL , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData.supplierId,
        cache: "no-cache",
    });
    
    return await response.json()
}