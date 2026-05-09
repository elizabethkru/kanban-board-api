import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/infrastructure/repository/user.repository';


@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(email, passwordHash);
    return { uuid: user.uuid, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.uuid, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(uuid: string) {
    return this.userRepository.findById(uuid);
  }
}