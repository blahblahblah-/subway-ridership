export const selectYearOptions = (firstYear, lastYear) => {
  let array = [];
  for (let i = lastYear; i >= firstYear; i--) {
    array.push({ key: i, text: i, value: i });
  }
  return array;
}