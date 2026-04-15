import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import {
  AddressRepository,
  CartRepository,
  CouponRepository,
  OrderRepository,
  ProductRepository,
} from 'src/DB/Repositories';
import { IAuthUser, OrderStatus, paymentMethods } from 'src/Common/Types';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';
import { PaymobService, StripeService } from '../Payment/Services';
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly couponRepository: CouponRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository,
    private readonly stripeService: StripeService,
    private readonly paymobService: PaymobService,
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
      products,
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
    });
    await this.couponRepository.save(coupon);
    if (order.paymentMethod === paymentMethods.Cash) {
      await this.productRepository.decrementStock(cart);
      // clear cart
      cart.products = [];
      await this.cartRepository.save(cart);
    }

    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  async payWithStripe(orderId: Types.ObjectId, user: IAuthUser) {
    const order = await this.orderRepository.findOne({
      filters: {
        _id: orderId,
        userId: user.user._id,
        orderStatus: OrderStatus.Pending,
      },
      populateArray: [
        {
          path: 'products.productId',
          select: 'title finalPrice images',
        },
      ],
    });
    if (!order) {
      throw new BadRequestException('Invalid order');
    }
    if (order.products.length === 0) {
      throw new BadRequestException('Order has no products');
    }
    const line_items = order.products.map((item) => ({
      price_data: {
        currency: 'egp',
        product_data: {
          name: item.productId['title'],
          images: item.productId['images'].map((img) => img.secure_url),
        },
        unit_amount: Math.round(item.productId['finalPrice'] * 100),
      },
      quantity: item.quantity,
    }));
    let discounts = [];
    if (order.couponId) {
      const stripeCoupon = await this.stripeService.createStripeCoupon(
        order.couponId,
      );
      //return stripeCoupon;
      if (stripeCoupon.valid === false) {
        throw new BadRequestException('Invalid coupon');
      }
      discounts.push({ coupon: stripeCoupon.id });
    }

    return await this.stripeService.createCheckoutSession({
      customer_email: user.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      line_items,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: (order.shipingFee + order.VAT) * 100,
              currency: 'egp',
            },
            display_name: 'Shipping Fee plus VAT',
          },
        },
      ],
      discounts,
    });
  }

  async getMyOrder(orderId: Types.ObjectId, user: IAuthUser) {
    const order = await this.orderRepository.findOne({
      filters: {
        _id: orderId,
        userId: user.user._id,
        orderStatus: OrderStatus.Pending,
      },
      populateArray: [
        {
          path: 'products.productId',
          select: 'title finalPrice images',
        },
      ],
    });
    return order;
  }

  async stripeWebhookHandler(data: any) {
    try {
      if (data.type === 'checkout.session.completed') {
        const orderId = data.data.object.metadata.orderId;
        const order = await this.orderRepository.updateOne({
          filters: { _id: orderId },
          update: {
            orderStatus: OrderStatus.PAID,
            payment_intent: data.data.object.payment_intent,
            orderChanges: { paidAt: DateTime.now() },
          },
        });
        const cart = await this.cartRepository.findOne({
          filters: { _id: order.cartId },
          populateArray: [
            {
              path: 'products.productId',
              select: 'title finalPrice images',
            },
          ],
        });
        await this.productRepository.decrementStock(cart);
        // clear cart
        cart.products = [];
        await this.cartRepository.save(cart);
        return order;
      }
    } catch (error) {
      throw new BadRequestException('Webhook handler error');
    }
  }

  async cancelOrderService(orderId: Types.ObjectId, user: IAuthUser) {
    const order = await this.orderRepository.findOne({
      filters: {
        _id: orderId,
        userId: user.user._id,
        orderStatus: {
          $in: [OrderStatus.Placed, OrderStatus.PAID, OrderStatus.Pending],
        },
      },
    });
    if (!order) {
      throw new BadRequestException('Invalid order');
    }
    //time difference between order creation and now should be less than 1 day
    const timeDiff = DateTime.now().diff(
      DateTime.fromJSDate(order['createdAt']),
      'hours',
    ).hours;
    if (timeDiff > 24) {
      throw new BadRequestException(
        'You can only cancel your order within 24 hours of placing it',
      );
    }
    await this.orderRepository.updateOne({
      filters: { _id: orderId },
      update: {
        orderStatus: OrderStatus.Refunded,
        orderChanges: {
          refundedAt: DateTime.now(),
          refundedBy: user.user._id,
        },
        cancelledAt: DateTime.now(),
        cancelledBy: user.user._id,
      },
    });

    if (order.paymentMethod === paymentMethods.Stripe) {
      await this.stripeService.refundPaymentIntent({
        payment_intent: order.payment_intent,
        reason: 'requested_by_customer',
      });
    }

    if(order.paymentMethod === paymentMethods.Paymob){
      await this.paymobService.refundTransaction(
        parseInt(order.paymobTransactionId),
        Math.round(order.total * 100),
      );
    }

    for (const item of order.products) {
      const product = await this.productRepository.findOne({
        filters: { _id: item.productId },
      });
      product.stock += item.quantity;
      await this.productRepository.save(product);
    }

    return 'Order cancelled successfully';
  }


  async createPaymobOrder(user: IAuthUser, orderId: Types.ObjectId) {

    const order = await this.orderRepository.findOne({
      filters: {
        _id: orderId,
        userId: user.user._id,
        orderStatus: OrderStatus.Pending,
      },
      populateArray: [
        {
          path: 'products.productId',
          select: 'title finalPrice images',
        },
      ],
    });
    if (!order) {
      throw new BadRequestException('Invalid order');
    }

    //address
    const address = await this.addressRepository.findOne({
      filters: { _id: order.addressId },
    });
    if (!address) {
      throw new BadRequestException('Invalid address');
    }

    const createPayment = await this.paymobService.createPayment({
      amountCents: order.total * 100,
      currency: 'EGP',
      merchantOrderId: orderId.toString(),
      billingData: {
        first_name: user.user.firstName,
        last_name: user.user.lastName,
        email: user.user.email,
        phone_number: '+20' + user.user.phone.replace(/^0/, ''),
        apartment: address.buildingNumber,
        floor: address.floorNumber.toString(),
        street: 'NA',
        building: address.buildingNumber.toString(),
        city: address.city,
        country: address.country,
        state: 'NA',
        postal_code: address.postalCode.toString(),
      },
      items: [
        ...order.products.map((item) => ({
          name: item.productId['title'],
          amount_cents: Math.round(item.finalPrice * 100),
          quantity: item.quantity,
        })),
      ],
    });

    return createPayment;
  }

  async paymobWebhookHandler(orderId: string, transactionId: string, paymobOrderId: string) {
      const order = await this.orderRepository.updateOne({
        filters: { _id: orderId },
        update: {
          orderStatus: OrderStatus.PAID,
          orderChanges: { paidAt: DateTime.now() },
          paymobTransactionId: transactionId,
          paymobOrderId: paymobOrderId,
        },
        options: { new: true },
      });
      const cart = await this.cartRepository.findOne({
        filters: { _id: order.cartId },
        populateArray: [
          {
            path: 'products.productId',
            select: 'title finalPrice images',
          },
        ],
      });
      await this.productRepository.decrementStock(cart);
      // clear cart
      cart.products = [];
      await this.cartRepository.save(cart);
      return order;
  }
}
