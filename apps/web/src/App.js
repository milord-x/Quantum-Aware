import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { WebRandomSource, defaultWordlist, generateKeyMaterial, generatePassphrases, generatePasswords, keyPresets, passwordPresets, regeneratePassphraseWord } from "@quantum-aware/core";
const randomSource = new WebRandomSource();
const LANGUAGE_STORAGE_KEY = "qa-language";
const defaultPasswordPreset = passwordPresets[0] ?? { id: "custom", label: "Custom", description: "Manual settings", options: { length: 20 } };
const defaultKeyPreset = keyPresets[0] ?? { id: "custom", label: "Custom", description: "Manual settings", options: { bytes: 24, format: "hex" } };
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
};
const passwordToggleFields = [
    { key: "includeLowercase" },
    { key: "includeUppercase" },
    { key: "includeDigits" },
    { key: "includeSymbols" },
    { key: "excludeAmbiguous" },
    { key: "requireEachSelectedType" },
    { key: "excludeDuplicates" },
    { key: "avoidVisuallyConfusingCombinations" }
];
function localizeCoreText(language, sourceText, mode) {
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
function OutputCard({ result, hidden, onCopy, copyLabel, valueLabel, language, mode }) {
    return (_jsxs("div", { className: "rounded-3xl border border-ink/10 bg-ink px-5 py-4 text-mist", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.18em] text-mist/70", children: valueLabel }), _jsx("button", { className: "rounded-full border border-white/15 px-3 py-1 text-xs font-semibold", onClick: () => onCopy(result.value), children: copyLabel })] }), _jsx("div", { className: "mt-3 break-all font-mono text-sm leading-6", children: hidden ? "•".repeat(Math.min(result.value.length, 72)) : result.value }), result.warnings.length > 0 ? _jsx("p", { className: "mt-3 text-xs text-amber-200", children: result.warnings.map((warning) => localizeCoreText(language, warning, mode)).join(" ") }) : null] }));
}
export default function App() {
    const [language, setLanguage] = useState("en");
    const [mode, setMode] = useState("password");
    const [passwordOptions, setPasswordOptions] = useState({ ...defaultPasswordPreset.options, count: 1 });
    const [passphraseOptions, setPassphraseOptions] = useState({
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
    const [keyOptions, setKeyOptions] = useState({ ...defaultKeyPreset.options, count: 1 });
    const [results, setResults] = useState([]);
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
    async function copyValue(value) {
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
    return (_jsxs("main", { className: "mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8", children: [_jsx("section", { className: "panel overflow-hidden p-8", children: _jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsx("span", { className: "pill", children: t.appName }), _jsxs("div", { className: "flex items-center gap-2 self-start", children: [_jsx("button", { className: `rounded-full border px-3 py-1 text-xs font-semibold ${language === "en" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink"}`, onClick: () => setLanguage("en"), children: t.languageEn }), _jsx("button", { className: `rounded-full border px-3 py-1 text-xs font-semibold ${language === "ru" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink"}`, onClick: () => setLanguage("ru"), children: t.languageRu })] })] }), _jsx("h1", { className: "mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl", children: t.heroTitle }), _jsx("p", { className: "mt-4 max-w-2xl text-base leading-7 text-ink/75", children: t.heroBody })] }), _jsx("div", { className: "grid gap-2 sm:grid-cols-3 lg:w-[27rem]", children: trustSignals.map((signal) => (_jsx("div", { className: "rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-medium text-ink/80", children: signal }, signal))) })] }) }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [_jsxs("div", { className: "panel p-6", children: [_jsx("div", { className: "flex flex-wrap gap-3", children: ["password", "passphrase", "key"].map((item) => (_jsx("button", { className: `rounded-full px-4 py-2 text-sm font-semibold transition ${mode === item ? "bg-ink text-white" : "bg-white text-ink border border-ink/10"}`, onClick: () => setMode(item), children: t.modeLabels[item] }, item))) }), mode === "password" ? (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.preset }), _jsx("select", { className: "field", onChange: (event) => setPasswordOptions({ ...passwordOptions, ...passwordPresets.find((preset) => preset.id === event.target.value)?.options }), defaultValue: defaultPasswordPreset.id, children: passwordPresets.map((preset) => _jsx("option", { value: preset.id, children: t.passwordPresetLabels[preset.id] ?? preset.label }, preset.id)) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.length }), _jsx("input", { className: "field", type: "number", min: 1, value: passwordOptions.length, onChange: (event) => setPasswordOptions({ ...passwordOptions, length: Number(event.target.value) }) })] })] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: passwordToggleFields.map(({ key }) => (_jsxs("label", { className: "toggle", children: [_jsx("span", { children: t.passwordToggles[key] }), _jsx("input", { type: "checkbox", checked: Boolean(passwordOptions[key]), onChange: (event) => setPasswordOptions({ ...passwordOptions, [key]: event.target.checked }) })] }, key))) })] })) : null, mode === "passphrase" ? (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.words }), _jsx("input", { className: "field", type: "number", min: 1, value: passphraseOptions.wordCount, onChange: (event) => setPassphraseOptions({ ...passphraseOptions, wordCount: Number(event.target.value) }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.separator }), _jsxs("select", { className: "field", value: passphraseOptions.separator, onChange: (event) => setPassphraseOptions({ ...passphraseOptions, separator: event.target.value }), children: [_jsx("option", { value: "-", children: t.separators.hyphen }), _jsx("option", { value: "_", children: t.separators.underscore }), _jsx("option", { value: " ", children: t.separators.space }), _jsx("option", { value: ".", children: t.separators.dot }), _jsx("option", { value: "/", children: t.separators.slash })] })] })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.capitalization }), _jsxs("select", { className: "field", value: passphraseOptions.capitalization, onChange: (event) => setPassphraseOptions({ ...passphraseOptions, capitalization: event.target.value }), children: [_jsx("option", { value: "lowercase", children: t.capitalizationOptions.lowercase }), _jsx("option", { value: "capitalized", children: t.capitalizationOptions.capitalized }), _jsx("option", { value: "uppercase", children: t.capitalizationOptions.uppercase }), _jsx("option", { value: "random", children: t.capitalizationOptions.random })] })] })] })) : null, mode === "key" ? (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.preset }), _jsx("select", { className: "field", onChange: (event) => setKeyOptions({ ...keyOptions, ...keyPresets.find((preset) => preset.id === event.target.value)?.options }), defaultValue: defaultKeyPreset.id, children: keyPresets.map((preset) => _jsx("option", { value: preset.id, children: t.keyPresetLabels[preset.id] ?? preset.label }, preset.id)) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.byteLength }), _jsx("input", { className: "field", type: "number", min: 1, value: keyOptions.bytes, onChange: (event) => setKeyOptions({ ...keyOptions, bytes: Number(event.target.value) }) })] })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.outputFormat }), _jsxs("select", { className: "field", value: keyOptions.format, onChange: (event) => setKeyOptions({ ...keyOptions, format: event.target.value }), children: [_jsx("option", { value: "hex", children: t.formats.hex }), _jsx("option", { value: "base64", children: t.formats.base64 }), _jsx("option", { value: "raw-bytes", children: t.formats.rawBytes })] })] })] })) : null, _jsxs("div", { className: "mt-6", children: [_jsx("button", { className: "text-sm font-semibold text-tide", onClick: () => setShowAdvanced((current) => !current), children: showAdvanced ? t.hideAdvanced : t.showAdvanced }), showAdvanced ? (_jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.outputs }), _jsx("input", { className: "field", type: "number", min: 1, value: mode === "password" ? passwordOptions.count : mode === "passphrase" ? passphraseOptions.count : keyOptions.count, onChange: (event) => {
                                                            const count = Number(event.target.value);
                                                            if (mode === "password")
                                                                setPasswordOptions({ ...passwordOptions, count });
                                                            if (mode === "passphrase")
                                                                setPassphraseOptions({ ...passphraseOptions, count });
                                                            if (mode === "key")
                                                                setKeyOptions({ ...keyOptions, count });
                                                        } })] }), mode === "password" ? (_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.customSymbols }), _jsx("input", { className: "field", value: passwordOptions.customSymbols ?? "", onChange: (event) => setPasswordOptions({ ...passwordOptions, customSymbols: event.target.value }), placeholder: "!@#$%" })] })) : null, mode === "password" ? (_jsxs("label", { className: "sm:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.fullCharset }), _jsx("input", { className: "field", value: passwordOptions.customCharset ?? "", onChange: (event) => setPasswordOptions({ ...passwordOptions, customCharset: event.target.value }), placeholder: "abcXYZ789!@#" })] })) : null, mode === "passphrase" ? (_jsxs(_Fragment, { children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.customSeparator }), _jsx("input", { className: "field", value: passphraseOptions.separator, onChange: (event) => setPassphraseOptions({ ...passphraseOptions, separator: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.digitsPrefix }), _jsx("input", { className: "field", value: passphraseOptions.digitsPrefix ?? "", onChange: (event) => setPassphraseOptions({ ...passphraseOptions, digitsPrefix: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.digitsSuffix }), _jsx("input", { className: "field", value: passphraseOptions.digitsSuffix ?? "", onChange: (event) => setPassphraseOptions({ ...passphraseOptions, digitsSuffix: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.symbolPrefix }), _jsx("input", { className: "field", value: passphraseOptions.symbolPrefix ?? "", onChange: (event) => setPassphraseOptions({ ...passphraseOptions, symbolPrefix: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold", children: t.symbolSuffix }), _jsx("input", { className: "field", value: passphraseOptions.symbolSuffix ?? "", onChange: (event) => setPassphraseOptions({ ...passphraseOptions, symbolSuffix: event.target.value }) })] })] })) : null] })) : null] }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsx("button", { className: "rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white", onClick: generate, children: t.generate }), _jsx("button", { className: "rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink", onClick: generate, children: t.regenerate }), mode === "passphrase" ? _jsx("button", { className: "rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink", onClick: regenerateOneWord, children: t.regenerateOneWord }) : null, _jsx("button", { className: "rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink", onClick: clear, children: t.clear }), _jsx("button", { className: "rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink", onClick: () => setHidden((current) => !current), children: hidden ? t.showValues : t.hideValues }), copyMessage ? _jsx("span", { className: "self-center text-sm text-moss", children: copyMessage }) : null] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "panel p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: t.generatedOutput }), _jsx("p", { className: "mt-2 text-sm leading-6 text-ink/70", children: t.generatedOutputBody }), _jsxs("div", { className: "mt-4 space-y-4", children: [results.length === 0 ? _jsx("div", { className: "rounded-3xl border border-dashed border-ink/15 px-5 py-10 text-sm text-ink/55", children: t.generatedOutputEmpty }) : null, results.map((result) => _jsx(OutputCard, { result: result, hidden: hidden, onCopy: copyValue, copyLabel: t.copy, valueLabel: t.generatedValue, language: language, mode: mode }, `${result.value}-${result.analysis.entropyBits}`))] })] }), _jsxs("div", { className: "panel p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: t.analysis }), currentAnalysis ? (_jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl bg-mist px-4 py-3", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.18em] text-tide", children: t.entropy }), _jsxs("div", { className: "mt-2 text-2xl font-semibold", children: [currentAnalysis.entropyBits.toFixed(1), " bits"] })] }), _jsxs("div", { className: "rounded-2xl bg-mist px-4 py-3", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.18em] text-tide", children: t.strength }), _jsx("div", { className: "mt-2 text-2xl font-semibold", children: t.strengthLabels[currentAnalysis.strength] })] })] }), _jsxs("p", { className: "rounded-2xl bg-sand px-4 py-3 text-sm leading-6 text-ink/80", children: [t.searchSpace, ": ", _jsx("span", { className: "font-mono", children: currentAnalysis.searchSpaceSize })] }), _jsx("p", { className: "text-sm leading-6 text-ink/80", children: localizeCoreText(language, currentAnalysis.classicalEstimate, mode) }), _jsx("p", { className: "text-sm leading-6 text-ink/80", children: localizeCoreText(language, currentAnalysis.quantumEstimate, mode).replace("Simplified quantum-adjusted estimate", language === "en" ? "Simplified quantum brute-force estimate" : "Упрощённая оценка квантового перебора") }), _jsx("p", { className: "text-sm leading-6 text-ink/80", children: localizeCoreText(language, currentAnalysis.explanation.replace(currentAnalysis.strength, t.strengthLabels[currentAnalysis.strength]), mode) })] })) : (_jsx("p", { className: "mt-3 text-sm leading-6 text-ink/70", children: t.analysisEmpty }))] })] })] }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-[1fr_1fr]", children: [_jsxs("div", { className: "panel p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: t.storageTitle }), _jsx("div", { className: "mt-4 space-y-4", children: t.storageGuidance.map((item) => (_jsxs("div", { className: "rounded-2xl border border-ink/10 bg-white/70 px-4 py-3", children: [_jsx("h3", { className: "font-semibold", children: item.title }), _jsx("p", { className: "mt-1 text-sm leading-6 text-ink/75", children: item.text })] }, item.title))) })] }), _jsxs("div", { className: "panel p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: t.limitationsTitle }), _jsx("div", { className: "mt-4 space-y-3 text-sm leading-6 text-ink/75", children: t.limitations.map((item) => _jsx("p", { children: item }, item)) })] })] })] }));
}
//# sourceMappingURL=App.js.map