import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import {
  AddressRepository,
  CartRepository,
  CouponRepository,
  OrderRepository,
  ProductRepository,
} from 'src/DB/Repositories';
import { IAuthUser, OrderStatus, paymentMethods } from 'src/Common/Types';
import { DateTime } from 'luxon';
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly couponRepository: CouponRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IAuthUser) {
    const userId = user.user._id;
    const {
      paymentMethod,
      addressId,
      contactNumber,
      shipingFee,
      VAT,
      couponCode,
    } = createOrderDto;

    const cart = await this.cartRepository.findOne({
      filters: { userId },
      populateArray: [
        {
          path: 'products.productId',
        },
      ],
    });

    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const isSoldOut = cart.products.find(
      (p) => p.productId['stock'] < p.quantity,
    );
    if (isSoldOut) {
      throw new BadRequestException('Some products are sold out');
    }
    const subtotal = await this.cartRepository.calculateTotalPrice(cart);
    
    let total = subtotal + shipingFee + VAT;

    
    let coupon = null;
    if (couponCode) {
      const validCoupon = await this.couponRepository.validateCoupon(
        couponCode,
        userId,
      );
      if (validCoupon.status === true) {
        coupon = validCoupon.coupon;
        total = this.couponRepository.applyCoupon(coupon, subtotal);
        total = total + shipingFee + VAT;
        
      }
    }

    let orderStatus = OrderStatus.Pending;
    if (paymentMethod === paymentMethods.Cash) {
      orderStatus = OrderStatus.Placed;
    }
    const address = await this.addressRepository.findOne({
      filters: { _id: addressId, userId },
    });
    if (!address) {
      throw new BadRequestException('Invalid address');
    }
    //console.log(total,subtotal);

    const products = cart.products;
    
    const order = await this.orderRepository.create({
      userId,
      addressId: address._id,
      contactNumber,
      subTotal: subtotal,
      shipingFee,
      VAT,
      cartId: cart._id,
      couponId: coupon?._id,
      total,
      paymentMethod,
      orderStatus,
      estimatedDeliveryDate: DateTime.now()
        .plus({ days: 3 })
        .toFormat('yyyy-MM-dd'),
        products
    });
    await this.orderRepository.save(order);

    // increment coupon usage count for user
    coupon.Users = coupon?.Users.map((user) => {
      if (user.userId.toString() === userId.toString()) {
        return {
          userId,
          usageCount: user.usageCount + 1,
          maxCount: user.maxCount,
        };
      }
      return user;
    })
    await this.couponRepository.save(coupon);

    // decrement product stock
    for (const item of cart.products) {
      const product = item.productId;
      const p= await this.productRepository.findOne({filters:{_id:product._id}});
      if(!p){
        throw new BadRequestException(`Product with id ${product._id} not found`);
      }
      if(p.stock < item.quantity){
        throw new BadRequestException(`Product ${p.title} is out of stock`);
      }
      p.stock -= item.quantity;
      await this.productRepository.save(p);
    }

    // clear cart
    cart.products = [];
    await this.cartRepository.save(cart);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
