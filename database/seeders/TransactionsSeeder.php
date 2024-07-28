<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use App\Models\UserTransactions;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

class TransactionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        // Get all categories
        $categories = Category::all();

        // Number of transactions to create per user
        $minTransactions = 10;
        $maxTransactions = 20;

        // Loop through each user
        foreach ($users as $user) {
            // Generate random number of transactions between $minTransactions and $maxTransactions
            $numTransactions = rand($minTransactions, $maxTransactions);

            // Loop to create transactions
            for ($i = 0; $i < $numTransactions; $i++) {
                // Generate a random date within the last 3 months
                $date = Carbon::now()->subMonths(rand(0, 2))->subDays(rand(0, 30));

                if ($user->id == 1) {
                    // Pick a random category
                    $category = $categories->random()->id;
                } else {
                    // Pick a random default category
                    $category = rand(1, 18);
                }



                $transaction = Transaction::create([
                    'name' => 'Transaction ' . ($i + 1),
                    'description' => 'Random transaction for testing',
                    'amount' => rand(10, 100),
                    'type_id' => 1,
                    'date' => $date,
                    'category_id' => $category,
                ]);

                UserTransactions::insert([
                    'user_id' => $user->id,
                    'transaction_id' => $transaction->id,
                ]);
            }
        }
    }
}
