const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesPath).filter(f => fs.statSync(path.join(localesPath, f)).isDirectory());

const translations = {
    en: { title: "INITIALIZE GRID", sub: "Establish the Master Admin parameters to initialize the CyberTasker core." },
    de: { title: "INITIALISIERE NEURAL-KNOTEN", sub: "Etabliere die Master-Admin-Parameter, um den CyberTasker-Kern hochzufahren." },
    es: { title: "INICIALIZANDO RED NEURONAL", sub: "Establece los parámetros del Administrador Maestro para inicializar el núcleo de CyberTasker." },
    fr: { title: "INITIALISATION DE LA MATRICE", sub: "Établissez les paramètres de l'Administrateur Maître pour initialiser le cœur de CyberTasker." },
    it: { title: "INIZIALIZZAZIONE DELLA GRIGLIA", sub: "Stabilisci i parametri dell'Amministratore Master per inizializzare il nucleo di CyberTasker." },
    da: { title: "INITIALISERER NEURALT NETVÆRK", sub: "Etabler Master Admin parametrene for at initialisere CyberTasker kernen." },
    sv: { title: "INITIALISERAR NÄTVERK", sub: "Etablera Master Admin-parametrarna för att initiera CyberTaskers kärna." },
    no: { title: "INITIALISERER SYSTEMNORD", sub: "Etabler Master Admin parametere for å initialisere CyberTasker kjernen." },
    fi: { title: "ALUSTA NEUROVERKKO", sub: "Määritä Master Admin -parametrit CyberTasker-ytimen alustamiseksi." },
    hu: { title: "HÁLÓZAT INICIALIZÁLÁSA", sub: "Állítsa be a Master Admin paramétereket a CyberTasker mag inicializálásához." },
    pl: { title: "INICJALIZACJA SIECI NEURONOWEJ", sub: "Ustal parametry Głównego Administratora, aby zainicjować rdzeń CyberTasker." },
    pt: { title: "INICIALIZANDO A MATRIZ", sub: "Estabeleça os parâmetros do Master Admin para inicializar o núcleo do CyberTasker." },
    el: { title: "ΑΡΧΙΚΟΠΟΙΗΣΗ ΔΙΚΤΥΟΥ", sub: "Καθορίστε τις παραμέτρους του Κύριου Διαχειριστή για να αρχικοποιήσετε τον πυρήνα του CyberTasker." },
    ru: { title: "ИНИЦИАЛИЗАЦИЯ СЕТИ", sub: "Установите параметры Главного Администратора для инициализации ядра CyberTasker." },
    zh: { title: "初始化神经网络", sub: "建立主管理员参数以初始化 CyberTasker 核心。" },
    nl: { title: "NEURAAL NETWERK INITIALISEREN", sub: "Stel de Master Admin parameters in om de CyberTasker kern te initialiseren." },
    ja: { title: "ニューラルグリッドの初期化", sub: "マスター管理者のパラメータを設定し、CyberTaskerコアを初期化してください。" },
    ko: { title: "신경망 접속 초기화", sub: "마스터 관리자 매개변수를 설정하여 CyberTasker 코어를 초기화하십시오." },
    hi: { title: "न्यूरल ग्रिड प्रारंभ करें", sub: "साइबरटास्कर कोर को प्रारंभ करने के लिए मास्टर एडमिन पैरामीटर स्थापित करें।" },
    tr: { title: "AĞ BAŞLATILIYOR", sub: "CyberTasker çekirdeğini başlatmak için Ana Yönetici parametrelerini belirleyin." },
    vi: { title: "KHỞI TẠO MẠNG LƯỚI", sub: "Thiết lập các tham số Master Admin để khởi tạo lõi CyberTasker." },
    uk: { title: "ІНІЦІАЛІЗАЦІЯ НЕЙРОМЕРЕЖІ", sub: "Установіть параметри Головного Адміністратора для ініціалізації ядра CyberTasker." },
    he: { title: "אתחול רשת נוירונית", sub: "קבע את פרמטרי מנהל המערכת הראשי כדי לאתחל את ליבת ה-CyberTasker." },
    tlh: { title: "ghogh lulIng", sub: "pongmey tIghunmeH CyberTasker quv yIcher." }
};

let updatedCount = 0;

for (const lang of languages) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        let raw = fs.readFileSync(filePath, 'utf8');
        let json = JSON.parse(raw);

        const fallback = translations['en'];
        const translation = translations[lang] || fallback;

        if (!json.auth) json.auth = {};
        if (!json.auth.static) json.auth.static = {};

        json.auth.static.install_title = translation.title;
        json.auth.static.install_subtitle = translation.sub;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 4) + '\n', 'utf8');
        updatedCount++;
    }
}

console.log(`Successfully injected install_title and install_subtitle into ${updatedCount} language files.`);
