<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SavingGoal;
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
            ['name' => 'Food', 'description' => 'Expenses for food and groceries', 'type_id' => 1, 'default' => true, 'icon' => 'restaurant'],
            ['name' => 'Entertainment', 'description' => 'Expenses for movies, games, etc.', 'type_id' => 1, 'default' => true, 'icon' => 'sports_esports'],
            ['name' => 'Transportation', 'description' => 'Expenses for commuting', 'type_id' => 1, 'default' => true, 'icon' => 'commute'],
            ['name' => 'Education', 'description' => 'Expenses for education and learning', 'type_id' => 1, 'default' => true, 'icon' => 'school'],
            ['name' => 'Shopping', 'description' => 'Expenses for shopping', 'type_id' => 1, 'default' => true, 'icon' => 'shopping_bag'],
            ['name' => 'Travel', 'description' => 'Expenses for travel and vacations', 'type_id' => 1, 'default' => true, 'icon' => 'flight'],
            ['name' => 'Gym', 'description' => 'Expenses for gym and fitness', 'type_id' => 1, 'default' => true, 'icon' => 'fitness_center'],
            ['name' => 'Insurance', 'description' => 'Expenses for insurance premiums', 'type_id' => 1, 'default' => true, 'icon' => 'health_and_safety'],
            ['name' => 'Gifts', 'description' => 'Expenses for gifts and presents', 'type_id' => 1, 'default' => true, 'icon' => 'redeem'],
            ['name' => 'Dining Out', 'description' => 'Expenses for dining at restaurants', 'type_id' => 1, 'default' => true, 'icon' => 'lunch_dining'],
            ['name' => 'Charity', 'description' => 'Expenses for charitable donations', 'type_id' => 1, 'default' => true, 'icon' => 'volunteer_activism'],
        ];

        foreach ($defaultExpenseCategories as $category) {
            Category::insert($category);
        }

        $defaultIncomeCategories = [
            ['name' => 'Main job', 'description' => 'Income from main job', 'type_id' => 2, 'default' => true, 'icon' => 'work'],
            ['name' => 'Side hustle', 'description' => 'Income from side hustle', 'type_id' => 2, 'default' => true, 'icon' => 'storefront'],
            ['name' => 'Gift', 'description' => 'Income from gifts', 'type_id' => 2, 'default' => true, 'icon' => 'redeem'],
        ];

        foreach ($defaultIncomeCategories as $category) {
            Category::insert($category);
        }

        $defaultSavingsCategories = [
            ['name' => 'Stocks', 'description' => 'Savings in stocks', 'type_id' => 3, 'default' => true, 'icon' => 'show_chart'],
            ['name' => 'Cryptocurrencies', 'description' => 'Savings in cryptocurrencies', 'type_id' => 3, 'default' => true, 'icon' => 'currency_bitcoin'],
            ['name' => 'Commodities', 'description' => 'Savings in commodities', 'type_id' => 3, 'default' => true, 'icon' => 'show_chart'],
            ['name' => 'Cash', 'description' => 'Savings in cash', 'type_id' => 3, 'default' => true, 'icon' => 'attach_money'],
        ];

        $user = User::first();

        foreach ($defaultSavingsCategories as $category) {
            $category = Category::create($category);

            SavingGoal::insert([
                'user_id'     => $user->id,
                'category_id' => $category->id,
            ]);
        }

        $customCategories = [
            ['name' => 'Hobbies', 'description' => 'Expenses for hobbies and interests', 'type_id' => 1, 'default' => false, 'icon' => 'hiking'],
            ['name' => 'Electronics', 'description' => 'Expenses for electronic gadgets', 'type_id' => 1, 'default' => false, 'icon' => 'tv_gen'],
            ['name' => 'Investments', 'description' => 'Expenses for investments and savings', 'type_id' => 1, 'default' => false, 'icon' => 'show_chart'],
            ['name' => 'Home Decor', 'description' => 'Expenses for home decoration', 'type_id' => 1, 'default' => false, 'icon' => 'chair'],
            ['name' => 'Fashion', 'description' => 'Expenses for clothing and fashion', 'type_id' => 1, 'default' => false, 'icon' => 'checkroom'],
            ['name' => 'Custom art', 'description' => 'Income from custom art requests', 'type_id' => 2, 'default' => false, 'icon' => 'palette'],
            ['name' => 'Coaching', 'description' => 'Income from coaching', 'type_id' => 2, 'default' => false, 'icon' => 'fitness_center'],
            ['name' => 'Legos', 'description' => 'Savings in legos', 'type_id' => 3, 'default' => false, 'icon' => 'toys'],
            ['name' => 'Coin collection', 'description' => 'Savings in coin collection', 'type_id' => 3, 'default' => false, 'icon' => 'apps'],
        ];

        foreach ($customCategories as $category) {
            $createdCategory = Category::create([
                'name'        => $category['name'],
                'description' => $category['description'],
                'default'     => $category['default'],
                'type_id'     => $category['type_id'],
                'icon'        => $category['icon'],
            ]);

            UserCategories::insert([
                'user_id'     => $user->id,
                'category_id' => $createdCategory->id,
            ]);

            if ($category['type_id'] === 3) {
                SavingGoal::insert([
                    'user_id'     => $user->id,
                    'category_id' => $createdCategory->id,
                ]);
            }
        }
    }
}
