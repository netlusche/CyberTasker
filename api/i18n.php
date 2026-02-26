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

        $possiblePaths = [
            __DIR__ . '/../locales/' . $lang . '/translation.json', // Production (dist relative to dist/api)
            __DIR__ . '/../public/locales/' . $lang . '/translation.json' // Development relative to /api
        ];

        $path = '';
        foreach ($possiblePaths as $p) {
            if (file_exists($p)) {
                $path = $p;
                break;
            }
        }

        if (!$path) {
            $lang = self::$defaultLang;
            foreach ($possiblePaths as $p) {
                // Try fallback lang
                $fallbackPath = str_replace('/' . $lang . '/', '/' . self::$defaultLang . '/', $p);
                if (file_exists($fallbackPath)) {
                    $path = $fallbackPath;
                    break;
                }
            }
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