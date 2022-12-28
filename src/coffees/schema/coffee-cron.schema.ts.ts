import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoffeeCronSchemaDocument = HydratedDocument<CoffeeCron>;

@Schema()
export class CoffeeCron {
  @Prop()
  name: string;

  @Prop()
  time: string;
}

export const CoffeeCronSchema = SchemaFactory.createForClass(CoffeeCron);
