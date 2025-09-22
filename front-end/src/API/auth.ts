import type { SignInDto, SignUpDto } from "./DTOs/Auth";

const API_ENDPOINT:string = "http://localhost:3000/auth";

export async function signInAPI(user:SignInDto) {
    const response = await fetch(`${API_ENDPOINT}/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });
    
    if (!response.ok) {
        throw new Error("Failed to sign in");
    }
    return await response.json();

}

export async function signUpAPI(user: SignUpDto) {
    const response = await fetch(`${API_ENDPOINT}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Failed to sign up");
    }
    return await response.json();
}