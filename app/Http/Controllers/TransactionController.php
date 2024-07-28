<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteRequest;
use App\Http\Requests\TransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Get transactions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function list(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'transactions' => $user
                    ->transactions()
                    ->with('category')
                    ->orderBy('date', 'DESC')
                    ->get()
            ]
        ]);
    }

    /**
     * Get transaction by id
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'transaction' => $user->transactions()->findOrFail($id)
            ]
        ]);
    }

    /**
     * Get transactions by category
     *
     * @param Request $request
     * @param int $category_id
     * @return JsonResponse
     */
    public function listByCategory(Request $request, int $category_id): JsonResponse
    {
        $user = $request->user();

        $transactions = $user
            ->transactions()
            ->where('category_id', $category_id)
            ->get();

        return response()->json([
            'data' => [
                'transactions' => $transactions
            ]
        ]);
    }

    /**
     * Get transactions by category
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function listByMultipleCategories(Request $request): JsonResponse
    {
        $user = $request->user();

        $categoryIds = $request->get('categoryIds', []);

        $transactions = $user
            ->transactions()
            ->with('category')
            ->whereIn('category_id', $categoryIds)
            ->get();

        return response()->json([
            'data' => [
                'transactions' => $transactions
            ]
        ]);
    }

    /**
     * Create transaction
     *
     * @param TransactionRequest $request
     * @return JsonResponse
     */
    public function create(TransactionRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        // Add transaction
        $transaction = Transaction::create($validatedData);

        // Add transaction to the user
        $request->user()->transactions()->attach($transaction->id);

        return response()->json([
            'data' => [
                'transaction' => $transaction
            ]
        ], 201);
    }

    /**
     * Update transaction
     *
     * @param TransactionRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TransactionRequest $request, int $id): JsonResponse
    {
        $validatedData = $request->validated();

        $transaction = Transaction::findOrFail($id);
        $transaction->update($validatedData);

        return response()->json([
            'data' => [
                'transaction' => $transaction
            ]
        ]);
    }

    /**
     * Update categories for transactions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateCategoriesForTransactions(Request $request): JsonResponse
    {
        $categoryChanges = $request->get('categoryChanges', []);

        foreach ($categoryChanges as $categoryChange) {
            foreach ($categoryChange as $fromCategoryId => $toCategoryId) {
                // Check if categories exist
                Category::findOrFail($fromCategoryId);
                Category::findOrFail($toCategoryId);

                // Update transactions with the new category ID
                Transaction::query()
                    ->where('category_id', $fromCategoryId)
                    ->update(['category_id' => $toCategoryId]);
            }
        }

        return response()->json([
            'data' => [
                'transaction' => 'Transactions updated'
            ]
        ]);
    }

    /**
     * Delete transaction
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function delete(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        // Find the transaction for the authenticated user and delete it
        $transaction = $user->transactions()->findOrFail($id);
        $transaction->delete();

        return response()->json([
            'data' => [
                'transaction' => $transaction
            ]
        ]);
    }

    /**
     * Delete multiple transactions
     *
     * @param DeleteRequest $request
     * @return JsonResponse
     */
    public function deleteMultiple(DeleteRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $user = $request->user();

        $transactionIds = $user->transactions()
            ->whereIn('id', $validatedData['ids'])
            ->get()
            ->pluck('id')
            ->toArray();

        Transaction::destroy($transactionIds);

        return response()->json([
            'data' => [
                'transactions' => $transactionIds
            ]
        ]);
    }
}
