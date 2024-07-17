import { IsDate, IsString } from 'class-validator';

export class UserDto {
  @IsString({ message: 'value must be of type string' })
  id: string;

  @IsString({ message: 'value must be of type string' })
  username: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
