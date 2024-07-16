<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'default'
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
