import { Module } from '@nestjs/common';
import { SwiftbaseDbService } from './swiftbase_db.service';
import { DatabaseModule } from 'src/database/database.module';
import { SwiftbaseDbController } from './swiftbase_db.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
  providers: [SwiftbaseDbService],
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'SECRET',
    }),
  ],
  controllers: [SwiftbaseDbController],
})
export class SwiftbaseDbModule {}
