import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';

class AddItemDto {
  productId: string;
  quantity?: number;
}

class UpdateItemDto {
  quantity: number;
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user cart' })
  @ApiResponse({ status: 200, description: 'Returns the user cart with items' })
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiBody({ type: AddItemDto })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  addItem(@Req() req, @Body() body: AddItemDto) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Put('update/:productId')
  @ApiOperation({ summary: 'Update quantity of a cart item' })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({ status: 200, description: 'Item quantity updated' })
  updateItem(
    @Req() req,
    @Param('productId') productId: string,
    @Body() body: UpdateItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, body.quantity);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  removeItem(@Req() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.id, productId);
  }
}
