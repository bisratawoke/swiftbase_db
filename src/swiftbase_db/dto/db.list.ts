import { IsString } from 'class-validator';
export default class ListRecordsDto {
  @IsString()
  model_name: string;
  @IsString()
  database_id: string;
}
