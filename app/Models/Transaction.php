<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "name",
        "description",
        "type",
        "amount",
        "date",
        "category_id",
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
