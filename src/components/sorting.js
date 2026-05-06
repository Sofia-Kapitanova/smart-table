import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    // Проверяем, что нажата именно кнопка сортировки
    // Внимание: проверьте, используется ли action.name или action.dataset.name
    if (action && (action.name === "sort" || action.dataset.name === "sort")) {
      
      // @todo: #3.1 и #3.2 — обрабатываем кнопки
      columns.forEach((column) => {
        if (column !== action) {
          // Сбрасываем остальные колонки в 'none'
          column.dataset.value = "none";
        }
      });

      // Переключаем состояние нажатой кнопки по кругу
      // Если там было undefined или 'none', sortMap вернет первое состояние (например, 'asc')
      action.dataset.value = sortMap[action.dataset.value] || sortMap['none'];

      field = action.dataset.field;
      order = action.dataset.value;

    } else {
      // @todo: #3.3 — восстанавливаем режим сортировки при перерисовке
      columns.forEach((column) => {
        if (column.dataset.value && column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Если поле и порядок определены — сортируем, иначе возвращаем как есть
    return field && order ? sortCollection(data, field, order) : data;
  };
}
