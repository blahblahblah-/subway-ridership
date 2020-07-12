export const selectYearOptions = (firstYear, lastYear) => {
  let array = [];
  for (let i = firstYear; i <= lastYear; i++) {
    array.push({ key: i, text: i, value: i });
  }
  return array;
}