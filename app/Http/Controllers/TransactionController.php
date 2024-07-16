<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Get transactions
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function list()
    {
        return Transaction::all();
    }

    /**
     * Get transactions by category
     *
     * @param int $category_id
     * @return mixed
     */
    public function byCategory(int $category_id)
    {
        return Transaction::where('category_id', $category_id)
            ->get();
    }

    /**
     * Create transaction
     *
     * @param TransactionRequest $request
     * @return JsonResponse
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        $transaction = Transaction::create($validatedData);

        return response()->json($transaction, 201);
    }

    /**
     * Get transaction by id
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $transaction = Transaction::findOrFail($id);

            return response()->json($transaction);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Transaction not found.'], 404);
        }
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
        try {
            $validatedData = $request->validated();

            $transaction = Transaction::findOrFail($id);
            $transaction->update($validatedData);

            return response()->json($transaction);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Transaction not found.'], 404);
        }
    }

    /**
     * Delete transaction
     *
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->delete();

            return response()->json($transaction);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Transaction not found.'], 404);
        }
    }
}
