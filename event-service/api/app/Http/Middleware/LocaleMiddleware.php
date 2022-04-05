<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\AcceptLanguageParser;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocaleMiddleware
{
    public function handle(Request $request, Closure $next): JsonResponse
    {
        if ($request->hasHeader('Accept-Language')) {

            $parser = new AcceptLanguageParser();
            $results = $parser->parse($request->header('Accept-Language'));

            app()->setLocale($parser->getPreferredLanguage($results));
        }

        return $next($request);
    }
}
