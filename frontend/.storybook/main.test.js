// frontend/.storybook/main.test.js
// Unit tests for Visual Regression Testing Setup

const { visualRegressionUtils } = require('./main');

describe('Visual Regression Testing - Core Logic', () => {

  // Test 1: Token validation
  describe('validateChromaticToken', () => {
    it('should return false when token is not set', () => {
      delete process.env.CHROMATIC_PROJECT_TOKEN;
      const result = visualRegressionUtils.validateChromaticToken();
      expect(result).toBe(false);
    });

    it('should return true when token is set', () => {
      process.env.CHROMATIC_PROJECT_TOKEN = 'test-token-123';
      const result = visualRegressionUtils.validateChromaticToken();
      expect(result).toBe(true);
    });
  });

  // Test 2: Retry logic
  describe('retryTest', () => {
    it('should return result on first success', async () => {
      const mockTest = jest.fn().mockResolvedValue('success');
      const result = await visualRegressionUtils.retryTest(mockTest);
      expect(result).toBe('success');
      expect(mockTest).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockTest = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      const result = await visualRegressionUtils.retryTest(mockTest);
      expect(result).toBe('success');
      expect(mockTest).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries', async () => {
      const mockTest = jest.fn().mockRejectedValue(new Error('always fails'));
      await expect(visualRegressionUtils.retryTest(mockTest, 3))
        .rejects.toThrow('Test failed after 3 retries');
    });
  });

  // Test 3: Baseline config
  describe('getBaselineConfig', () => {
    it('should return valid baseline config', () => {
      const config = visualRegressionUtils.getBaselineConfig();
      expect(config).toHaveProperty('threshold');
      expect(config).toHaveProperty('delay');
      expect(config).toHaveProperty('diffThreshold');
    });

    it('should have correct default values', () => {
      const config = visualRegressionUtils.getBaselineConfig();
      expect(config.threshold).toBe(0.2);
      expect(config.delay).toBe(300);
    });
  });

}); 