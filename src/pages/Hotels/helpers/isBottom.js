const isBottom = (wrapperElement) => {
  const wrapperHeight = wrapperElement.clientHeight;
  const bottomScrollBoundary = wrapperHeight - window.innerHeight;
  const isBottom = (bottomScrollBoundary - window.scrollY) <= 0;
  return isBottom;
};

export default isBottom;
