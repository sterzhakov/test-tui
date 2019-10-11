const isBottom = (element) => {
  return element.getBoundingClientRect().bottom <= window.innerHeight;
};

export default isBottom;
