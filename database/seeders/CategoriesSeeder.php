<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\UserCategories;
use Illuminate\Database\Seeder;
use App\Models\User;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultExpenseCategories = [
            ['name' => 'Food', 'description' => 'Expenses for food and groceries', 'type_id' => 1, 'default' => true],
            ['name' => 'Entertainment', 'description' => 'Expenses for movies, games, etc.', 'type_id' => 1, 'default' => true],
            ['name' => 'Transportation', 'description' => 'Expenses for commuting', 'type_id' => 1, 'default' => true],
            ['name' => 'Education', 'description' => 'Expenses for education and learning', 'type_id' => 1, 'default' => true],
            ['name' => 'Shopping', 'description' => 'Expenses for shopping', 'type_id' => 1, 'default' => true],
            ['name' => 'Travel', 'description' => 'Expenses for travel and vacations', 'type_id' => 1, 'default' => true],
            ['name' => 'Gym', 'description' => 'Expenses for gym and fitness', 'type_id' => 1, 'default' => true],
            ['name' => 'Insurance', 'description' => 'Expenses for insurance premiums', 'type_id' => 1, 'default' => true],
            ['name' => 'Gifts', 'description' => 'Expenses for gifts and presents', 'type_id' => 1, 'default' => true],
            ['name' => 'Dining Out', 'description' => 'Expenses for dining at restaurants', 'type_id' => 1, 'default' => true],
            ['name' => 'Charity', 'description' => 'Expenses for charitable donations', 'type_id' => 1, 'default' => true],
        ];

        foreach ($defaultExpenseCategories as $category) {
            Category::insert($category);
        }

        $defaultIncomeCategories = [
            ['name' => 'Main job', 'description' => 'Income from main job', 'type_id' => 2, 'default' => true],
            ['name' => 'Side hustle', 'description' => 'Income from side hustle', 'type_id' => 2, 'default' => true],
            ['name' => 'Gift', 'description' => 'Income from gifts', 'type_id' => 2, 'default' => true],
        ];

        foreach ($defaultIncomeCategories as $category) {
            Category::insert($category);
        }

        $defaultSavingsCategories = [
            ['name' => 'Stocks', 'description' => 'Savings in stocks', 'type_id' => 3, 'default' => true],
            ['name' => 'Cryptocurrencies', 'description' => 'Savings in cryptocurrencies', 'type_id' => 3, 'default' => true],
            ['name' => 'Commodities', 'description' => 'Savings in commodities', 'type_id' => 3, 'default' => true],
            ['name' => 'Cash', 'description' => 'Savings in cash', 'type_id' => 3, 'default' => true],
        ];

        foreach ($defaultSavingsCategories as $category) {
            Category::insert($category);
        }

        $user = User::first();

        $customCategories = [
            ['name' => 'Hobbies', 'description' => 'Expenses for hobbies and interests', 'type_id' => 1, 'default' => false],
            ['name' => 'Electronics', 'description' => 'Expenses for electronic gadgets', 'type_id' => 1, 'default' => false],
            ['name' => 'Investments', 'description' => 'Expenses for investments and savings', 'type_id' => 1, 'default' => false],
            ['name' => 'Home Decor', 'description' => 'Expenses for home decoration', 'type_id' => 1, 'default' => false],
            ['name' => 'Fashion', 'description' => 'Expenses for clothing and fashion', 'type_id' => 1, 'default' => false],
            ['name' => 'Custom art', 'description' => 'Income from custom art requests', 'type_id' => 2, 'default' => false],
            ['name' => 'Coaching', 'description' => 'Income from coaching', 'type_id' => 2, 'default' => false],
            ['name' => 'Legos', 'description' => 'Savings in legos', 'type_id' => 3, 'default' => false],
            ['name' => 'Coin collection', 'description' => 'Savings in coin collection', 'type_id' => 3, 'default' => false],
        ];

        foreach ($customCategories as $category) {
            $createdCategory = Category::create([
                'name' => $category['name'],
                'description' => $category['description'],
                'default' => $category['default'],
                'type_id' => $category['type_id'],
            ]);

            UserCategories::insert([
                'user_id' => $user->id,
                'category_id' => $createdCategory->id,
            ]);
        }
    }
}
