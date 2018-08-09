import React from 'react';
import webpack from 'webpack';
import path from 'path';
import express, {Request, Response} from 'express';
import ReactDOMServer from 'react-dom/server';
import Helmet, {HelmetData} from 'react-helmet';
import {getStyles} from 'typestyle';
import {compile} from 'json-schema-to-typescript'
import fs from 'fs';

import httpProxy, {ServerOptions} from 'http-proxy';

const app = express();

export const renderPage = ({html, helmet, css, props}: {html: string, helmet: HelmetData, css: string, props: any}) => `
<!DOCTYPE html>
<html>
<html ${helmet.htmlAttributes.toString()}>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <style id="styles-target">
        ${css}
    </style>
    <script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(props).replace(/</g, '\\u003c')}
    </script>
</head>
<body ${helmet.bodyAttributes.toString()}>
    <div id="root">${html}</div>
    <script src="/media/dist/bundle.js"></script>
</body>
</html>
`;

const PATHS = [
    '/',
    '/form/',
]

interface ListenOptions {
    node: number|string;
    django: number|string;
}

export default {
    listen: async (options: ListenOptions, callback?: () => void) => {
        const proxy = httpProxy.createProxyServer();

        proxy.on('proxyRes', (proxyRes, req, res) => {
            let body = Buffer.from('') //, 'utf8');

            proxyRes.on('data', function (data) {
                body = Buffer.concat([body, data as Buffer]);
            });
            proxyRes.on('end', function () {
                const response = body // .toString('utf8');

                if ('raw' in (req as any).query || proxyRes.headers['content-type'] !== 'application/ssr+json') {
                    res.writeHead(proxyRes.statusCode!, proxyRes.headers)
                    res.end(response);
                }
                else {
                    let body;

                    try {
                        const props = JSON.parse(response.toString('utf8'));
                        const template_path = `${process.cwd()}/client/templates/${props.template_name}.tsx`;

                        // TODO: disable this in production.
                        if (process.env.NODE_ENV !== 'production') {
                            delete require.cache[template_path];
                        }

                        const Template = require(template_path).default;
                        const rendered = ReactDOMServer.renderToString(<Template {...props} />);
                        const helmet = Helmet.renderStatic();
                        const css = getStyles();

                        body = renderPage({
                            html: rendered,
                            helmet,
                            css,
                            props,
                        });
                    }
                    catch (error) {
                        body = error.stack;
                    }

                    res.writeHead(proxyRes.statusCode!, {
                        ...proxyRes.headers,
                        'Content-Type': 'text/html; charset=utf-8',
                        'Content-Length': Buffer.byteLength(body),
                    });
                    res.end(body);
                }

            });
        });

        const target = typeof options.django == 'number' ? `http://localhost:${options.django}` : {
            socketPath: options.django,
        } as ServerOptions['target'];

        app.use(PATHS, (req, res, next) => {
            proxy.web(req, res, {
                // Change origin cannot be used with sockets.
                // changeOrigin: true,
                selfHandleResponse: true,
                target,
            });
        });
        app.listen(options.node, callback);
    },
};
