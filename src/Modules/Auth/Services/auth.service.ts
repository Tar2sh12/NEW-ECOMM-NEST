import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OTPRepository, UserRepository } from '../../../DB/Repositories';
import { SignUpDto, ConfirmationEmailDto } from '../DTO/auth.dto';
import { Events } from 'src/Common/Utils';
import { TokenService } from 'src/Common/Services';
import { CompareHash } from 'src/Common/Security';
import { v4 as uuid4 } from 'uuid';
import { UserType } from 'src/DB/Models';
import { OTPTypes } from 'src/Common/Types';
import { DateTime } from 'luxon';
import { StringValue } from 'src/Common/Types';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private tokenService: TokenService,
    private otpRepository: OTPRepository,
  ) {}

  async signUpService(body: SignUpDto) {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        age,
        phone,
        role,
        gender,
        DOB,
      } = body;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const newUser = await this.userRepository.create({
        email,
        firstName,
        lastName,
        password,
        role,
        phone,
        gender,
        age,
        DOB: DateTime.fromJSDate(DOB),
      });
      const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
      await this.otpRepository.create({
        userId: newUser._id,
        otp,
        otpType: OTPTypes.CONFIRMATION,
        expiryTime: new Date(Date.now() + 1000 * 60 * 10),
      });
      Events.emit('sendEmail', {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to Our Platform - Verify Your Email',
        html: `Hello ${firstName},<br><br>Thank you for signing up! Please use the following OTP to verify your email address: <b>${otp}</b><br><br>Best regards,<br>The Team`,
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
      if (!user.isEmailVerified) {
        throw new ConflictException('Email not verified');
      }
      const payload = { userId: user._id, email: user.email, role: user.role };
      const token = this.tokenService.generate(payload, {
        secret: process.env.LOGIN_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as StringValue,
        jwtid: uuid4(),
      });

      const refreshToken = this.tokenService.generate(payload, {
        secret: process.env.LOGIN_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME as StringValue,
        jwtid: uuid4(),
      });
      return { accessToken: token, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async confirmEmailService(body: ConfirmationEmailDto) {
    try {
      const { email, otp } = body;
      // finding user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      //find the confirmation OTP for the user
      const otpFilters = {
        userId: user._id,
        otpType: OTPTypes.CONFIRMATION,
      };
      const existingOTP = await this.otpRepository.findOne({
        filters: otpFilters,
      });
      if (!existingOTP) {
        throw new NotFoundException('OTP not found or already used');
      }

      //comparing the OTPs for validation
      if (!CompareHash(otp, existingOTP.otp)) {
        throw new NotFoundException('Invalid OTP');
      }

      //checking if the OTP is expired
      if (DateTime.fromJSDate(existingOTP.expireTime) < DateTime.now()) {
        throw new NotFoundException('OTP expired');
      }

      //if the OTP is valid and not expired then confirming the email and deleting the OTP
      user.isEmailVerified = true;
      await this.userRepository.save(user);

      await this.otpRepository.deleteOne({ filters: { _id: existingOTP._id } });
      return { message: 'Email confirmed successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getProfileService(authUser: UserType) {
    return authUser;
  }
}
