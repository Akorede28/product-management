import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from 'src/entity/user.entity';
import { JWTPayload } from '../jwt-payload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'), //secret extracted from the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate(payload: JWTPayload): Promise<CreateUserDTO> {
    const { id } = payload;

    // find user using the provided token
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
