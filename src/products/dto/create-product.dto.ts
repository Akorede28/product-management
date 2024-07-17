import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString({ message: 'value must be a string' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'value must be a string' })
  description: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString({ message: 'value must be a string' })
  imageURL: string;
}
