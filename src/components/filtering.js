import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями

  Object.keys(indexes).forEach((elementName) => {
    // Проверяем, существует ли такой select в шаблоне
    if (elements[elementName]) {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          // Создаем новый элемент option
          const option = document.createElement("option");
          // Устанавливаем значение и текст
          option.value = name;
          option.textContent = name;
          // Возвращаем готовую опцию для append
          return option;
        }),
      );
    }
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.dataset.name === "clear") {
      // Ищем инпут в том же блоке, где кнопка
      const input = action.parentElement.querySelector("input");

      if (input) {
        input.value = ""; // Очищаем поле в интерфейсе

        // Сбрасываем значение в state по имени поля из dataset
        const fieldName = action.dataset.field;
        state[fieldName] = "";
      }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => compare(row, state));
  };
}
