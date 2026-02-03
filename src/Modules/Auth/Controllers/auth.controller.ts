import { Body, Controller, Post, Res,Req, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { LoginBodyDto, SignUpDto } from '../DTO/auth.dto';
import { AuthenticationGuard } from 'src/Common/Guards';
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
  @UseGuards(AuthenticationGuard)
  getProfileHandler(@Res() res: Response,@Req() req: Request) {
    const authUser = req['authUser'];
    console.log('auth user in controller', authUser);
    const result = this.authService.getProfileService(authUser);
    return res.status(200).json(result);
  }
}
