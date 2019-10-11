const randomFromRange = (min, max) => {
  const ceilMin = Math.ceil(min);
  const ceilMax = Math.floor(max);
  return Math.floor(
    Math.random() * (ceilMax - ceilMin + 1)
  ) + ceilMin;
}

export default randomFromRange;
