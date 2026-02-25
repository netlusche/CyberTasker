<?php
// api/i18n.php
// Minimal PHP translation helper that reads CyberTasker frontend JSON locales.

class I18nHelper
{
    private static $translations = [];
    private static $defaultLang = 'en';

    public static function load($lang)
    {
        $lang = strtolower(explode('-', $lang)[0]); // e.g., 'en-US' -> 'en'
        $path = __DIR__ . '/../public/locales/' . $lang . '/translation.json';

        if (!file_exists($path)) {
            $lang = self::$defaultLang;
            $path = __DIR__ . '/../public/locales/' . $lang . '/translation.json';
        }

        if (!isset(self::$translations[$lang])) {
            if (file_exists($path)) {
                $content = file_get_contents($path);
                self::$translations[$lang] = json_decode($content, true) ?: [];
            }
            else {
                self::$translations[$lang] = [];
            }
        }

        return $lang;
    }

    public static function t($lang, $key)
    {
        $lang = self::load($lang);
        $dict = self::$translations[$lang];

        $keys = explode('.', $key);
        $val = $dict;
        foreach ($keys as $k) {
            if (is_array($val) && isset($val[$k])) {
                $val = $val[$k];
            }
            else {
                return $key; // Fallback to the requested key string
            }
        }
        return is_string($val) ? $val : $key;
    }
}
?>