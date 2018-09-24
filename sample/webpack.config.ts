import {createConfig} from 'reactivated/webpack';
import settings from './server/settings.json';

const config = createConfig(settings);

export default {
    ...config,
};
