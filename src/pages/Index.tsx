import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "scripts" | "dialogs";
type Category = "all" | "client" | "sales";

interface ScriptLine {
  role: "operator" | "client";
  text: string;
}

interface Script {
  id: number;
  title: string;
  category: "client" | "sales";
  tags: string[];
  lines: ScriptLine[];
  updatedAt: string;
}

interface DialogStep {
  title: string;
  description: string;
  tip?: string;
}

interface Dialog {
  id: number;
  title: string;
  category: "client" | "sales";
  steps: DialogStep[];
  preview: string;
  updatedAt: string;
}

const SCRIPTS: Script[] = [
  {
    id: 1,
    title: "Входящий звонок — первичная консультация",
    category: "client",
    tags: ["входящий", "консультация"],
    updatedAt: "05.05.2026",
    lines: [
      { role: "operator", text: "Добрый день! Меня зовут [Имя], компания [Название]. Чем могу помочь?" },
      { role: "client", text: "Здравствуйте, хотел узнать про ваши услуги." },
      { role: "operator", text: "Конечно! Расскажите, пожалуйста, что именно вас интересует — я с удовольствием расскажу подробнее." },
      { role: "client", text: "Меня интересует [тема]." },
      { role: "operator", text: "Отлично. По этому направлению у нас есть несколько решений. Скажите, для какой цели вам это нужно — тогда я подберу наиболее подходящий вариант." },
      { role: "operator", text: "Позвольте уточнить несколько деталей, чтобы предложить лучшее решение. Это займёт буквально 2–3 минуты." },
    ],
  },
  {
    id: 2,
    title: "Обработка возражения «Дорого»",
    category: "sales",
    tags: ["возражения", "цена"],
    updatedAt: "04.05.2026",
    lines: [
      { role: "client", text: "Это слишком дорого для нас." },
      { role: "operator", text: "Понимаю вас. Давайте разберём, из чего складывается стоимость и что именно вы получаете." },
      { role: "operator", text: "В эту цену входит: [перечисление]. Если сравнить с аналогами, вы экономите на [выгода]." },
      { role: "client", text: "Всё равно дорого." },
      { role: "operator", text: "Хорошо. Скажите, с чем именно вы сравниваете? Возможно, я смогу показать вам более подходящий тариф или рассрочку." },
      { role: "operator", text: "У нас есть вариант оплаты частями — [условия]. Это снизит единовременную нагрузку. Рассмотрим?" },
    ],
  },
  {
    id: 3,
    title: "Повторный звонок по заявке",
    category: "client",
    tags: ["повтор", "заявка"],
    updatedAt: "02.05.2026",
    lines: [
      { role: "operator", text: "Добрый день, [Имя клиента]! Это [Имя], компания [Название]. Звоню по вашей заявке от [дата]." },
      { role: "client", text: "Да, помню." },
      { role: "operator", text: "Хотел уточнить — вы успели ознакомиться с предложением, которое мы отправили? Есть ли вопросы?" },
      { role: "client", text: "Ещё не смотрел." },
      { role: "operator", text: "Понял. Когда вам будет удобно — я могу перезвонить или кратко рассказать прямо сейчас, это займёт 5 минут." },
    ],
  },
  {
    id: 4,
    title: "Холодный звонок — выход на ЛПР",
    category: "sales",
    tags: ["холодный", "лпр"],
    updatedAt: "01.05.2026",
    lines: [
      { role: "operator", text: "Здравствуйте! Соедините, пожалуйста, с директором по закупкам." },
      { role: "client", text: "По какому вопросу?" },
      { role: "operator", text: "По вопросу оптимизации поставок — у нас есть конкретное предложение для вашей компании." },
      { role: "client", text: "Он сейчас занят." },
      { role: "operator", text: "Понял. Как его зовут, чтобы я мог обратиться лично? И когда лучше перезвонить?" },
      { role: "operator", text: "Спасибо, [Имя]. Тогда позвоню в [время] — договорились?" },
    ],
  },
  {
    id: 5,
    title: "Завершение сделки — финальный оффер",
    category: "sales",
    tags: ["закрытие", "оффер"],
    updatedAt: "29.04.2026",
    lines: [
      { role: "operator", text: "Итак, мы с вами обсудили все детали. Предлагаю зафиксировать условия и перейти к договору." },
      { role: "client", text: "Нам нужно ещё подумать." },
      { role: "operator", text: "Конечно. Что именно вызывает сомнения — условия, цена или сроки? Готов ответить на любой вопрос прямо сейчас." },
      { role: "operator", text: "Скажу честно — это предложение действует до [дата]. После мы не сможем гарантировать эту цену. Хочу, чтобы вы успели воспользоваться лучшими условиями." },
      { role: "client", text: "Хорошо, давайте оформим." },
      { role: "operator", text: "Отлично! Тогда я передаю ваши данные в отдел оформления. Договор пришлём на [email] в течение часа." },
    ],
  },
  {
    id: 6,
    title: "Работа с недовольным клиентом",
    category: "client",
    tags: ["жалоба", "конфликт"],
    updatedAt: "28.04.2026",
    lines: [
      { role: "client", text: "Это просто безобразие! Я уже третий раз звоню, и ничего не решается!" },
      { role: "operator", text: "Прошу прощения за сложившуюся ситуацию. Я лично займусь вашим вопросом прямо сейчас. Расскажите, что произошло." },
      { role: "client", text: "Я заказал [товар/услугу], но [проблема]." },
      { role: "operator", text: "Понял вас. Это недопустимо, и я беру ответственность за решение. Позвольте уточнить номер вашего заказа." },
      { role: "operator", text: "Я вижу вашу заявку. Вот что я сделаю прямо сейчас: [действие]. Результат сообщу вам до [время]. Договорились?" },
      { role: "client", text: "Хорошо, жду." },
      { role: "operator", text: "Спасибо за терпение. Как только вопрос будет решён — я сразу вам позвоню." },
    ],
  },
];

const DIALOGS: Dialog[] = [
  {
    id: 1,
    title: "Квалификация нового клиента",
    category: "client",
    preview: "Пошаговый сценарий для выявления потребностей и квалификации входящего лида",
    updatedAt: "05.05.2026",
    steps: [
      { title: "Приветствие", description: "Представиться, назвать компанию, создать доверительный тон.", tip: "Улыбайтесь — это слышно в голосе" },
      { title: "Выявление запроса", description: "Спросить, что привело клиента. Не перебивать, дать высказаться полностью." },
      { title: "Уточнение деталей", description: "Задать 2–3 уточняющих вопроса: бюджет, сроки, приоритеты.", tip: "Используйте открытые вопросы «Что», «Как», «Зачем»" },
      { title: "Квалификация", description: "Определить: клиент целевой или нет. Если нет — вежливо направить." },
      { title: "Предложение следующего шага", description: "Предложить встречу, КП или демо — конкретно и с датой." },
      { title: "Фиксация договорённостей", description: "Повторить вслух, что договорились. Подтвердить контакты." },
    ],
  },
  {
    id: 2,
    title: "Презентация продукта",
    category: "sales",
    preview: "Структурированный диалог для демонстрации ключевых преимуществ продукта",
    updatedAt: "03.05.2026",
    steps: [
      { title: "Контекст встречи", description: "Напомнить, о чём договорились на прошлом контакте." },
      { title: "Повестка", description: "Озвучить план: «Расскажу о продукте, покажу демо, отвечу на вопросы — займёт 20 минут»." },
      { title: "Боли клиента", description: "Уточнить актуальные задачи — презентацию строить вокруг них.", tip: "Не показывайте всё подряд — только то, что решает их проблему" },
      { title: "Решение", description: "Показать, как продукт закрывает конкретные задачи клиента." },
      { title: "Демо / кейсы", description: "Показать живой пример или кейс похожей компании." },
      { title: "Обработка вопросов", description: "Дать время на вопросы. Не торопить." },
      { title: "Следующий шаг", description: "Предложить конкретное действие: тест, пилот, КП." },
      { title: "Фиксация", description: "Зафиксировать договорённости, отправить резюме на почту." },
    ],
  },
  {
    id: 3,
    title: "Работа с возражениями",
    category: "sales",
    preview: "Разветвлённый сценарий для отработки типичных возражений клиентов",
    updatedAt: "01.05.2026",
    steps: [
      { title: "Выслушать", description: "Дать клиенту полностью высказать возражение. Не перебивать.", tip: "Пауза 2–3 секунды перед ответом — показывает, что вы думаете" },
      { title: "Присоединиться", description: "«Понимаю вас» / «Это важный вопрос» — снизить напряжение." },
      { title: "Уточнить", description: "«Уточните, что именно вас смущает?» — понять реальную причину." },
      { title: "Дорого", description: "Разложить цену на составляющие. Сравнить с альтернативами. Предложить рассрочку." },
      { title: "Нет времени", description: "«Я займу буквально 5 минут» — или назначить другое время." },
      { title: "Уже есть поставщик", description: "«Отлично! Расскажите, что цените в нём?» — найти, чего не хватает." },
      { title: "Надо подумать", description: "«Что именно нужно обдумать?» — выявить скрытое возражение." },
      { title: "Не устраивают условия", description: "Уточнить, что именно. Предложить альтернативные варианты." },
      { title: "Эскалация", description: "Если возражение не снято — предложить подключить эксперта или руководителя." },
      { title: "Итог", description: "Резюмировать договорённости. Зафиксировать следующий шаг." },
    ],
  },
  {
    id: 4,
    title: "Постпродажное сопровождение",
    category: "client",
    preview: "Сценарий для поддержания контакта с клиентом после заключения сделки",
    updatedAt: "29.04.2026",
    steps: [
      { title: "Звонок через 3 дня", description: "Уточнить, всё ли прошло хорошо. Ответить на первые вопросы.", tip: "Не продавайте на этом звонке — только забота" },
      { title: "Обучение / онбординг", description: "Предложить помощь в освоении продукта или знакомство с командой." },
      { title: "Проверка удовлетворённости", description: "Через 2 недели: «Всё ли устраивает? Есть ли что улучшить?»" },
      { title: "Допродажа", description: "Если клиент доволен — предложить дополнительный продукт или апгрейд." },
      { title: "Рекомендация", description: "«Если кому-то из коллег нужно похожее решение — буду рад помочь»." },
    ],
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "Все",
  client: "Клиентские",
  sales: "Продажи",
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("scripts");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredScripts = SCRIPTS.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lines.some(l => l.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredDialogs = DIALOGS.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const copyScript = (script: Script) => {
    const text = script.lines
      .map(l => `${l.role === "operator" ? "Оператор" : "Клиент"}: ${l.text}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(script.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(220,30%,12%)] border-b border-[hsl(220,25%,20%)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[hsl(212,85%,48%)] flex items-center justify-center">
              <Icon name="BookOpen" size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-semibold tracking-widest text-sm">SCRIPTBASE</span>
              <span className="text-[hsl(210,20%,55%)] text-xs ml-3 font-light">
                Корпоративная библиотека
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[hsl(212,85%,48%)] text-white text-xs font-medium px-4 py-2 hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={14} />
              Загрузить скрипт
            </button>
            <div className="w-8 h-8 bg-[hsl(220,25%,18%)] flex items-center justify-center text-[hsl(210,20%,75%)] text-xs font-medium cursor-pointer hover:bg-[hsl(220,25%,24%)] transition-colors">
              АД
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            { label: "Скриптов", value: SCRIPTS.length, icon: "FileText" },
            { label: "Диалогов", value: DIALOGS.length, icon: "MessageSquare" },
            { label: "Категорий", value: 2, icon: "Tag" },
            { label: "Обновлено сегодня", value: 2, icon: "Clock" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon name={stat.icon} fallback="Circle" size={14} className="text-muted-foreground" />
              </div>
              <span className="text-3xl font-light text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 animate-fade-in">
          <div className="flex border border-border">
            {(["scripts", "dialogs"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveCategory("all");
                  setSelectedScript(null);
                  setSelectedDialog(null);
                }}
                className={`px-6 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[hsl(220,30%,12%)] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon name={tab === "scripts" ? "FileText" : "MessageSquare"} size={14} />
                  {tab === "scripts" ? "Скрипты" : "Диалоги"}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(212,85%,48%)] w-64 transition-colors"
              />
            </div>
            <div className="flex border border-border">
              {(["all", "client", "sales"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scripts */}
        {activeTab === "scripts" && (
          <div className="border border-border animate-slide-up">
            {filteredScripts.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">Ничего не найдено</div>
            ) : (
              filteredScripts.map((script, idx) => (
                <div key={script.id} className="border-b border-border last:border-b-0">
                  <div
                    onClick={() => setSelectedScript(script === selectedScript ? null : script)}
                    className={`px-6 py-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                      selectedScript?.id === script.id ? "bg-secondary" : "bg-card hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-muted-foreground text-xs font-mono w-6 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-medium text-sm text-foreground truncate">{script.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 font-medium shrink-0 ${
                            script.category === "sales"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {script.category === "sales" ? "Продажи" : "Клиентский"}
                        </span>
                        <div className="hidden md:flex items-center gap-1.5 shrink-0">
                          {script.tags.map((tag) => (
                            <span key={tag} className="text-xs text-muted-foreground border border-border px-1.5 py-0.5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">{script.updatedAt}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="MessageCircle" size={12} />
                        <span>{script.lines.length}</span>
                      </div>
                      <Icon
                        name={selectedScript?.id === script.id ? "ChevronUp" : "ChevronDown"}
                        size={14}
                        className="text-muted-foreground"
                      />
                    </div>
                  </div>

                  {selectedScript?.id === script.id && (
                    <div className="bg-background border-t border-border animate-slide-up">
                      <div className="px-6 py-5 space-y-3">
                        {script.lines.map((line, i) => (
                          <div
                            key={i}
                            className={`flex gap-3 ${line.role === "client" ? "flex-row-reverse" : ""}`}
                          >
                            <div
                              className={`w-6 h-6 flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 ${
                                line.role === "operator"
                                  ? "bg-[hsl(220,30%,12%)] text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {line.role === "operator" ? "ОП" : "КЛ"}
                            </div>
                            <div
                              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                                line.role === "operator"
                                  ? "bg-[hsl(220,30%,96%)] text-foreground border-l-2 border-[hsl(212,85%,48%)]"
                                  : "bg-white border border-border text-muted-foreground"
                              }`}
                            >
                              {line.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 pb-5 flex gap-3 border-t border-border pt-4">
                        <button
                          onClick={() => copyScript(script)}
                          className="flex items-center gap-1.5 text-xs bg-[hsl(220,30%,12%)] text-white px-4 py-2 font-medium hover:opacity-80 transition-opacity"
                        >
                          <Icon name={copiedId === script.id ? "Check" : "Copy"} size={12} />
                          {copiedId === script.id ? "Скопировано!" : "Скопировать скрипт"}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs border border-border text-muted-foreground px-4 py-2 font-medium hover:text-foreground transition-colors">
                          <Icon name="Pencil" size={12} />
                          Редактировать
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Dialogs */}
        {activeTab === "dialogs" && (
          <div className="grid grid-cols-2 gap-4 animate-slide-up">
            {filteredDialogs.length === 0 ? (
              <div className="col-span-2 py-16 text-center text-muted-foreground text-sm">Ничего не найдено</div>
            ) : (
              filteredDialogs.map((dialog) => (
                <div
                  key={dialog.id}
                  className={`border border-border transition-colors ${
                    selectedDialog?.id === dialog.id ? "bg-secondary" : "bg-card"
                  }`}
                >
                  {/* Card header */}
                  <div
                    onClick={() => setSelectedDialog(dialog === selectedDialog ? null : dialog)}
                    className="p-6 cursor-pointer hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[hsl(220,30%,12%)] flex items-center justify-center">
                          <Icon name="GitBranch" size={14} className="text-white" />
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 font-medium ${
                            dialog.category === "sales"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {dialog.category === "sales" ? "Продажи" : "Клиентский"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{dialog.updatedAt}</span>
                        <Icon
                          name={selectedDialog?.id === dialog.id ? "ChevronUp" : "ChevronDown"}
                          size={14}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1.5">{dialog.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{dialog.preview}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon name="ListOrdered" size={12} />
                      <span>{dialog.steps.length} шагов</span>
                    </div>
                  </div>

                  {/* Steps expanded */}
                  {selectedDialog?.id === dialog.id && (
                    <div className="border-t border-border animate-slide-up">
                      <div className="px-6 py-4 space-y-0">
                        {dialog.steps.map((step, i) => (
                          <div key={i} className="flex gap-4 pb-4 last:pb-0">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 bg-[hsl(220,30%,12%)] flex items-center justify-center text-[10px] text-white font-mono shrink-0">
                                {i + 1}
                              </div>
                              {i < dialog.steps.length - 1 && (
                                <div className="w-px flex-1 bg-border mt-1 min-h-[16px]" />
                              )}
                            </div>
                            <div className="flex-1 pb-1">
                              <div className="text-sm font-medium text-foreground mb-0.5">{step.title}</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">{step.description}</div>
                              {step.tip && (
                                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[hsl(212,85%,45%)]">
                                  <Icon name="Lightbulb" size={11} className="mt-0.5 shrink-0" />
                                  <span>{step.tip}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 pb-5 flex gap-3 border-t border-border pt-4">
                        <button className="flex items-center gap-1.5 text-xs bg-[hsl(220,30%,12%)] text-white px-4 py-2 font-medium hover:opacity-80 transition-opacity">
                          <Icon name="Play" size={12} />
                          Начать диалог
                        </button>
                        <button className="flex items-center gap-1.5 text-xs border border-border text-muted-foreground px-4 py-2 font-medium hover:text-foreground transition-colors">
                          <Icon name="Pencil" size={12} />
                          Редактировать
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">ScriptBase · Корпоративная библиотека</span>
          <span className="text-xs text-muted-foreground">{SCRIPTS.length + DIALOGS.length} материалов в базе</span>
        </div>
      </footer>
    </div>
  );
}
