<?php

declare(strict_types=1);

namespace App\Services;

class AcceptLanguageParser
{
    public function parse(string $languageString): array
    {
        $languages = [];

        preg_match_all('/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i', $languageString, $matches);

        if (count($matches[1])) {
            $languages = array_combine($matches[1], $matches[4]);

            foreach ($languages as $language => $value) {
                if ($value === '') {
                    $languages[$language] = 1;
                }
            }

            arsort($languages, SORT_NUMERIC);
        }

        return $languages;
    }

    public function getPreferredLanguage(array $languages): string
    {
        $filtered = array_filter(
            $languages,
            static fn ($key) => in_array($key, config('languages.allowed'), true),
            ARRAY_FILTER_USE_KEY
        );

        $keys = array_keys($filtered);
        $language = config('languages.default');

        if (count($keys) > 0) {
            $language = $keys[0];
        }

        return $language;
    }
}
