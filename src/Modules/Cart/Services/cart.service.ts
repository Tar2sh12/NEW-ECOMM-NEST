import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository, ProductRepository } from 'src/DB/Repositories';
import { AddToCartDto } from '../dto/addToCart.dto';
import { IAuthUser } from 'src/Common/Types';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async addToCart(loggedInUser: IAuthUser, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;
    const userId = loggedInUser.user._id;

    // Check if the product exists
    const product = await this.productRepository.findOne({
      filters: {
        _id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (quantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} items in stock`);
    }

    // Check if the cart item already exists for the user
    const existingCartItem = await this.cartRepository.findOne({
      filters: {
        userId,
      },
    });

    if (!existingCartItem) {
      return await this.cartRepository.create({
        userId,
        products: [
          {
            productId: product._id,
            quantity,
            finalPrice: product.finalPrice,
          },
        ],
      });
    }

    const isProductInCart = existingCartItem.products.find((p) =>
      p.productId.equals(product._id),
    );
    if (isProductInCart) {
      // fe nas momken to2ol la a7na mmkn n3ml update 3la el quantity bs wa da ghalat fe makan ll update cart so don't mix between add to cart and update cart
      throw new BadRequestException('Product already in cart'); // wala 7d y2oli lw l product mwgod nzwd quantity ✨BALA7✨
    }

    existingCartItem.products.push({
      productId: product._id,
      quantity,
      finalPrice: product.finalPrice,
    });

    return await this.cartRepository.save(existingCartItem);
  }

  async removeFromCart(loggedInUser: IAuthUser, productId: string) {
    const userId = loggedInUser.user._id;

    //check if the product exists
    const product = await this.productRepository.findOne({
      filters: {
        _id: productId,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Check if the cart item exists
    const existingCartItem = await this.cartRepository.findOne({
      filters: {
        userId,
        'products.productId': productId,
      },
    });
    if (!existingCartItem) {
      throw new NotFoundException('Cart not found');
    }

    existingCartItem.products = existingCartItem.products.filter(
      (p) => !p.productId.equals(product._id),
    );

    return await this.cartRepository.save(existingCartItem);
  }

  async updateProductQuantity(
    loggedInUser: IAuthUser,
    productId: string,
    quantity: number,
  ) {
    const userId = loggedInUser.user._id;
    //check if the product exists
    const product = await this.productRepository.findOne({
      filters: {
        _id: productId,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (quantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} items in stock`);
    }

    // Check if the cart item exists
    const existingCartItem = await this.cartRepository.findOne({
      filters: {
        userId,
        'products.productId': productId,
      },
    });
    if (!existingCartItem) {
      throw new NotFoundException('Cart not found');
    }

    existingCartItem.products.find((p) => {
      if (p.productId.equals(product._id)) {
        p.quantity = quantity;
        return p;
      }
    });

    return await this.cartRepository.save(existingCartItem);
  }
}
