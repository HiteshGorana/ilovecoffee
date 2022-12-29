import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CoffeesService {
  constructor(private schedulerRegistry: SchedulerRegistry) {
  }

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

  async getCoffeeJobs() {
    const cronJobs = [];
    for (const schedule of this.schedulerRegistry.getCronJobs()) {
      const cronjob = {
        cron: schedule[0],
        time: schedule[1]['cronTime']['source'],
      };
      cronJobs.push(cronjob);
    }
    return cronJobs;
  }

  async setCronJob(type, cronName) {
    const hasCronJob = this.schedulerRegistry.doesExist(type, cronName);
    if (hasCronJob) {
      const cronJob = this.schedulerRegistry.getCronJob(cronName);
      if (!cronJob.running) {
        cronJob.start();
        return `${cronName} Started Running`;
      } else {
        return `${cronName} already Running`;
      }
    } else {
      const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => {
        this.logger.warn(`time (10) for job ${cronName} to run!`);
      });
      this.schedulerRegistry.addCronJob(cronName, job);
      job.start();
      return `Started ${cronName} every 10 sec`;
    }
  }

  async removeCronJob(type, cronName) {
    const hasCronJob = this.schedulerRegistry.doesExist(type, cronName);
    if (hasCronJob) {
      const cronJob = this.schedulerRegistry.getCronJob(cronName);
      if (!cronJob.running) {
        return `${cronName} Not Running`;
      } else {
        cronJob.stop();
        return `${cronName} Stopped`;
      }
    } else {
      return `Not Found ${cronName}`;
    }
  }
}
