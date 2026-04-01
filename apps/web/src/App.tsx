import { useEffect, useMemo, useState } from "react";
import {
  WebRandomSource,
  defaultWordlist,
  generateKeyMaterial,
  generatePassphrases,
  generatePasswords,
  keyPresets,
  passwordPresets,
  regeneratePassphraseWord,
  type GeneratedSecret,
  type KeyMaterialOptions,
  type PassphraseCapitalization,
  type PassphraseOptions,
  type PasswordOptions
} from "@quantum-aware/core";

type Mode = "password" | "passphrase" | "key";
type Language = "en" | "ru";

const randomSource = new WebRandomSource();
const LANGUAGE_STORAGE_KEY = "qa-language";

const defaultPasswordPreset = passwordPresets[0] ?? { id: "custom", label: "Custom", description: "Manual settings", options: { length: 20 } };
const defaultKeyPreset = keyPresets[0] ?? { id: "custom", label: "Custom", description: "Manual settings", options: { bytes: 24, format: "hex" as const } };

const text = {
  en: {
    appName: "Quantum-Aware",
    heroTitle: "High-entropy password and key generation, with conservative quantum-computing estimates.",
    heroBody: "Generate passwords, passphrases, and key material entirely on your device. Quantum-Aware focuses on strong randomness, conservative entropy margins, and plain-language analysis without exaggerated claims.",
    trustSignals: ["Runs locally in your browser", "Uses secure randomness", "No generated values are sent to a server"],
    modeLabels: { password: "Password", passphrase: "Passphrase", key: "Key Material" },
    preset: "Preset",
    length: "Length",
    words: "Words",
    separator: "Separator",
    capitalization: "Capitalization",
    byteLength: "Byte length",
    outputFormat: "Output format",
    hideAdvanced: "Hide advanced settings",
    showAdvanced: "Show advanced settings",
    outputs: "Number of outputs",
    customSymbols: "Custom symbol set",
    fullCharset: "Full charset override",
    customSeparator: "Custom separator",
    digitsPrefix: "Digits prefix",
    digitsSuffix: "Digits suffix",
    symbolPrefix: "Symbol prefix",
    symbolSuffix: "Symbol suffix",
    generate: "Generate",
    regenerate: "Regenerate",
    regenerateOneWord: "Regenerate one word",
    clear: "Clear",
    showValues: "Show values",
    hideValues: "Hide values",
    copied: "Copied locally.",
    generatedOutput: "Generated output",
    generatedValue: "Generated value",
    copy: "Copy",
    generatedOutputBody: "Generated values stay on this device. Nothing is uploaded, stored remotely, or sent for analysis.",
    generatedOutputEmpty: "Generate a value to inspect its estimated entropy and storage guidance.",
    analysis: "Analysis",
    entropy: "Entropy",
    strength: "Strength",
    searchSpace: "Search space",
    analysisEmpty: "Quantum-aware estimates appear after generation. They are simplified educational approximations for quantum-computing risk, not guarantees about future attackers or hardware.",
    storageTitle: "How to store passwords and keys safely",
    limitationsTitle: "Limitations and honesty",
    heroBadgeLabels: ["Local-only", "Secure random", "Conservative model"],
    heroImageAlt: "Quantum-Aware preview",
    languageEn: "EN",
    languageRu: "RU",
    separators: { hyphen: "Hyphen", underscore: "Underscore", space: "Space", dot: "Dot", slash: "Slash" },
    capitalizationOptions: { lowercase: "lowercase", capitalized: "Capitalized", uppercase: "UPPERCASE", random: "Random capitalization" },
    formats: { hex: "Hex", base64: "Base64", rawBytes: "Raw bytes" },
    passwordToggles: {
      includeLowercase: "Include lowercase",
      includeUppercase: "Include uppercase",
      includeDigits: "Include digits",
      includeSymbols: "Include symbols",
      excludeAmbiguous: "Exclude confusing characters",
      requireEachSelectedType: "Require every selected type",
      excludeDuplicates: "Avoid duplicate characters when possible",
      avoidVisuallyConfusingCombinations: "Avoid confusing combinations"
    },
    passwordPresetLabels: {
      balanced: "Balanced",
      "maximum-entropy": "Maximum entropy",
      "easy-to-read": "Easy to read",
      "web-account": "Web account",
      "banking-critical": "Banking / critical account",
      "manager-master": "Password manager master password",
      "developer-strong": "Developer strong password"
    },
    keyPresetLabels: {
      "api-token": "API token",
      "local-encryption-key": "Local encryption key",
      "recovery-secret": "Recovery code",
      "machine-secret": "Machine key"
    },
    storageGuidance: [
      { title: "Website passwords", text: "Store them in a reputable password manager instead of notes, screenshots, or reused spreadsheets." },
      { title: "Master passwords", text: "Prefer long, memorable passwords or passphrases with high entropy and keep them out of plaintext files." },
      { title: "API keys", text: "Place them in environment variables, secret managers, or deployment tooling rather than source control." },
      { title: "Local encryption keys", text: "For especially sensitive material, consider offline storage or hardware-backed storage where practical." },
      { title: "Recovery codes", text: "Keep them separate from the account they protect and avoid sending them through insecure chat apps." }
    ],
    limitations: [
      "This tool raises brute-force cost by generating passwords, passphrases, and keys with strong randomness and larger search spaces. It does not replace post-quantum public-key cryptography, secure protocols, or good storage hygiene.",
      "Quantum search does not make brute-force free. The quantum brute-force estimate here is a conservative teaching aid inspired by Grover-style intuition, not a claim that a practical attack exists for every generated value.",
      "Strong generation is only one layer. Phishing, malware, keyloggers, clipboard leakage, and reuse can still defeat a strong password, passphrase, or API key.",
      "Key material mode is useful for opaque values and local symmetric material. It does not automatically protect wallets, accounts, or devices by itself."
    ],
    strengthLabels: { Weak: "Weak", Moderate: "Moderate", Strong: "Strong", "Very Strong": "Very Strong", Extreme: "Extreme" }
  },
  ru: {
    appName: "Quantum-Aware",
    heroTitle: "Генерация высокоэнтропийных паролей и ключей с консервативными оценками рисков квантовых вычислений.",
    heroBody: "Генерируйте пароли, парольные фразы и ключевой материал полностью на своём устройстве. Quantum-Aware делает упор на сильную случайность, консервативный запас энтропии и понятный анализ без преувеличенных заявлений.",
    trustSignals: ["Работает локально в браузере", "Использует криптографически стойкую случайность", "Никакие сгенерированные значения не отправляются на сервер"],
    modeLabels: { password: "Пароль", passphrase: "Парольная фраза", key: "Ключевой материал" },
    preset: "Пресет",
    length: "Длина",
    words: "Слова",
    separator: "Разделитель",
    capitalization: "Регистр",
    byteLength: "Длина в байтах",
    outputFormat: "Формат вывода",
    hideAdvanced: "Скрыть дополнительные настройки",
    showAdvanced: "Показать дополнительные настройки",
    outputs: "Количество значений",
    customSymbols: "Свой набор символов",
    fullCharset: "Полный набор символов",
    customSeparator: "Свой разделитель",
    digitsPrefix: "Цифры в начале",
    digitsSuffix: "Цифры в конце",
    symbolPrefix: "Символ в начале",
    symbolSuffix: "Символ в конце",
    generate: "Сгенерировать",
    regenerate: "Сгенерировать заново",
    regenerateOneWord: "Заменить одно слово",
    clear: "Очистить",
    showValues: "Показать значения",
    hideValues: "Скрыть значения",
    copied: "Скопировано локально.",
    generatedOutput: "Результат генерации",
    generatedValue: "Сгенерированное значение",
    copy: "Копировать",
    generatedOutputBody: "Сгенерированные значения остаются на этом устройстве. Ничего не загружается, не хранится удалённо и не отправляется для анализа.",
    generatedOutputEmpty: "Сгенерируйте значение, чтобы посмотреть оценку энтропии и рекомендации по хранению.",
    analysis: "Анализ",
    entropy: "Энтропия",
    strength: "Надёжность",
    searchSpace: "Размер пространства поиска",
    analysisEmpty: "Оценки в quantum-aware стиле появятся после генерации. Это упрощённые учебные приближения для риска квантовых вычислений, а не гарантия против будущих атак или оборудования.",
    storageTitle: "Как безопасно хранить пароли и ключи",
    limitationsTitle: "Ограничения и честные оговорки",
    heroBadgeLabels: ["Локально", "Стойкая случайность", "Консервативная модель"],
    heroImageAlt: "Превью Quantum-Aware",
    languageEn: "EN",
    languageRu: "RU",
    separators: { hyphen: "Дефис", underscore: "Подчёркивание", space: "Пробел", dot: "Точка", slash: "Слэш" },
    capitalizationOptions: { lowercase: "нижний регистр", capitalized: "С заглавной буквы", uppercase: "ВЕРХНИЙ РЕГИСТР", random: "Случайный регистр" },
    formats: { hex: "Hex", base64: "Base64", rawBytes: "Сырые байты" },
    passwordToggles: {
      includeLowercase: "Строчные буквы",
      includeUppercase: "Заглавные буквы",
      includeDigits: "Цифры",
      includeSymbols: "Символы",
      excludeAmbiguous: "Исключить похожие символы",
      requireEachSelectedType: "Требовать каждый выбранный тип",
      excludeDuplicates: "По возможности избегать повторов",
      avoidVisuallyConfusingCombinations: "Избегать запутывающих сочетаний"
    },
    passwordPresetLabels: {
      balanced: "Сбалансированный",
      "maximum-entropy": "Максимальная энтропия",
      "easy-to-read": "Легко читать",
      "web-account": "Веб-аккаунт",
      "banking-critical": "Банк / критичный аккаунт",
      "manager-master": "Мастер-пароль менеджера паролей",
      "developer-strong": "Сильный пароль разработчика"
    },
    keyPresetLabels: {
      "api-token": "API-ключ",
      "local-encryption-key": "Локальный ключ шифрования",
      "recovery-secret": "Код восстановления",
      "machine-secret": "Машинный ключ"
    },
    storageGuidance: [
      { title: "Пароли для сайтов", text: "Храните их в надёжном менеджере паролей, а не в заметках, скриншотах или старых таблицах." },
      { title: "Мастер-пароли", text: "Лучше выбирать длинные и запоминающиеся пароли или парольные фразы с высокой энтропией и не держать их в открытых текстовых файлах." },
      { title: "API-ключи", text: "Храните их в переменных окружения, менеджерах секретов или инструментах деплоя, а не в репозитории." },
      { title: "Локальные ключи шифрования", text: "Для особенно чувствительных значений по возможности используйте офлайн-хранение или аппаратную защиту." },
      { title: "Коды восстановления", text: "Держите их отдельно от учётной записи, которую они защищают, и не отправляйте через небезопасные мессенджеры." }
    ],
    limitations: [
      "Этот инструмент повышает стоимость перебора за счёт генерации паролей, парольных фраз и ключей с сильной случайностью и большим пространством поиска. Он не заменяет постквантовую криптографию с открытым ключом, безопасные протоколы и хорошую гигиену хранения.",
      "Квантовый поиск не делает перебор бесплатным. Оценка квантового перебора здесь - это консервативная учебная модель, вдохновлённая интуицией в духе алгоритма Гровера, а не заявление о практической атаке для каждого сгенерированного значения.",
      "Сильная генерация - лишь один слой защиты. Фишинг, вредоносное ПО, кейлоггеры, утечки через буфер обмена и повторное использование всё ещё могут скомпрометировать сильный пароль, парольную фразу или API-ключ.",
      "Режим ключевого материала полезен для непрозрачных значений и локального симметричного материала. Сам по себе он не защищает кошельки, аккаунты или устройства автоматически."
    ],
    strengthLabels: { Weak: "Слабая", Moderate: "Умеренная", Strong: "Высокая", "Very Strong": "Очень высокая", Extreme: "Экстремальная" }
  }
} as const;

const passwordToggleFields: Array<{ key: keyof PasswordOptions }> = [
  { key: "includeLowercase" },
  { key: "includeUppercase" },
  { key: "includeDigits" },
  { key: "includeSymbols" },
  { key: "excludeAmbiguous" },
  { key: "requireEachSelectedType" },
  { key: "excludeDuplicates" },
  { key: "avoidVisuallyConfusingCombinations" }
];

const heroBadgeIcons = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M12 3l7 4v5c0 5-3.2 8-7 9-3.8-1-7-4-7-9V7l7-4z" />
      <path d="M9.5 12.5l1.8 1.8 3.8-4.3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="3" />
      <path d="M8 10V8a4 4 0 118 0v2" />
      <circle cx="12" cy="15" r="1.2" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M6 18L18 6" />
      <path d="M7.5 7.5h9v9" />
      <path d="M4 12a8 8 0 1016 0" />
    </svg>
  )
];

function localizeCoreText(language: Language, sourceText: string, mode: Mode): string {
  if (language === "en") {
    return sourceText.replace("Quantum-aware estimate:", "Quantum brute-force estimate:");
  }

  const modeRu = mode === "password" ? "пароля" : mode === "passphrase" ? "парольной фразы" : "ключевого материала";

  return sourceText
    .replace(/^At roughly (.+?), a full brute-force search for this .+? would be on the order of (.+?) on average\.$/, `При скорости около $1 полный перебор этого ${modeRu} в среднем занял бы порядка $2.`)
    .replace(/^Simplified quantum-adjusted estimate: if a Grover-style speedup applied cleanly, the margin behaves more like about (.+?) effective bits, still implying about (.+?) at (.+?) quantum-style oracle steps\/second\. This is educational, not a guarantee\.$/, "Упрощённая оценка квантового перебора: если ускорение в духе алгоритма Гровера применимо достаточно чисто, запас прочности больше похож примерно на $1 эффективных бит, что всё равно даёт около $2 при $3 квантовых шагов оракула в секунду. Это учебная оценка, а не гарантия.")
    .replace(/^(.+?) reflects an estimated (.+?) bits under uniform-random assumptions\. Real-world safety still depends on storage, phishing resistance, malware exposure, and whether an attacker can rate-limit guesses\.$/, "$1 уровень соответствует оценке в $2 бит при предположении о равномерной криптографически стойкой случайности. На практике безопасность всё равно зависит от хранения, устойчивости к фишингу, вредоносного ПО и ограничений на число попыток.")
    .replace(/^Duplicate avoidance could only be partially honored because the requested length exceeds the unique character pool\.$/, "Избежать повторов удалось только частично, потому что запрошенная длина превышает число уникальных символов.")
    .replace(/^This byte length is short for many long-lived secrets\. Consider 16 bytes or more, and 32 bytes for higher margins\.$/, "Такой размер в байтах маловат для многих долгоживущих ключей и кодов. Лучше использовать не менее 16 байт, а для большего запаса - 32 байта.")
    .replace(/^Consider using more words or a larger wordlist for stronger offline brute-force resistance\.$/, "Для более высокой стойкости к офлайн-перебору лучше увеличить число слов или размер словаря.");
}

function OutputCard<T>({
  result,
  hidden,
  onCopy,
  copyLabel,
  valueLabel,
  language,
  mode
}: {
  result: GeneratedSecret<T>;
  hidden: boolean;
  onCopy: (value: string) => void;
  copyLabel: string;
  valueLabel: string;
  language: Language;
  mode: Mode;
}) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-ink px-5 py-4 text-mist">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-mist/70">{valueLabel}</span>
        <button className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold" onClick={() => onCopy(result.value)}>
          {copyLabel}
        </button>
      </div>
      <div className="mt-3 break-all font-mono text-sm leading-6">{hidden ? "•".repeat(Math.min(result.value.length, 72)) : result.value}</div>
      {result.warnings.length > 0 ? <p className="mt-3 text-xs text-amber-200">{result.warnings.map((warning) => localizeCoreText(language, warning, mode)).join(" ")}</p> : null}
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("password");
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({ ...defaultPasswordPreset.options, count: 1 });
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>({
    wordCount: 6,
    separator: "-",
    capitalization: "lowercase",
    digitsSuffix: "",
    digitsPrefix: "",
    symbolPrefix: "",
    symbolSuffix: "",
    count: 1,
    wordlist: defaultWordlist.words
  });
  const [keyOptions, setKeyOptions] = useState<KeyMaterialOptions>({ ...defaultKeyPreset.options, count: 1 });
  const [results, setResults] = useState<GeneratedSecret<unknown>[]>([]);
  const [hidden, setHidden] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const t = text[language];
  const currentAnalysis = results[0]?.analysis;

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en" || stored === "ru") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const trustSignals = useMemo(() => t.trustSignals, [t]);

  function generate() {
    setCopyMessage("");
    if (mode === "password") {
      setResults(generatePasswords(passwordOptions, randomSource));
      return;
    }
    if (mode === "passphrase") {
      setResults(generatePassphrases(passphraseOptions, randomSource));
      return;
    }
    setResults(generateKeyMaterial(keyOptions, randomSource));
  }

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    setCopyMessage(t.copied);
    window.setTimeout(() => setCopyMessage(""), 1500);
  }

  function clear() {
    setResults([]);
    setCopyMessage("");
  }

  function regenerateOneWord() {
    if (mode !== "passphrase" || results.length === 0) {
      return;
    }

    const current = results[0];
    if (!current) {
      return;
    }

    const nextValue = regeneratePassphraseWord(current.value, passphraseOptions, randomSource);
    const nextResults = [...results];
    nextResults[0] = { ...current, value: nextValue };
    setResults(nextResults);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="panel overflow-hidden p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <span className="pill">{t.appName}</span>
              <div className="flex items-center gap-2 self-start">
                <button className={`rounded-full border px-3 py-1 text-xs font-semibold ${language === "en" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink"}`} onClick={() => setLanguage("en")}>{t.languageEn}</button>
                <button className={`rounded-full border px-3 py-1 text-xs font-semibold ${language === "ru" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink"}`} onClick={() => setLanguage("ru")}>{t.languageRu}</button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-4">
              {t.heroBadgeLabels.map((label, index) => (
                <div key={label} className="flex items-center gap-3 rounded-full border border-white/80 bg-white/95 px-4 py-3 shadow-[0_18px_48px_rgba(255,255,255,0.45)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-tide shadow-[inset_0_0_0_1px_rgba(15,23,32,0.06),0_8px_18px_rgba(15,23,32,0.08)]">
                    {heroBadgeIcons[index]}
                  </span>
                  <span className="text-sm font-semibold text-ink/80">{label}</span>
                </div>
              ))}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t.heroTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75">{t.heroBody}</p>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-panel">
              <img src={`${import.meta.env.BASE_URL}image.png`} alt={t.heroImageAlt} className="h-auto w-full rounded-[1.4rem] object-cover" />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[27rem]">
            {trustSignals.map((signal) => (
              <div key={signal} className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-medium text-ink/80">
                {signal}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <div className="flex flex-wrap gap-3">
            {(["password", "passphrase", "key"] as Mode[]).map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === item ? "bg-ink text-white" : "bg-white text-ink border border-ink/10"}`}
                onClick={() => setMode(item)}
              >
                {t.modeLabels[item]}
              </button>
            ))}
          </div>

          {mode === "password" ? (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.preset}</span>
                  <select className="field" onChange={(event) => setPasswordOptions({ ...passwordOptions, ...passwordPresets.find((preset) => preset.id === event.target.value)?.options })} defaultValue={defaultPasswordPreset.id}>
                    {passwordPresets.map((preset) => <option key={preset.id} value={preset.id}>{t.passwordPresetLabels[preset.id as keyof typeof t.passwordPresetLabels] ?? preset.label}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.length}</span>
                  <input className="field" type="number" min={1} value={passwordOptions.length} onChange={(event) => setPasswordOptions({ ...passwordOptions, length: Number(event.target.value) })} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {passwordToggleFields.map(({ key }) => (
                  <label key={key} className="toggle">
                    <span>{t.passwordToggles[key as keyof typeof t.passwordToggles]}</span>
                    <input type="checkbox" checked={Boolean(passwordOptions[key])} onChange={(event) => setPasswordOptions({ ...passwordOptions, [key]: event.target.checked })} />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "passphrase" ? (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.words}</span>
                  <input className="field" type="number" min={1} value={passphraseOptions.wordCount} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, wordCount: Number(event.target.value) })} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.separator}</span>
                  <select className="field" value={passphraseOptions.separator} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, separator: event.target.value })}>
                    <option value="-">{t.separators.hyphen}</option>
                    <option value="_">{t.separators.underscore}</option>
                    <option value=" ">{t.separators.space}</option>
                    <option value=".">{t.separators.dot}</option>
                    <option value="/">{t.separators.slash}</option>
                  </select>
                </label>
              </div>
              <label>
                <span className="mb-2 block text-sm font-semibold">{t.capitalization}</span>
                <select className="field" value={passphraseOptions.capitalization} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, capitalization: event.target.value as PassphraseCapitalization })}>
                  <option value="lowercase">{t.capitalizationOptions.lowercase}</option>
                  <option value="capitalized">{t.capitalizationOptions.capitalized}</option>
                  <option value="uppercase">{t.capitalizationOptions.uppercase}</option>
                  <option value="random">{t.capitalizationOptions.random}</option>
                </select>
              </label>
            </div>
          ) : null}

          {mode === "key" ? (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.preset}</span>
                  <select className="field" onChange={(event) => setKeyOptions({ ...keyOptions, ...keyPresets.find((preset) => preset.id === event.target.value)?.options })} defaultValue={defaultKeyPreset.id}>
                    {keyPresets.map((preset) => <option key={preset.id} value={preset.id}>{t.keyPresetLabels[preset.id as keyof typeof t.keyPresetLabels] ?? preset.label}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.byteLength}</span>
                  <input className="field" type="number" min={1} value={keyOptions.bytes} onChange={(event) => setKeyOptions({ ...keyOptions, bytes: Number(event.target.value) })} />
                </label>
              </div>
              <label>
                <span className="mb-2 block text-sm font-semibold">{t.outputFormat}</span>
                <select className="field" value={keyOptions.format} onChange={(event) => setKeyOptions({ ...keyOptions, format: event.target.value as KeyMaterialOptions["format"] })}>
                  <option value="hex">{t.formats.hex}</option>
                  <option value="base64">{t.formats.base64}</option>
                  <option value="raw-bytes">{t.formats.rawBytes}</option>
                </select>
              </label>
            </div>
          ) : null}

          <div className="mt-6">
            <button className="text-sm font-semibold text-tide" onClick={() => setShowAdvanced((current) => !current)}>
              {showAdvanced ? t.hideAdvanced : t.showAdvanced}
            </button>
            {showAdvanced ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">{t.outputs}</span>
                  <input
                    className="field"
                    type="number"
                    min={1}
                    value={mode === "password" ? passwordOptions.count : mode === "passphrase" ? passphraseOptions.count : keyOptions.count}
                    onChange={(event) => {
                      const count = Number(event.target.value);
                      if (mode === "password") setPasswordOptions({ ...passwordOptions, count });
                      if (mode === "passphrase") setPassphraseOptions({ ...passphraseOptions, count });
                      if (mode === "key") setKeyOptions({ ...keyOptions, count });
                    }}
                  />
                </label>
                {mode === "password" ? (
                  <label>
                    <span className="mb-2 block text-sm font-semibold">{t.customSymbols}</span>
                    <input className="field" value={passwordOptions.customSymbols ?? ""} onChange={(event) => setPasswordOptions({ ...passwordOptions, customSymbols: event.target.value })} placeholder="!@#$%" />
                  </label>
                ) : null}
                {mode === "password" ? (
                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold">{t.fullCharset}</span>
                    <input className="field" value={passwordOptions.customCharset ?? ""} onChange={(event) => setPasswordOptions({ ...passwordOptions, customCharset: event.target.value })} placeholder="abcXYZ789!@#" />
                  </label>
                ) : null}
                {mode === "passphrase" ? (
                  <>
                    <label><span className="mb-2 block text-sm font-semibold">{t.customSeparator}</span><input className="field" value={passphraseOptions.separator} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, separator: event.target.value })} /></label>
                    <label><span className="mb-2 block text-sm font-semibold">{t.digitsPrefix}</span><input className="field" value={passphraseOptions.digitsPrefix ?? ""} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, digitsPrefix: event.target.value })} /></label>
                    <label><span className="mb-2 block text-sm font-semibold">{t.digitsSuffix}</span><input className="field" value={passphraseOptions.digitsSuffix ?? ""} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, digitsSuffix: event.target.value })} /></label>
                    <label><span className="mb-2 block text-sm font-semibold">{t.symbolPrefix}</span><input className="field" value={passphraseOptions.symbolPrefix ?? ""} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, symbolPrefix: event.target.value })} /></label>
                    <label><span className="mb-2 block text-sm font-semibold">{t.symbolSuffix}</span><input className="field" value={passphraseOptions.symbolSuffix ?? ""} onChange={(event) => setPassphraseOptions({ ...passphraseOptions, symbolSuffix: event.target.value })} /></label>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white" onClick={generate}>{t.generate}</button>
            <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink" onClick={generate}>{t.regenerate}</button>
            {mode === "passphrase" ? <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink" onClick={regenerateOneWord}>{t.regenerateOneWord}</button> : null}
            <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink" onClick={clear}>{t.clear}</button>
            <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink" onClick={() => setHidden((current) => !current)}>{hidden ? t.showValues : t.hideValues}</button>
            {copyMessage ? <span className="self-center text-sm text-moss">{copyMessage}</span> : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <h2 className="text-xl font-semibold">{t.generatedOutput}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{t.generatedOutputBody}</p>
            <div className="mt-4 space-y-4">
              {results.length === 0 ? <div className="rounded-3xl border border-dashed border-ink/15 px-5 py-10 text-sm text-ink/55">{t.generatedOutputEmpty}</div> : null}
              {results.map((result) => <OutputCard key={`${result.value}-${result.analysis.entropyBits}`} result={result} hidden={hidden} onCopy={copyValue} copyLabel={t.copy} valueLabel={t.generatedValue} language={language} mode={mode} />)}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-semibold">{t.analysis}</h2>
            {currentAnalysis ? (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-mist px-4 py-3"><div className="text-xs uppercase tracking-[0.18em] text-tide">{t.entropy}</div><div className="mt-2 text-2xl font-semibold">{currentAnalysis.entropyBits.toFixed(1)} bits</div></div>
                  <div className="rounded-2xl bg-mist px-4 py-3"><div className="text-xs uppercase tracking-[0.18em] text-tide">{t.strength}</div><div className="mt-2 text-2xl font-semibold">{t.strengthLabels[currentAnalysis.strength]}</div></div>
                </div>
                <p className="rounded-2xl bg-sand px-4 py-3 text-sm leading-6 text-ink/80">{t.searchSpace}: <span className="font-mono">{currentAnalysis.searchSpaceSize}</span></p>
                <p className="text-sm leading-6 text-ink/80">{localizeCoreText(language, currentAnalysis.classicalEstimate, mode)}</p>
                <p className="text-sm leading-6 text-ink/80">{localizeCoreText(language, currentAnalysis.quantumEstimate, mode).replace("Simplified quantum-adjusted estimate", language === "en" ? "Simplified quantum brute-force estimate" : "Упрощённая оценка квантового перебора")}</p>
                <p className="text-sm leading-6 text-ink/80">{localizeCoreText(language, currentAnalysis.explanation.replace(currentAnalysis.strength, t.strengthLabels[currentAnalysis.strength]), mode)}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-ink/70">{t.analysisEmpty}</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-6">
          <h2 className="text-xl font-semibold">{t.storageTitle}</h2>
          <div className="mt-4 space-y-4">
            {t.storageGuidance.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-ink/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-semibold">{t.limitationsTitle}</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
            {t.limitations.map((item) => <p key={item}>{item}</p>)}
          </div>
        </div>
      </section>
    </main>
  );
}
