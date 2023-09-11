import {
  IsString,
  IsObject,
  IsNotEmpty,
  IsNotEmptyObject,
} from 'class-validator';

export default class DbUpdateDto {
  @IsString()
  @IsNotEmpty()
  database_id: string;

  @IsString()
  @IsNotEmpty()
  model_name: string;

  @IsObject()
  @IsNotEmptyObject()
  constraints: Record<string, any>;

  @IsObject()
  @IsNotEmptyObject()
  data: Record<string, any>;
}
