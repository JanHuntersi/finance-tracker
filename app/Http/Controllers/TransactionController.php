<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
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
                'transactions' => $user->transactions
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
     * Create transaction
     *
     * @param TransactionRequest $request
     * @return JsonResponse
     */
    public function create(TransactionRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        $transaction = Transaction::create($validatedData);

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
     * Delete transaction
     *
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json([
            'data' => [
                'transaction' => $transaction
            ]
        ]);
    }
}
