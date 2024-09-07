<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetCategory extends Model
{
    protected $table = 'budget_categories';

    public $timestamps = false;

    protected $fillable = [
        'budget_id',
        'category_id',
        'amount',
        'month',
    ];

    /**
     * Get the budget that owns the category budget.
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * Get the category that this budget entry belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
