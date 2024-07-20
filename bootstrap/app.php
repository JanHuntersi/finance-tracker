<?php

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e) {
            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'error' => 'Resource not found.'
                ], 404);
            }

            if ($e instanceof NotFoundHttpException) {
                return response()->json([
                    'error' => 'Invalid endpoint'
                ], 404);
            }

            // Handle other exceptions
            return response()->json([
                'error' => 'An unexpected error occurred'
            ], 500);
        });
    })->create();
