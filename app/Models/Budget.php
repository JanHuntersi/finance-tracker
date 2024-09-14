<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'amount',
        'advanced',
    ];

    /**
     * Get the user that owns the budget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the categories for the budget.
     */
    public function budgetCategories(): HasMany
    {
        return $this->hasMany(BudgetCategory::class);
    }
}
