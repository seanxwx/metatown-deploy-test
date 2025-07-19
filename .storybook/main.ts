import { type StorybookConfig } from '@storybook/nextjs'
import { type RuleSetRule } from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  previewHead: (head) => `
    ${head}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <style>
      :root {
        --font-roboto: 'Roboto', sans-serif;
      }
    </style>
  `,
  webpackFinal: (webpackConfig) => {
    webpackConfig.module = webpackConfig.module ?? {}
    webpackConfig.module.rules = webpackConfig.module.rules ?? []

    const imageRule = webpackConfig.module.rules.find(
      (rule): rule is RuleSetRule =>
        typeof rule === 'object' &&
        rule !== null &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
    )

    if (imageRule) {
      imageRule.exclude = /\.svg$/
    }

    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return webpackConfig
  },
}

export default config
