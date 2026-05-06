import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
  // Добавляем шаблоны "до" в обратном порядке через prepend
  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  // Добавляем шаблоны "после" через append
  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });
  // @todo: #1.3 —  обработать события и вызвать onAction()

  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    onAction(e.submitter); // Передаем кнопку, которая вызвала сабмит
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
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

      // 3. Возвращаем контейнер (саму строку <tr>) в массив
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  root.render = render; // Явно добавляем метод в объект
  return root;
}
