<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        User::create([
            'username' => 'user1',
            'email' => 'user1@gmail.com',
            'password' => bcrypt('password'),
        ]);

        User::create([
            'username' => 'user2',
            'email' => 'user2@outlook.com',
            'password' => bcrypt('password'),
        ]);
    }
}
