import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, validateAccessToken, validateRefreshToken } from "@/services/tokenService";
import { refreshTokenAction } from "./server/_refreshTokenAction";

export async function middlewareAuth(request: NextRequest) {
    
    if(!validateAccessToken() && validateRefreshToken()){
        
        const refreshToken = getRefreshToken()
        if(refreshToken){
            const response: AuthenticationResponse = await refreshTokenAction(refreshToken);

            if (response.statusCode === 200) {
                if(response.accessToken)
                    setAccessToken(response.accessToken);
                if(response.refreshToken)
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
    // middlewareAuth(request)
    // middlewareRedirect(request)
    // middlewareHeaders(request)
}
