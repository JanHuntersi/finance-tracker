<?php

namespace Database\Seeders;

use App\Models\Type;
use Illuminate\Database\Seeder;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Type::insert([
            ['name' => 'expense'],
            ['name' => 'income'],
            ['name' => 'savings'],
        ]);
    }
}
