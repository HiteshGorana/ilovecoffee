import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get(':type/stop/:cronName')
  removeCoffeeCronJob(
    @Param('type') type: 'cron' | 'timeout' | 'interval',
    @Param('cronName') cronName: string,
  ) {
    return this.coffeesService.removeCronJob(type, cronName);
  }

  @Get('schedules')
  async getCoffeesJobs() {
    return await this.coffeesService.getCoffeeJobs();
  }

  @Get(':type/start/:cronName')
  addCoffeeCronJob(
    @Param('type') type: 'cron' | 'timeout' | 'interval',
    @Param('cronName') cronName: string,
  ) {
    return this.coffeesService.setCronJob(type, cronName);
  }

  @Get()
  getCoffees() {
    return this.coffeesService.getCoffees();
  }

  @Get(':coffeeId')
  getCoffee(@Param('coffeeId') coffeeId: number) {
    return this.coffeesService.getCoffee(coffeeId);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  createCoffee(@Body() coffee: CreateCoffeeDto) {
    return this.coffeesService.createCoffee(coffee);
  }

  @Patch(':coffeeId')
  updateCoffee(
    @Param('coffeeId') coffeeId: number,
    @Body() coffee: UpdateCoffeeDto,
  ) {
    return this.coffeesService.updateCoffee(coffeeId, coffee);
  }

  @Delete(':coffeeId')
  removeCoffee(@Param('coffeeId') coffeeId: number) {
    return this.coffeesService.removeCoffee(coffeeId);
  }
}
