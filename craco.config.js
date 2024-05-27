const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                    content: paths.appSrc + '/chromeServices/DOMEvaluator.tsx',
                    background: paths.appSrc + '/sidepanel/service-worker.tsx'
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
                        to: 'static/js',
                    },
                ],
            }),
        ],
    }
}
