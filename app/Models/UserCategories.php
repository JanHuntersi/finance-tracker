<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCategories extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "user_id",
        "category_id",
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
