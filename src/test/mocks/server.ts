import { setupServer } from 'msw/node';
import { handlers, additionalHandlers } from './handlers';

export const server = setupServer(...handlers, ...additionalHandlers);
