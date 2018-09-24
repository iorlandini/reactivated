import app from './app';
import settings from './settings.json';

const DJANGO_DEBUG_PORT = settings.DEBUG_PORT;
const NODE_DEBUG_PORT = DJANGO_DEBUG_PORT + 100;

app.listen({node: NODE_DEBUG_PORT, django: DJANGO_DEBUG_PORT}, () => console.log(`Listening on port ${NODE_DEBUG_PORT}!`))
