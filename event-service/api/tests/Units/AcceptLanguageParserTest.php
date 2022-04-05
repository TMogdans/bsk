<?php

declare(strict_types=1);

namespace Tests\Units;

use App\Services\AcceptLanguageParser;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AcceptLanguageParserTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        /**
         * Overwrite existing language configuration for testing purpose
         */
        Config::set('languages.default', 'fr');
        Config::set('languages.allowed', ['fr', 'en']);
    }

    public function test_it_parses_language_string(): void
    {
        $languageString = 'en-ca,en;q=0.8,en-us;q=0.6,de-de;q=0.4,de;q=0.2';
        $expectedResult = [
            "en-ca" => 1,
            "en" => "0.8",
            "en-us" => "0.6",
            "de-de" => "0.4",
            "de" => "0.2"
        ];

        $parser = new AcceptLanguageParser();
        $result = $parser->parse($languageString);

        self::assertEquals($expectedResult, $result);
    }

    public function test_it_returns_empty_array_on_empty_language_string(): void
    {
        $languageString = '';
        $expectedResult = [];

        $parser = new AcceptLanguageParser();
        $result = $parser->parse($languageString);

        self::assertEquals($expectedResult, $result);
    }

    public function test_it_returns_preferred_language(): void
    {
        $languageString = 'en-ca,en;q=0.8,en-us;q=0.6,de-de;q=0.4,de;q=0.2';
        $expectedResult = 'en';

        $parser = new AcceptLanguageParser();
        $parsedLanguages = $parser->parse($languageString);
        $result = $parser->getPreferredLanguage($parsedLanguages);

        self::assertEquals($expectedResult, $result);
    }

    public function test_it_returns_default_language_on_not_supported_languages(): void
    {
        $languageString = 'de-de;q=0.4,de;q=0.2';
        $expectedResult = 'fr';

        $parser = new AcceptLanguageParser();
        $parsedLanguages = $parser->parse($languageString);
        $result = $parser->getPreferredLanguage($parsedLanguages);

        self::assertEquals($expectedResult, $result);
    }

    public function test_it_returns_default_language_on_empty_language_string(): void
    {
        $languageString = '';
        $expectedResult = 'fr';

        $parser = new AcceptLanguageParser();
        $parsedLanguages = $parser->parse($languageString);
        $result = $parser->getPreferredLanguage($parsedLanguages);

        self::assertEquals($expectedResult, $result);
    }
}
