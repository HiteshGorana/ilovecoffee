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
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Get(':type/stop/:cronName')
  removeCoffeeCronJob(
    @Param('type') type: 'cron' | 'timeout' | 'interval',
    @Param('cronName') cronName: string,
  ) {
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

  @Get('schedules')
  getCoffeesJobs() {
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

  @Get(':type/start/:cronName')
  addCoffeeCronJob(
    @Param('type') type: 'cron' | 'timeout' | 'interval',
    @Param('cronName') cronName: string,
  ) {
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
      const job = new CronJob(`10 * * * * *`, () => {
        this.coffeesService.logger.warn(
          `time (10) for job ${cronName} to run!`,
        );
      });
      this.schedulerRegistry.addCronJob(cronName, job);
      job.start();
      return `Started ${cronName} every 10 sec`;
    }
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
