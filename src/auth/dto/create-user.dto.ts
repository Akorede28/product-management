import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'Field is of type string' })
  @IsNotEmpty({ message: 'Field is required' })
  username: string;

  @IsString({ message: 'Field is of type string' })
  @IsNotEmpty({ message: 'Field is required' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too Weak',
  })
  password: string;
}
