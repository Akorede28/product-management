import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'value must be a string' })
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString({ message: 'value must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'value must be a string' })
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString({ message: 'value must be a string' })
  imageURL?: string;
}
