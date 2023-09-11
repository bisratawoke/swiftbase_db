import {
  IsString,
  IsObject,
  IsNotEmpty,
  IsNotEmptyObject,
} from 'class-validator';

export default class DeleteRecordDto {
  @IsString()
  @IsNotEmpty()
  database_id: string;

  @IsString()
  @IsNotEmpty()
  model_name: string;

  @IsObject()
  @IsNotEmptyObject()
  raw_constraints: Record<string, any>;
}
