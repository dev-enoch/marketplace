import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductService } from './product.service';
import { SearchProductsDto } from './dto/search-products.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productService.create(dto, req.user.sub);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Search and filter products' })
  @ApiQuery({ type: SearchProductsDto })
  @ApiResponse({ status: 200, description: 'Paginated products result' })
  @Get('search')
  async search(@Query() dto: SearchProductsDto) {
    return this.productService.search(dto);
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(Number(id));
  }
}
