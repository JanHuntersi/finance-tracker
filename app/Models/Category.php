<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'default',
        'type_id',
        'icon',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_categories');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the budget categories associated with the category.
     */
    public function budgetCategories(): HasMany
    {
        return $this->hasMany(BudgetCategory::class);
    }

    /**
     * Get the saving goals associated with the category.
     */
    public function goals(): HasMany
    {
        return $this->hasMany(SavingGoal::class);
    }

    /**
     * Return default categories
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeDefaultCategories(Builder $query): Builder
    {
        return $query->where('default', 1);
    }
}
