import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../interfaces/auth";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private baseUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) {}

    registerUser(usuario: User) {
        return this.http.post(`${this.baseUrl}`, usuario);
    }


    getUserByEmail(email:string):Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}?email=${email}`);
    }
}
