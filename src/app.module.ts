import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SwiftbaseDbModule } from './swiftbase_db/swiftbase_db.module';
import { SecurityModule } from './security/security.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [DatabaseModule, SwiftbaseDbModule, SecurityModule, StatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
