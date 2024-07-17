import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'src/entity/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from 'src/guards/auth.guard';
// import { CurrentUser } from 'src/decorators/current-user.decorator';
// import { User } from 'src/entity/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Post('/')
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Put('/')
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  async updateProduct(@Body() data: UpdateProductDto) {
    return await this.productsService.updateProduct(data);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
