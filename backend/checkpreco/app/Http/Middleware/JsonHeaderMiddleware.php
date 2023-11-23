<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class JsonHeaderMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->wantsJson()) {
            return response()->json([], 415);
        }

        if ($request->isMethod('post', 'put', 'patch') && !$request->isJson()) {
            return response()->json(['error' => 'Payload is not JSON!'], 415);
        }
        
        $response = $next($request);
        
        $response->header('Content-type', 'application/json; charset=utf-8');
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
        return $response;
        
    }
}

