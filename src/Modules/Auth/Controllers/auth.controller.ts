import { Body, Controller, Post,Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { SignUpDto } from '../DTO/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(
    @Body() body: SignUpDto,
    @Res() res: Response
  ) {
    const result = await this.authService.signUpService(body);
    return res.status(201).json(result);
  }
}
