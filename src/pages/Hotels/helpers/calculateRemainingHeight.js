const calculateRemainingHeight = (rootElement) => {
  const childrenHeight = (
    Array.from(rootElement.childNodes)
      .reduce((height, childNode) => (childNode.clientHeight + height), 0)
  );
  return rootElement.clientHeight - childrenHeight;
};

module.exports = calculateRemainingHeight;
