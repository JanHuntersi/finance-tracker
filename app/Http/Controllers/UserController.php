<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }

    /**
     * Register a new user and return an auth token for further requests
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        $user = User::create($validatedData);

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token
            ]
        ], 201);
    }

    /**
     * Login a user and return an auth token for further requests
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('username', $request->username)->firstOrFail();

            if (!Hash::check($request->password, $user->password)) {
                return response()->json(["error" => "Invalid credentials"], 401);
            }

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ]);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["error" => $exception->getMessage()], 500);
        }
    }

    /**
     * Logout a user and delete their token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Clear users token
            $user->tokens()->delete();

            return response()->json([
                'data' => [
                    'message' => 'Logged out successfully'
                ]
            ]);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["error" => $exception->getMessage()], 500);
        }
    }
}
