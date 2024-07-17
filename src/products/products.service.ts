import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    const products = await query.getMany();

    if (!products) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  async getProductById(id: string) {
    const foundProduct = await this.productRepository.findOne({
      where: { id },
    });
    console.log('userinfo', foundProduct);

    if (!foundProduct) {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }

    return foundProduct;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, imageURL } = createProductDto;

    const product = this.productRepository.create({
      name,
      description,
      price,
      imageURL,
    });

    try {
      await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return product;
  }

  async updateProduct(data: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id: data.id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID: ${data.id} not found`);
    }

    const updatedProduct = await this.productRepository.update(
      { id: product.id },
      { ...data },
    );

    if (updatedProduct.affected === 0) {
      throw new NotFoundException(
        `Product with ID: ${data.id} could not be updated`,
      );
    }

    return 'Product updated successfully';
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }

    const removedProduct = await this.productRepository.remove(product);

    if (!removedProduct) {
      throw new NotFoundException(
        `Product with ID: ${id} could not be deleted`,
      );
    }
    return 'Product deleted successfully';
  }
}
