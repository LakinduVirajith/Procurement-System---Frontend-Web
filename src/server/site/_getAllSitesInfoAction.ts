'use server'
export async function getAllSitesInfoAction(pageable: Pageable, accessToken: any) {
    const URL = `${process.env.BASE_URL_V1}/super-admin/site/all/info?page=${pageable.page - 1}&size=${pageable.size}&sort=${pageable.sort[0]}`
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