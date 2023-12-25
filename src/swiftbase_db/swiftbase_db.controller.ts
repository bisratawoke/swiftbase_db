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
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SwiftbaseDbService } from './swiftbase_db.service';

import { request } from 'http';
import CreateDatabaseDto from './dto/db.core.create';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { StatService } from 'src/stat/stat.service';

@Controller('swiftbase-db')
export class SwiftbaseDbController {
  constructor(
    private swiftbaseDbService: SwiftbaseDbService,
    private statService: StatService,
  ) {}

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

    process.nextTick(async () => {
      await this.statService.insert({
        project_id: databaseId,
        query_type: 'WRITE',
      });
    });
  }

  @Post('/core/create')
  async createDB(@Body() requestBody: CreateDatabaseDto, @Req() req: Request) {
    const result = await this.swiftbaseDbService.createDB(requestBody);
    console.log(result);
    return result;
  }

  @Get('/core/info/:projectId')
  async getDbInfo(@Param() params: any) {
    const service = await this.swiftbaseDbService.getDbInfo(params.projectId);
    console.log(service);
    return service;
  }

  @Post('/list')
  async list(@Body() requestBody, @Req() req: Request) {
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    let payload = {
      database_id,
      model_name: requestBody.model_name,
    };
    console.log(payload);
    const records = await this.swiftbaseDbService.getRecords(payload);
    process.nextTick(async () => {
      await this.statService.insert({
        project_id: database_id,
        query_type: 'READ',
      });
    });
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
    process.nextTick(async () => {
      await this.statService.insert({
        project_id: database_id,
        query_type: 'READ',
      });
    });
    return result;
  }

  @Get('/core/stat/:queryType')
  async getStats(@Req() req: Request, @Param() params: any) {
    console.log('======= in get stat =================');
    console.log(params);
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    const response = await this.statService.fetch({
      project_id: database_id,
      query_type: params.queryType.toUpperCase(),
    });
    return response;
  }

  @Put('/update')
  async update(@Body() requestBody, @Req() req: Request) {
    console.log('======= in update record =======');
    const database_id = await this.swiftbaseDbService.getProjectId(req.headers);
    let payload = {
      database_id,
      model_name: requestBody.model_name,
      constraints: requestBody.constraints,
      data: requestBody.data,
    };
    console.log(payload);
    const result = await this.swiftbaseDbService.updateRecord(payload);
    process.nextTick(
      async () =>
        await this.statService.insert({
          project_id: database_id,
          query_type: 'UPDATE',
        }),
    );
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
    process.nextTick(async () => {
      await this.statService.insert({
        project_id: database_id,
        query_type: 'DELETE',
      });
    });
    return result;
  }
}
