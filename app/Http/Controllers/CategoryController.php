<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Http\Requests\DeleteRequest;
use App\Models\BudgetCategory;
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

        $defaultCategories = Category::query()
            ->where('default', '=', 1)
            ->get();

        $categories = $user->categories->concat($defaultCategories);

        return response()->json([
            'data' => [
                'categories' => $categories
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(CategoryRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        // Any category that is created via API, is not a default category
        $validatedData['default'] = 0;

        // Add category
        $category = Category::create($validatedData);

        // Add category to the user
        $request->user()->categories()->attach($category->id);

        // Get budget of user
        $budget = $request->user()->budget;

        // If budget is already set, add this category to the budget with 0 amount set for each month
        if ($budget) {
            $this->addCategoryToBudget($budget->id, $category->id);
        }

        return response()->json([
            'data' => [
                'category' => $category
            ]
        ], 201);
    }

    /**
     * If user adds a category after their budget is already set, this function adds the new category to the budget with
     * amount '0' set for each month
     *
     * @param int $budgetId
     * @param int $categoryId
     * @return void
     */
    private function addCategoryToBudget(int $budgetId, int $categoryId): void
    {
        for ($month = 0; $month < 12; $month++) {
            BudgetCategory::create([
                'budget_id' => $budgetId,
                'category_id' => $categoryId,
                'amount' => 0,
                'month' => $month,
            ]);
        }
    }

    /**
     * Update transaction
     *
     * @param CategoryRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(CategoryRequest $request, int $id): JsonResponse
    {
        $validatedData = $request->validated();

        $category = Category::findOrFail($id);
        $category->update($validatedData);

        return response()->json([
            'data' => [
                'category' => $category
            ]
        ]);
    }

    /**
     * Delete category
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function delete(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        // Find the category for the authenticated user and delete it
        $category = $user
            ->categories()
            ->where('default', 0)
            ->findOrFail($id);

        $category->delete();

        return response()->json([
            'data' => [
                'category' => $category
            ]
        ]);
    }

    /**
     * Delete multiple categories
     *
     * @param DeleteRequest $request
     * @return JsonResponse
     */
    public function deleteMultiple(DeleteRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $user = $request->user();

        $categoryIds = $user->categories()
            ->whereIn('id', $validatedData['ids'])
            ->where('default', 0)
            ->get()
            ->pluck('id')
            ->toArray();

        Category::destroy($categoryIds);

        return response()->json([
            'data' => [
                'categories' => $categoryIds
            ]
        ]);
    }
}
