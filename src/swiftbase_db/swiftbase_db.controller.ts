import {
  Controller,
  Body,
  Req,
  Res,
  Post,
  Request,
  Get,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { SwiftbaseDbService } from './swiftbase_db.service';

import { request } from 'http';

@Controller('swiftbase-db')
export class SwiftbaseDbController {
  constructor(private swiftbaseDbService: SwiftbaseDbService) {}

  @Post('/insert')
  async insert(@Body() requestBody, @Req() req: Request) {
    const databaseId: string = await this.swiftbaseDbService.getProjectId(
      req.headers,
    );
    const res = await this.swiftbaseDbService.insertRecord(
      databaseId,
      requestBody,
    );
  }

  // @Post('/create')
  // async create(@Body() requestBody, @Req() req: Request) {
  //   const projectId = await this.swiftbaseDbService.getProjectId(req.headers);

  //   const database_id = await this.swiftbaseDbService.createModel(
  //     projectId,
  //     requestBody.model_name,
  //   );
  //   return database_id;
  // }

  @Post('/list')
  async list(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const records = await this.swiftbaseDbService.getRecords(
      database_id,
      requestBody.model_name,
    );
    return records;
  }

  @Post('/find')
  async get(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const result = await this.swiftbaseDbService.get(
      database_id,
      requestBody.model_name,
      requestBody.constraints,
    );
    console.log(result);
    return result;
  }

  @Put('/update')
  async update(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const result = await this.swiftbaseDbService.updateRecord(
      database_id,
      requestBody.model_name,
      requestBody.constraints,
      requestBody.data,
    );
    return result;
  }

  @Post('/delete')
  @HttpCode(200)
  async delete(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const result = await this.swiftbaseDbService.deleteRecord(
      database_id,
      requestBody.model_name,
      requestBody.constraints,
    );
    return result;
  }
}
