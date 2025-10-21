import { setupWorker } from 'msw/browser';
import { handlers, additionalHandlers } from './handlers';

export const worker = setupWorker(...handlers, ...additionalHandlers);
