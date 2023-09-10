import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from 'src/database/database.service';

@Injectable()
export class SwiftbaseDbService {
  constructor(private prisma: prisma, private jwtService: JwtService) {}

  async deleteRecord(
    database_id: string,
    model_name: string,
    raw_constraints: any,
  ) {
    const constraints = await this.constraintBuilder(raw_constraints);
    const result = await this.prisma.models.deleteMany({
      where: {
        AND: [{ model_name: `${database_id}-${model_name}` }, ...constraints],
      },
    });
    return result;
  }
  async updateRecord(
    database_id: string,
    model_name: string,
    constraints: any,
    data: any,
  ) {
    const query = await this.constraintBuilder(constraints);
    const originalData = (
      await this.get(database_id, model_name, constraints)
    )[0] as Prisma.JsonObject;
    let OG = JSON.parse(JSON.stringify(originalData.data));
    const result = await this.prisma.models.updateMany({
      where: {
        AND: [{ model_name: `${database_id}-${model_name}` }, ...query],
      },
      data: {
        data: {
          ...OG,
          ...data,
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
  async get(
    database_id: string,
    model_name: string,
    constraints: Array<Record<string, any>>,
  ) {
    const query = await this.constraintBuilder(constraints);
    const result = await this.prisma.models.findMany({
      where: {
        AND: [{ model_name: `${database_id}-${model_name}` }, ...query],
      },
      select: {
        data: true,
      },
    });
    return result as Prisma.JsonArray;
  }
  async getRecords(database_id: string, model_name: string) {
    const records: any = await this.prisma.models.findMany({
      where: {
        model_name: `${database_id}-${model_name}`,
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
          project: {
            connect: {
              id: project_id,
            },
          },
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
      // const result = await this.prisma.models.create({
      //   data: {

      //          database_id,
      //          model_name: `${database_id}-${model_name}`,

      //     },

      // });

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

  async insertRecord(database_id: string, requestBody: any) {
    try {
      const result = await this.prisma.models.create({
        data: {
          id: requestBody.id ? requestBody.id : uuidv4(),
          model_name: `${database_id}-${requestBody.model_name}`,
          database_id,
          data: requestBody.data,
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
