import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../../DB/Repositories';
import { SignUpDto } from '../DTO/auth.dto';
import { Events } from 'src/Common/Utils';
import { TokenService } from 'src/Common/Services';
import { CompareHash } from 'src/Common/Security';
import { v4 as uuid4 } from 'uuid';
import { UserType } from 'src/DB/Models';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  async signUpService(body: SignUpDto) {
    try {
      const { email, username, password, age } = body;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
      Events.emit('sendEmail', {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to Our Platform - Verify Your Email',
        html: `Hello ${username},<br><br>Thank you for signing up! Please use the following OTP to verify your email address: <b>${otp}</b><br><br>Best regards,<br>The Team`,
      });

      const newUser = await this.userRepository.create({
        email,
        username,
        password,
        age,
      });
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async LoginService(body) {
    try {
      const { email, password } = body;
      const user = await this.userRepository.findByEmail(email);
      if (!user || !CompareHash(password, user.password)) {
        throw new NotFoundException('Invalid credentials');
      }
      const payload = { userId: user._id, email: user.email, role: user.role };
      const token = this.tokenService.generate(payload, {
        secret: process.env.LOGIN_ACCESS_TOKEN_SECRET,
        expiresIn: '1d',
        jwtid: uuid4(),
      });
      return { accessToken: token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getProfileService(authUser: UserType) {
    return authUser;
  }
}
