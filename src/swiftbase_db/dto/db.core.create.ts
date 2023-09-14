import { IsString, IsNotEmpty } from 'class-validator';

export default class CreateDatabaseDto {
  @IsString()
  @IsNotEmpty()
  project_id: string;
}
