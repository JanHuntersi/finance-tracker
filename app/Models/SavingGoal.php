<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingGoal extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'category_id',
        'description',
        'motivation',
        'amount',
        'deadline',
    ];

    /**
     * Get the user that owns the saving goal.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category associated with the saving goal.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
