import { PartialType } from '@nestjs/swagger';
import { CreateTableSessionDto } from './create-table-session.dto';

export class UpdateTableSessionDto extends PartialType(CreateTableSessionDto) {}
