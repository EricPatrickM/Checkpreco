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
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('post', 'put', 'patch') && !$request->isJson()) {
            return response()->json(['error' => 'Payload is not JSON!'], 415);
        }

        /** @var \Illuminate\Http\Response $response */
        $response = $next($request);
        
        $response->header('Content-Type', 'application/json; charset=utf-8');
        $response->setContent(json_encode($response->original, JSON_UNESCAPED_UNICODE));
        /*$response->header('Content-type', 'application/json; charset=utf-8');
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);*/
        return $response;
        
    }
}

