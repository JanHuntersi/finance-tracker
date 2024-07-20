<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get default categories
     *
     * @return JsonResponse
     */
    public function defaultCategories(): JsonResponse
    {
        $defaultCategories = Category::query()
            ->where('default', true)
            ->get();

        return response()->json([
            'data' => [
                'categories' => $defaultCategories
            ]
        ]);
    }

    /**
     * Get user categories
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function userCategories(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'categories' => $user->categories
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
