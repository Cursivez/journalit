

import { noNativeCreateElementRule } from './no-native-create-element.mjs';
import { noRangeDetachRule } from './no-range-detach.mjs';




const restrictedSyntaxRule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow the selectors listed in the rule options.' },
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['selector', 'message'],
        additionalProperties: false,
      },
    },
  },
  create(context) {
    const visitors = {};
    for (const { selector, message } of context.options) {
      visitors[selector] = (node) => context.report({ node, message });
    }
    return visitors;
  },
};

export default {
  meta: { name: 'journalit' },
  rules: {
    'no-native-create-element': noNativeCreateElementRule,
    'no-range-detach': noRangeDetachRule,
    'restricted-syntax': restrictedSyntaxRule,
  },
};
