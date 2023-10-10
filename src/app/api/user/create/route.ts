export async function POST(request: Request) {
    console.log(request);
    
    const data = await request.json()

    const response = await fetch(`${process.env.BASE_URL_V1}/super-admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: "no-cache",
  })
 
  const res = await response.json()
  return Response.json(res)
}