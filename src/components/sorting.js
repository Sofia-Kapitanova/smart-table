import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки

      // 2. Переключаем состояние нажатой кнопки по кругу через sortMap
      action.dataset.value = sortMap[action.dataset.value];

      // 3. Обновляем локальные переменные модуля
      field = action.dataset.field; // Берем имя поля (например, date или total)
      order = action.dataset.value; // Берем новое направление (asc, desc или пусто)

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        // Если поле этой кнопки не совпадает с полем нажатой кнопки
        if (column.dataset.field !== action.dataset.field) {
          // Сбрасываем иконку в начальное состояние
          column.dataset.value = "none";
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => {
        // Ищем кнопку, у которой состояние НЕ "none"
        if (column.dataset.value !== "none") {
          field = column.dataset.field; // Запоминаем поле
          order = column.dataset.value; // Запоминаем направление
        }
      });
    }
    const sort = field && order !== "none" ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

    return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
  };
}
