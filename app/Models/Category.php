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
}
