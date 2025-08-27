import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService, CartResponse } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/auth-request.type';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the cart (increment if exists)' })
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart after add', type: Object })
  async addItem(
    @Req() req: { user: AuthenticatedUser },
    @Body() dto: AddCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.addItem(
      req.user.sub,
      dto.productId,
      dto.quantity ?? 1,
    );
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update quantity of a cart item (absolute value)' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart after update', type: Object })
  async updateItem(
    @Req() req: { user: AuthenticatedUser },
    @Param('productId', ParseIntPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.updateItem(req.user.sub, productId, dto.quantity);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Cart after removal', type: Object })
  async removeItem(
    @Req() req: { user: AuthenticatedUser },
    @Param('productId', ParseIntPipe) productId: string,
  ): Promise<CartResponse> {
    return this.cartService.removeItem(req.user.sub, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Current cart', type: Object })
  async getCart(
    @Req() req: { user: AuthenticatedUser },
  ): Promise<CartResponse> {
    return this.cartService.getCart(req.user.sub);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear current cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared', type: Object })
  async clearCart(
    @Req() req: { user: AuthenticatedUser },
  ): Promise<CartResponse> {
    return this.cartService.clearCart(req.user.sub);
  }
}
