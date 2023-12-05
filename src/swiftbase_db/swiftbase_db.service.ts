import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from 'src/database/database.service';
import InsertRecordDto from './dto/db.insert';
import ListRecordsDto from './dto/db.list';
import FindByConstraintDto from './dto/db.find';
import DbUpdateDto from './dto/db.update';
import DeleteRecordDto from './dto/db.delete';
import CreateDatabaseDto from './dto/db.core.create';

@Injectable()
export class SwiftbaseDbService {
  constructor(private prisma: prisma, private jwtService: JwtService) {}

  // async getModels(projectId:string) {
  //   const models = await this.prisma.swiftbase_db.
  // }
  async getDbInfo(projectId: string) {
    try {
      console.log(projectId);
      const serviceInfo = await this.prisma.swiftbase_db.findUniqueOrThrow({
        where: {
          project_id: projectId,
        },
        select: {
          id: true,
          token: true,
          modles: {
            select: {
              model_name: true,
            },
          },
        },
      });

      return serviceInfo;
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteRecord(payload: DeleteRecordDto) {
    const constraints = await this.constraintBuilder(payload.raw_constraints);
    const result = await this.prisma.models.deleteMany({
      where: {
        AND: [
          { model_name: `${payload.database_id}-${payload.model_name}` },
          ...constraints,
        ],
      },
    });
    return result;
  }

  async createDB(payload: CreateDatabaseDto) {
    console.log('====== in create db service =====');
    console.log(payload);
    let id = uuidv4();
    const token = await this.jwtService.signAsync(id);

    let result = await this.prisma.swiftbase_db.create({
      data: {
        id,
        token,
        project_id: payload.project_id,
      },
      select: {
        id: true,
        modles: true,
        project_id: true,
      },
    });
    return {
      id: result.id,
      token,
      modles: result.modles,
      project_id: result.project_id,
    };
  }

  async updateRecord(payload: DbUpdateDto) {
    const query = await this.constraintBuilder(payload.constraints);
    const originalData = (
      await this.get({
        database_id: payload.database_id,
        model_name: payload.model_name,
        constraints: payload.constraints,
      })
    )[0] as Prisma.JsonObject;
    let OG = JSON.parse(JSON.stringify(originalData.data));
    const result = await this.prisma.models.updateMany({
      where: {
        AND: [
          { model_name: `${payload.database_id}-${payload.model_name}` },
          ...query,
        ],
      },
      data: {
        data: {
          ...OG,
          ...payload.data,
        },
      },
    });
    return result;
  }

  async constraintBuilder(constraints: any) {
    const keys = Object.keys(constraints);
    let query = keys.map((key) => ({
      data: { path: [key], equals: constraints[key] },
    }));
    return query;
  }

  async get(payload: FindByConstraintDto) {
    const query = await this.constraintBuilder(payload.constraints);
    const result = await this.prisma.models.findMany({
      where: {
        AND: [
          { model_name: `${payload.database_id}-${payload.model_name}` },
          ...query,
        ],
      },
      select: {
        data: true,
      },
    });
    return result as Prisma.JsonArray;
  }

  async getRecords(payload: ListRecordsDto) {
    const records: any = await this.prisma.models.findMany({
      where: {
        model_name: `${payload.database_id}-${payload.model_name}`,
      },
      select: {
        data: true,
      },
    });

    return records;
  }

  async create(project_id: string) {
    try {
      const id = uuidv4();
      const token = await this.jwtService.signAsync(id);
      const result = await this.prisma.swiftbase_db.create({
        data: {
          id,
          token: token,
          project_id,
        },
        select: {
          id: true,
          token: true,
        },
      });

      return {
        db_token: token,
      };
    } catch (error) {}
  }

  async getProjectId(headers: Record<string, any>) {
    try {
      console.log(headers.authorization.split(' ')[1]);
      const project_id = await this.jwtService.verifyAsync(
        headers.authorization.split(' ')[1],
        {
          secret: 'SECRET',
        },
      );
      return project_id;
    } catch (error) {}
  }

  async createModel(database_id: string, model_name: string) {
    try {
      const result = await this.prisma.models.create({
        data: {
          database_id,
          model_name: `${database_id}-${model_name}`,
        },
      });

      return result;
    } catch (error) {
      console.log(
        '==================== database already exists =================',
      );
      console.log(error);
      throw error;
    }
  }

  async insertRecord(payload: InsertRecordDto) {
    try {
      //database_id: string, requestBody: any
      const result = await this.prisma.models.create({
        data: {
          id: payload.id ? payload.id : uuidv4(),
          model_name: `${payload.database_id}-${payload.model_name}`,
          database_id: payload.database_id,
          data: payload.data,
        },
      });
      return result;
    } catch (error) {
      console.log('============== in insertRecord =================');
      console.log(error);
    }
  }

  async getAllRecords(database_id: string, model_name: string) {
    const result = await this.prisma.models.findMany({
      where: {
        model_name: `${database_id}-${model_name}`,
      },
    });
    return result;
  }
}
