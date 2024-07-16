<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\User;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultCategories = [
            ['name' => 'Food', 'description' => 'Expenses for food and groceries', 'default' => true],
            ['name' => 'Entertainment', 'description' => 'Expenses for movies, games, etc.', 'default' => true],
            ['name' => 'Transportation', 'description' => 'Expenses for commuting', 'default' => true],
            ['name' => 'Utilities', 'description' => 'Expenses for utilities', 'default' => true],
            ['name' => 'Healthcare', 'description' => 'Expenses for medical and healthcare', 'default' => true],
            ['name' => 'Education', 'description' => 'Expenses for education and learning', 'default' => true],
            ['name' => 'Shopping', 'description' => 'Expenses for shopping', 'default' => true],
            ['name' => 'Travel', 'description' => 'Expenses for travel and vacations', 'default' => true],
            ['name' => 'Gym', 'description' => 'Expenses for gym and fitness', 'default' => true],
            ['name' => 'Insurance', 'description' => 'Expenses for insurance premiums', 'default' => true],
            ['name' => 'Gifts', 'description' => 'Expenses for gifts and presents', 'default' => true],
            ['name' => 'Dining Out', 'description' => 'Expenses for dining at restaurants', 'default' => true],
            ['name' => 'Charity', 'description' => 'Expenses for charitable donations', 'default' => true],
            ['name' => 'Home Maintenance', 'description' => 'Expenses for home repairs', 'default' => true],
            ['name' => 'Pets', 'description' => 'Expenses for pet care', 'default' => true],
        ];

        foreach ($defaultCategories as $category) {
            Category::insert($category);
        }

        $user = User::first();

        $customCategories = [
            ['name' => 'Hobbies', 'description' => 'Expenses for hobbies and interests', 'default' => false, 'user_id' => $user->id],
            ['name' => 'Electronics', 'description' => 'Expenses for electronic gadgets', 'default' => false, 'user_id' => $user->id],
            ['name' => 'Investments', 'description' => 'Expenses for investments and savings', 'default' => false, 'user_id' => $user->id],
            ['name' => 'Home Decor', 'description' => 'Expenses for home decoration', 'default' => false, 'user_id' => $user->id],
            ['name' => 'Fashion', 'description' => 'Expenses for clothing and fashion', 'default' => false, 'user_id' => $user->id],
        ];

        foreach ($customCategories as $category) {
            Category::insert($category);
        }
    }
}
