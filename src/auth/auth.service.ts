import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JWTPayload } from './jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokens(auth: JWTPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(auth, {
        expiresIn: 60 * 60 * 24,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(auth, {
        // Access token will expire in 1week
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(createUserDto: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    console.log(salt);

    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    console.log('USER', user);
    console.log('PASSWORD', user.password);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // error code for duplicate entries (username)
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return 'User created successfully!';
  }

  async login(authCredentialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredentialsDto;

    const query = this.userRepository.createQueryBuilder('user');
    const user = await query.where({ username }).getOne();

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // 2) RETURN THE USER IF FOUND AND ADD THE TOKEN TO THE REQUEST BODY
      const tokens = await this.generateTokens({
        id: user.id,
      });

      return {
        user,
        tokens,
      };
    }

    throw new BadRequestException('Invalid Credentials');
  }

  async refreshToken(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    const tokens = await this.generateTokens({
      id: user.id,
    });
    return { tokens };
  }
}
