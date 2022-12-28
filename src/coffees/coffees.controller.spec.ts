import { Test } from '@nestjs/testing';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { ScheduleModule } from '@nestjs/schedule';

describe('CoffeesController', () => {
  let coffeeController: CoffeesController;
  let coffeeService: CoffeesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      controllers: [CoffeesController],
      providers: [CoffeesService],
    }).compile();
    coffeeService = moduleRef.get<CoffeesService>(CoffeesService);
    coffeeController = moduleRef.get<CoffeesController>(CoffeesController);
  });

  describe('getCoffee', () => {
    it('should return an Coffee Object', async () => {
      const result: Coffee = {
        id: 1,
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: ['chocolate', 'vanilla'],
      };
      jest
        .spyOn(coffeeService, 'getCoffee')
        .mockImplementation(async () => result);

      expect(await coffeeController.getCoffee(0)).toBe(result);
    });
  });

  describe('getCoffees', () => {
    it('should return an Coffees', async () => {
      const result: Coffee[] = [
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
      jest
        .spyOn(coffeeService, 'getCoffees')
        .mockImplementation(async () => result);
      expect(await coffeeController.getCoffees()).toBe(result);
    });
  });
  describe('createCoffee', () => {
    it('create coffee', async () => {
      const result: Coffee = {
        id: 2,
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: ['chocolate', 'vanilla'],
      };
      jest
        .spyOn(coffeeService, 'createCoffee')
        .mockImplementation(async () => result);
      expect(await coffeeController.createCoffee(result)).toBe(result);
    });
  });
});
