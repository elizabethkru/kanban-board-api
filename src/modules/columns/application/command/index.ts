import { CreateColumnHandler } from './create-column/create-column.handler';
import { DeleteColumnHandler } from './delete-column/delete-column.handler';
import { UpdateColumnHandler } from './update-column/update-column.handler';

export const commandHandlers = [
  CreateColumnHandler,
  UpdateColumnHandler,
  DeleteColumnHandler,
];
