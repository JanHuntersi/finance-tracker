<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetRequest;
use App\Models\Budget;
use App\Models\BudgetCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /**
     * Get budget of user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Get user from request
        $user = $request->user();

        // Get user budget
        $budget = $user->budget;

        // Get budget categories of user
        $budgetCategories = $budget
            ? $budget->budgetCategories()->with('category')->get()
            : [];

        return response()->json([
            'data' => [
                'budget' => $budgetCategories,
                'type' => $budget ? $budget->advanced : false,
            ]
        ]);
    }

    /**
     * Create a budget for the user
     *
     * @param BudgetRequest $request
     * @return JsonResponse
     */
    public function create(BudgetRequest $request): JsonResponse
    {
        // Get information from the request
        $budget = $request->all()['budget'];
        $isAdvanced = $request->all()['advanced'];

        // Get user budget
        $userBudget = $request->user()->budget;

        // Check if user already has a budget and fetch it, otherwise create it and get its id
        if (is_null($userBudget)) {
            $budgetId = Budget::query()
                ->create([
                    'user_id' => $request->user()->id,
                ])
                ->id;
        } else {
            $budgetId = $request->user()->budget->id;
        }

        // Save the budget
        foreach($budget as $key => $value) {
            // Categories in $budget are saved in format type_id_month
            // Example: expense_1_1 => expense category, with id 1, for month 1 (february)
            // So we need to get this data, so we can create entries for 'budget_categories' table
            $categoryExploded = explode('_', $key);

            if ($isAdvanced) {
                BudgetCategory::create([
                    'budget_id' => $budgetId,
                    'category_id' => $categoryExploded[1],
                    'amount' => $value,
                    'month' => $categoryExploded[2],
                ]);
            } else {
                // If budget is added from a 'simple' form, all months need to have the same amount
                for ($month = 0; $month < 12; $month++) {
                    BudgetCategory::create([
                        'budget_id' => $budgetId,
                        'category_id' => $categoryExploded[1],
                        'amount' => $value,
                        'month' => $month,
                    ]);
                }
            }
        }

        // Set which form type should be shown by default
        Budget::findOrFail($budgetId)
            ->update(['advanced' => $isAdvanced]);

        return response()->json("Budget saved");
    }

    /**
     * Update a budget for the user
     *
     * @param BudgetRequest $request
     * @return JsonResponse
     */
    public function update(BudgetRequest $request): JsonResponse
    {
        // Get information from the request
        $budget = $request->all()['budget'];
        $isAdvanced = $request->all()['advanced'];

        // Get user budget
        $budgetId = $request->user()->budget->id;

        // Save the budget
        foreach($budget as $key => $value) {
            // Categories in $budget are saved in format type_id_month
            // Example: expense_1_1 => expense category, with id 1, for month 1 (february)
            // So we need to get this data, so we can create entries for 'budget_categories' table
            $categoryExploded = explode('_', $key);

            if ($isAdvanced) {
                BudgetCategory::query()
                ->where([
                    'budget_id' => $budgetId,
                    'category_id' => $categoryExploded[1],
                    'month' => $categoryExploded[2],
                ])
                ->update([
                    'amount' => $value,
                ]);
            } else {
                BudgetCategory::query()
                    ->where([
                        'budget_id' => $budgetId,
                        'category_id' => $categoryExploded[1],
                    ])
                    ->update([
                        'amount' => $value,
                    ]);
            }
        }

        // User wants to see advanced budget as default
        Budget::findOrFail($budgetId)
            ->update(['advanced' => $isAdvanced]);

        return response()->json("Budget saved");
    }
}
