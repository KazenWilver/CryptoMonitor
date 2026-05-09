<?php
/**
 * CacheHelper — Cache simples em ficheiro para API calls
 */

class CacheHelper {
    public static function get(string $key, int $ttlSeconds = 60): ?string {
        $file = CACHE_DIR . md5($key) . '.cache';
        if (!file_exists($file)) return null;
        if (time() - filemtime($file) > $ttlSeconds) {
            @unlink($file);
            return null;
        }
        return file_get_contents($file);
    }

    public static function set(string $key, string $data): void {
        $file = CACHE_DIR . md5($key) . '.cache';
        file_put_contents($file, $data);
    }

    public static function delete(string $key): void {
        $file = CACHE_DIR . md5($key) . '.cache';
        if (file_exists($file)) @unlink($file);
    }

    public static function clear(): void {
        $files = glob(CACHE_DIR . '*.cache');
        foreach ($files as $file) {
            @unlink($file);
        }
    }
}
