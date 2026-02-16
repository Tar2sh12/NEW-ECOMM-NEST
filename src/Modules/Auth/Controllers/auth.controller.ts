import { Body, Controller, Post, Res,Req, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { LoginBodyDto, SignUpDto } from '../DTO/auth.dto';
import {Auth } from 'src/Common/Guards';
import { SystemRoles } from 'src/Common/Types';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUpHandler(@Body() body: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signUpService(body);
    return res.status(201).json(result);
  }

  @Post('login')
  async signInHandler(@Body() body: LoginBodyDto, @Res() res: Response) {
    const result = await this.authService.LoginService(body);
    return res.status(201).json(result);
  }

  @Get('get-profile')
  @Auth([SystemRoles.ADMIN,SystemRoles.USER])
  getProfileHandler(@Res() res: Response,@Req() req: Request) {
    const authUser = req['authUser'];
    const result = this.authService.getProfileService(authUser);
    return res.status(200).json(result);
  }
}
