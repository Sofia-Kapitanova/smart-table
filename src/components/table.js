import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // #1.2 — Используем копию массива [...before], чтобы не испортить оригинал
  [...before].reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // #1.3 — Обработка событий
  // Добавляем обработчик клика (нужен для тестов кнопок сортировки и пагинации)
  root.container.addEventListener("click", (e) => {
    const action = e.target.closest("button");
    if (action) {
      onAction(action);
    }
  });

  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(() => onAction());
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data = []) => {
    // #1.1 — Преобразование данных
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        const element = row.elements[key];
        if (element) {
          if (element.tagName === "INPUT" || element.tagName === "SELECT") {
            element.value = item[key];
          } else {
            element.textContent = item[key];
          }
        }
      });
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  root.render = render;
  return root;
}
