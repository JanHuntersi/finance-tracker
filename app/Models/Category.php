<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'default',
        'category_id',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_categories');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
