<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "name",
        "description",
        "type_id",
        "amount",
        "date",
        "category_id",
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_transactions', 'transaction_id', 'user_id');
    }
}
