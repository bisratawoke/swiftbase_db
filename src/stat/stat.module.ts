import { Module } from '@nestjs/common';
import { StatService } from './stat.service';

@Module({
  providers: [StatService],
  exports: [StatService],
})
export class StatModule {}
