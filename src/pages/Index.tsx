import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "scripts" | "dialogs";
type Category = "all" | "client" | "sales";

interface Script {
  id: number;
  title: string;
  category: "client" | "sales";
  tags: string[];
  preview: string;
  updatedAt: string;
}

interface Dialog {
  id: number;
  title: string;
  category: "client" | "sales";
  steps: number;
  preview: string;
  updatedAt: string;
}

const SCRIPTS: Script[] = [
  {
    id: 1,
    title: "Входящий звонок — первичная консультация",
    category: "client",
    tags: ["входящий", "консультация"],
    preview: "Добрый день! Меня зовут [Имя], компания [Название]. Чем могу помочь?",
    updatedAt: "05.05.2026",
  },
  {
    id: 2,
    title: "Обработка возражения «Дорого»",
    category: "sales",
    tags: ["возражения", "цена"],
    preview: "Понимаю вас. Давайте разберём, из чего складывается стоимость и что вы получаете...",
    updatedAt: "04.05.2026",
  },
  {
    id: 3,
    title: "Повторный звонок по заявке",
    category: "client",
    tags: ["повтор", "заявка"],
    preview: "Добрый день, [Имя клиента]! Я снова по вашей заявке от [дата]...",
    updatedAt: "02.05.2026",
  },
  {
    id: 4,
    title: "Холодный звонок — выход на ЛПР",
    category: "sales",
    tags: ["холодный", "лпр"],
    preview: "Здравствуйте! Соедините, пожалуйста, с директором по закупкам...",
    updatedAt: "01.05.2026",
  },
  {
    id: 5,
    title: "Завершение сделки — финальный оффер",
    category: "sales",
    tags: ["закрытие", "оффер"],
    preview: "Итак, мы с вами обсудили все детали. Предлагаю зафиксировать условия и перейти к договору...",
    updatedAt: "29.04.2026",
  },
  {
    id: 6,
    title: "Работа с недовольным клиентом",
    category: "client",
    tags: ["жалоба", "конфликт"],
    preview: "Прошу прощения за сложившуюся ситуацию. Я лично займусь вашим вопросом прямо сейчас...",
    updatedAt: "28.04.2026",
  },
];

const DIALOGS: Dialog[] = [
  {
    id: 1,
    title: "Квалификация нового клиента",
    category: "client",
    steps: 6,
    preview: "Пошаговый сценарий для выявления потребностей и квалификации входящего лида",
    updatedAt: "05.05.2026",
  },
  {
    id: 2,
    title: "Презентация продукта",
    category: "sales",
    steps: 8,
    preview: "Структурированный диалог для демонстрации ключевых преимуществ продукта",
    updatedAt: "03.05.2026",
  },
  {
    id: 3,
    title: "Работа с возражениями",
    category: "sales",
    steps: 10,
    preview: "Разветвлённый сценарий для отработки типичных возражений клиентов",
    updatedAt: "01.05.2026",
  },
  {
    id: 4,
    title: "Постпродажное сопровождение",
    category: "client",
    steps: 5,
    preview: "Сценарий для поддержания контакта с клиентом после заключения сделки",
    updatedAt: "29.04.2026",
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

  const filteredScripts = SCRIPTS.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredDialogs = DIALOGS.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
              <span className="text-[hsl(210,20%,65%)] text-xs ml-3 font-light">
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
        {/* Stats row */}
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
                onClick={() => { setActiveTab(tab); setActiveCategory("all"); setSelectedScript(null); setSelectedDialog(null); }}
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

        {/* Scripts tab */}
        {activeTab === "scripts" && (
          <div className="border border-border animate-slide-up">
            {filteredScripts.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Ничего не найдено
              </div>
            ) : (
              filteredScripts.map((script, idx) => (
                <div
                  key={script.id}
                  onClick={() => setSelectedScript(script === selectedScript ? null : script)}
                  className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                    selectedScript?.id === script.id
                      ? "bg-secondary"
                      : "bg-card hover:bg-secondary/50"
                  }`}
                >
                  <div className="px-6 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <span className="text-muted-foreground text-xs font-mono mt-0.5 w-6 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-medium text-sm text-foreground">{script.title}</span>
                          <span
                            className={`text-xs px-2 py-0.5 font-medium ${
                              script.category === "sales"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {script.category === "sales" ? "Продажи" : "Клиентский"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
                          «{script.preview}»
                        </p>
                        {selectedScript?.id === script.id && (
                          <div className="mt-4 p-4 bg-background border border-border animate-slide-up">
                            <p className="text-sm text-foreground leading-relaxed font-mono">
                              «{script.preview}»
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                              {script.tags.map((tag) => (
                                <span key={tag} className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-3 mt-4">
                              <button className="flex items-center gap-1.5 text-xs bg-[hsl(220,30%,12%)] text-white px-4 py-2 font-medium hover:opacity-80 transition-opacity">
                                <Icon name="Copy" size={12} />
                                Скопировать
                              </button>
                              <button className="flex items-center gap-1.5 text-xs border border-border text-muted-foreground px-4 py-2 font-medium hover:text-foreground transition-colors">
                                <Icon name="Pencil" size={12} />
                                Редактировать
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-muted-foreground">{script.updatedAt}</span>
                      <Icon
                        name={selectedScript?.id === script.id ? "ChevronUp" : "ChevronDown"}
                        size={14}
                        className="text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Dialogs tab */}
        {activeTab === "dialogs" && (
          <div className="grid grid-cols-2 gap-4 animate-slide-up">
            {filteredDialogs.length === 0 ? (
              <div className="col-span-2 py-16 text-center text-muted-foreground text-sm">
                Ничего не найдено
              </div>
            ) : (
              filteredDialogs.map((dialog) => (
                <div
                  key={dialog.id}
                  onClick={() => setSelectedDialog(dialog === selectedDialog ? null : dialog)}
                  className={`border border-border cursor-pointer transition-colors ${
                    selectedDialog?.id === dialog.id
                      ? "bg-secondary"
                      : "bg-card hover:bg-secondary/50"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[hsl(220,30%,12%)] flex items-center justify-center">
                          <Icon name="MessageSquare" size={14} className="text-white" />
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
                      <span className="text-xs text-muted-foreground">{dialog.updatedAt}</span>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground mb-2">{dialog.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{dialog.preview}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon name="GitBranch" size={12} />
                        <span>{dialog.steps} шагов</span>
                      </div>
                      <Icon
                        name={selectedDialog?.id === dialog.id ? "ChevronUp" : "ChevronRight"}
                        size={14}
                        className="text-muted-foreground"
                      />
                    </div>

                    {selectedDialog?.id === dialog.id && (
                      <div className="mt-4 pt-4 border-t border-border animate-slide-up">
                        <div className="space-y-2 mb-4">
                          {Array.from({ length: Math.min(dialog.steps, 4) }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 border border-border flex items-center justify-center text-xs text-muted-foreground font-mono shrink-0">
                                {i + 1}
                              </div>
                              <div className="h-px flex-1 bg-border" />
                              <span className="text-xs text-muted-foreground">Шаг {i + 1}</span>
                            </div>
                          ))}
                          {dialog.steps > 4 && (
                            <span className="text-xs text-muted-foreground pl-8 block">
                              + ещё {dialog.steps - 4} шага
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button className="flex items-center gap-1.5 text-xs bg-[hsl(220,30%,12%)] text-white px-4 py-2 font-medium hover:opacity-80 transition-opacity">
                            <Icon name="Eye" size={12} />
                            Открыть
                          </button>
                          <button className="flex items-center gap-1.5 text-xs border border-border text-muted-foreground px-4 py-2 font-medium hover:text-foreground transition-colors">
                            <Icon name="Pencil" size={12} />
                            Редактировать
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">ScriptBase · Корпоративная библиотека</span>
          <span className="text-xs text-muted-foreground">{SCRIPTS.length + DIALOGS.length} материалов в базе</span>
        </div>
      </footer>
    </div>
  );
}