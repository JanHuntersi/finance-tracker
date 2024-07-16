<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTransactions extends Model
{
    protected $fillable = [
        "user_id",
        "transaction_id",
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function transactions()
    {
        return $this->belongsToMany(Transaction::class);
    }
}
