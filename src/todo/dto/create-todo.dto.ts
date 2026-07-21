import { IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Length(1, 50)
  title!: string;
}
