import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  // В некоторых учебных сборках правила нужно передавать списком через запятую или в массиве
  const compare = createComparison(
    rules.skipEmptyTargetValues,
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false,
    ),
  );

  return (data, state, action) => {
    // Добавим проверку: если state или поле поиска не определены, возвращаем все данные
    if (!state || !state[searchField]) {
      return data;
    }

    // @todo: #5.2 — применить компаратор
    return data.filter((item) => compare(item, state));
  };
}
