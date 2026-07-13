import unsupportedBrowserFeatures from 'stylelint-no-unsupported-browser-features';

export default {
  plugins: [unsupportedBrowserFeatures],
  rules: {
    'plugin/no-unsupported-browser-features': [
      true,
      {
        
        browsers: ['Chrome 132'],
        ignorePartialSupport: false,
      },
    ],
  },
};
