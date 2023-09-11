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
    const payload = {
      database_id: databaseId,
      model_name: requestBody.model_name,
      data: requestBody.data,
    };
    const res = await this.swiftbaseDbService.insertRecord(payload);
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
    let payload = {
      database_id,
      model_name: requestBody.model_name,
    };
    const records = await this.swiftbaseDbService.getRecords(payload);
    return records;
  }

  @Post('/find')
  async get(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    let payload = {
      database_id,
      model_name: requestBody.model_name,
      constraints: requestBody.constraints,
    };
    const result = await this.swiftbaseDbService.get(payload);
    console.log(result);
    return result;
  }

  @Put('/update')
  async update(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    let payload = {
      database_id,
      model_name: requestBody.model_name,
      constraints: requestBody.constraints,
      data: requestBody.data,
    };
    const result = await this.swiftbaseDbService.updateRecord(payload);
    return result;
  }

  @Post('/delete')
  @HttpCode(200)
  async delete(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const payload = {
      database_id,
      model_name: requestBody.model_name,
      raw_constraints: requestBody.constraints,
    };
    const result = await this.swiftbaseDbService.deleteRecord(payload);
    return result;
  }
}
