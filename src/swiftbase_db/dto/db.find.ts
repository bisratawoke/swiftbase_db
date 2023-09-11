import { IsObject, IsString } from 'class-validator';

export default class FindByConstraintDto {
  @IsString()
  database_id: string;
  @IsString()
  model_name: string;
  @IsObject()
  constraints: Record<string, any>;
}
