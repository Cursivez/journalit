function isDomRangeType(type) {
  if (type.isUnionOrIntersection()) {
    return type.types.some(isDomRangeType);
  }

  const symbol = type.aliasSymbol ?? type.getSymbol();
  if (symbol?.getName() !== 'Range') return false;

  return (symbol.getDeclarations() ?? []).some((declaration) =>
    declaration.getSourceFile().fileName.endsWith('lib.dom.d.ts')
  );
}

export const noRangeDetachRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the deprecated, no-op DOM Range.detach() method.',
    },
    messages: {
      deprecated:
        'Range.detach() is deprecated and has no effect; remove the call.',
    },
    schema: [],
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    if (!services?.program || !services.esTreeNodeToTSNodeMap) return {};

    const checker = services.program.getTypeChecker();
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type !== 'MemberExpression' ||
          callee.computed ||
          callee.property.type !== 'Identifier' ||
          callee.property.name !== 'detach'
        ) {
          return;
        }

        const receiver = services.esTreeNodeToTSNodeMap.get(callee.object);
        if (!isDomRangeType(checker.getTypeAtLocation(receiver))) return;

        context.report({ node, messageId: 'deprecated' });
      },
    };
  },
};
