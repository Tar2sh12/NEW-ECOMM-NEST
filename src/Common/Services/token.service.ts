import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}
    generate(payload,options:JwtSignOptions): string {
        return this.jwtService.sign(payload,options);
    }
    verify(token:string,options:JwtVerifyOptions): string | object {
        return this.jwtService.verify(token,options);
    }
}