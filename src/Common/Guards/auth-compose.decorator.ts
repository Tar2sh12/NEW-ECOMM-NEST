import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "../Decorators";
import { AuthenticationGuard } from "./authentication.guard";
import { AuthorizationGuard } from "./authorization.guard";

export function Auth(roles: string[]) {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthenticationGuard,AuthorizationGuard)
    )
}
