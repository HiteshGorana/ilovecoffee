import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CoffeesService {
  logger = new Logger(CoffeesService.name);
  private coffees: Coffee[] = [
    {
      id: 0,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  // cron jobs
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'coffees' })
  handleCoffeeCron() {
    this.logger.debug('Called every 10 seconds');
  }

  // cron jobs ends
  async getCoffees() {
    return this.coffees;
  }

  async getCoffee(coffeeId: number) {
    const coffee = this.coffees.find((coffee) => coffee.id === +coffeeId);
    if (!coffee) {
      this.logger.error(`Coffee not found with ID -> ${coffeeId}`);
      throw new NotFoundException(`coffee ${coffeeId} not found`);
    }
    return coffee;
  }

  async createCoffee(coffee: any) {
    this.coffees.push(coffee);
    return coffee;
  }

  async updateCoffee(coffeeId: number, coffee: any) {
    const getCoffee = await this.getCoffee(coffeeId);
  }

  async removeCoffee(coffeeId: number) {
    const coffeeIndex = this.coffees.findIndex(
      (coffee) => coffee.id === +coffeeId,
    );
    const hasCoffee = coffeeIndex >= 0;
    if (hasCoffee) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
