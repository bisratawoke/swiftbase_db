import { IsString, IsObject, IsOptional } from 'class-validator';
export default class InsertRecordDto {
  @IsString()
  model_name: string;
  @IsString()
  database_id: string;
  @IsObject()
  data: Record<string, any>;
  @IsOptional()
  id?: string;
}
