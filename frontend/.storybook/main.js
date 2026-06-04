// frontend/.storybook/main.js
// Visual Regression Testing Setup with Chromatic

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Core visual regression testing logic
  async viteFinalConfig(config) {
    try {
      return {
        ...config,
        define: {
          ...config.define,
          'process.env.CHROMATIC_PROJECT_TOKEN': JSON.stringify(
            process.env.CHROMATIC_PROJECT_TOKEN || ''
          ),
        },
      };
    } catch (error) {
      console.error('Storybook config error:', error.message);
      return config;
    }
  },
};

// Visual regression testing utilities
const visualRegressionUtils = {
  // Check if Chromatic token is configured
  validateChromaticToken() {
    try {
      const token = process.env.CHROMATIC_PROJECT_TOKEN;
      if (!token) {
        console.warn('Warning: CHROMATIC_PROJECT_TOKEN is not set.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error.message);
      return false;
    }
  },

  // Retry logic for flaky tests
  async retryTest(testFn, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await testFn();
      } catch (error) {
        if (i === retries - 1) {
          throw new Error(`Test failed after ${retries} retries: ${error.message}`);
        }
        console.warn(`Retry attempt ${i + 1} of ${retries}`);
      }
    }
  },

  // Baseline screenshot management
  getBaselineConfig() {
    try {
      return {
        threshold: 0.2,
        delay: 300,
        diffThreshold: 0.063,
      };
    } catch (error) {
      console.error('Baseline config error:', error.message);
      return {};
    }
  },
};

module.exports = { ...config, visualRegressionUtils };