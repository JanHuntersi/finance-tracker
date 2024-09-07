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
        $user = $request->user();

        $budget = $user->budget;

        $budgetCategories = $budget ? $budget->budgetCategories : [];

        return response()->json([
            'data' => [
                'budget' => $budgetCategories,
                'type' => $budget->advanced,
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
        $budget = $request->all()['budget'];
        $isAdvanced = $request->all()['advanced'];

        $budgetId = $request->user()->budget->id;

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

                // User wants to see advanced budget as default
                Budget::find($budgetId)
                    ->update(['advanced' => true]);
            } else {
                for ($month = 0; $month < 12; $month++) {
                    BudgetCategory::create([
                        'budget_id' => $budgetId,
                        'category_id' => $categoryExploded[1],
                        'amount' => $value,
                        'month' => $month,
                    ]);
                }

                // User wants to see simple budget as default
                Budget::find($budgetId)
                    ->update(['advanced' => false]);
            }
        }

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
        $budget = $request->all()['budget'];
        $isAdvanced = $request->all()['advanced'];

        $budgetId = $request->user()->budget->id;

        foreach($budget as $key => $value) {

            // Categories in $budget are saved in format type_id_month
            // Example: expense_1_1 => expense category, with id 1, for month 1 (february)
            // So we need to get this data, so we can create entries for 'budget_categories' table
            $categoryExploded = explode('_', $key);

            if ($isAdvanced) {
                BudgetCategory::update([
                    'budget_id' => $budgetId,
                    'category_id' => $categoryExploded[1],
                    'amount' => $value,
                    'month' => $categoryExploded[2],
                ]);

                // User wants to see advanced budget as default
                Budget::find($budgetId)
                    ->update(['advanced' => true]);
            } else {
                for ($month = 0; $month < 12; $month++) {
                    BudgetCategory::query()
                        ->where([
                            'budget_id' => $budgetId,
                            'category_id' => $categoryExploded[1],
                        ])
                        ->update([
                            'amount' => $value,
                        ]);
                }

                // User wants to see simple budget as default
                Budget::find($budgetId)
                    ->update(['advanced' => false]);
            }
        }

        return response()->json("Budget saved");
    }
}
