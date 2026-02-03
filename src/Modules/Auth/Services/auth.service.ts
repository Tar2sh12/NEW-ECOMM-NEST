import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../../../DB/Repositories';
import { Hash } from 'src/Security';
import { SignUpDto } from '../DTO/auth.dto';
import { Events } from 'src/Common/Utils';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUpService(body:SignUpDto) {
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
}
