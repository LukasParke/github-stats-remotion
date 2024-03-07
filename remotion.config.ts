/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import {Config} from '@remotion/cli/config';
import {webpackOverride} from './src/webpack-override';

// Config.setConcurrency(30);
Config.setScale(2);
Config.setCodec('gif');
Config.setVideoImageFormat('png');
Config.setNumberOfGifLoops(0);
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(webpackOverride);
