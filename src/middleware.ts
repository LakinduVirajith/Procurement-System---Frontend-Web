import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, validateAccessToken, validateRefreshToken } from "@/lib/tokenService";
import { tokenAction } from "@/server/_tokenAction";

export async function middlewareAuth(request: NextRequest) {
    
    if(!validateAccessToken() && validateRefreshToken()){
        
        const refreshToken = getRefreshToken()
        if(refreshToken){
            const response: AuthenticationResponse = await tokenAction(refreshToken);

            if (response.statusCode === 200) {
                setAccessToken(response.accessToken);
                setRefreshToken(response.refreshToken);
                return NextResponse.redirect(new URL('/dashboard', request.url))
            } else {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }
}

export async function middlewareRedirect(request: NextRequest) {
    const url = request.url;

    if(url.includes('login')){
        if(validateAccessToken()){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if(url.includes('dashboard')){
        if(!validateRefreshToken()){                    
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}

export function middlewareHeaders(request: NextRequest) {
    const accessToken = getAccessToken()
    
    if(accessToken){
        request.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return NextResponse.next({ request })
}

export function middleware(request: NextRequest) {
    middlewareAuth(request)
    middlewareRedirect(request)
    middlewareHeaders(request)
}
