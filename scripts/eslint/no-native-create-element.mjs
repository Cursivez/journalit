function getMemberPropertyName(memberExpression) {
  if (
    !memberExpression.computed &&
    memberExpression.property.type === 'Identifier'
  ) {
    return memberExpression.property.name;
  }

  if (
    memberExpression.computed &&
    memberExpression.property.type === 'Literal' &&
    typeof memberExpression.property.value === 'string'
  ) {
    return memberExpression.property.value;
  }

  return null;
}

const NATIVE_CREATE_METHODS = new Set([
  'createElement',
  'createElementNS',
  'createDocumentFragment',
]);

export const noNativeCreateElementRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer Obsidian DOM helpers over native DOM element and fragment creation.',
    },
    messages: {
      preferObsidianHelper:
        'Use Obsidian createEl/createDiv/createSpan/createSvg/createFragment helpers instead of native DOM creation methods.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== 'MemberExpression') return;
        if (!NATIVE_CREATE_METHODS.has(getMemberPropertyName(callee))) return;

        if (
          callee.object.type === 'Identifier' &&
          callee.object.name === 'React'
        ) {
          return;
        }

        context.report({ node, messageId: 'preferObsidianHelper' });
      },
    };
  },
};
