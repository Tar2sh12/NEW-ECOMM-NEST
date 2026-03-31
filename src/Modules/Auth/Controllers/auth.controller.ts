import { Body, Controller, Post, Res, Req, Get, Patch } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { LoginBodyDto, SignUpDto, ConfirmationEmailDto } from '../dto/auth.dto';
import { Auth } from 'src/Common/Guards';
import { SystemRoles,IAuthUser } from 'src/Common/Types';
import { User } from 'src/Common/Decorators';
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

  @Patch('confirm-email')
  async confirmEmailHandler(
    @Body() body: ConfirmationEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.confirmEmailService(body);
    return res.status(200).json(result);
  }

  @Get('get-profile')
  @Auth([SystemRoles.ADMIN, SystemRoles.USER])
  getProfileHandler(
    @Res() res: Response,
    @Req() req: Request,
    @User() loggedInUser: IAuthUser,// custom decorator to get the logged in user data from request object which is set by authentication guard
  ) {
    // const authUser = req['authUser'];
    const result = this.authService.getProfileService(loggedInUser.user);
    return res.status(200).json(result);
  }

  @Post('logout')
  @Auth([SystemRoles.ADMIN, SystemRoles.USER])
  async logoutHandler(
    @Res() res: Response,
    @User() loggedInUser: IAuthUser,
  ) {
    const result = await this.authService.logoutService(loggedInUser);
    return res.status(200).json(result);
  }
}
