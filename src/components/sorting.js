import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      columns.forEach((el) => {
        if (el !== action) {
          el.dataset.value = "";
        }
      });

      // 2. Переключаем состояние нажатой кнопки по кругу через sortMap
      action.dataset.value = sortMap[action.dataset.value];

      // 3. Обновляем локальные переменные модуля
      field = action.dataset.field; // Берем имя поля (например, date или total)
      order = action.dataset.value; // Берем новое направление (asc, desc или пусто)

      // @todo: #3.2 — сбросить сортировки остальных колонок
      // @todo: #3.2 — сбросить состояние остальных кнопок
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
    return sortCollection(data, field, order);
  };
}
