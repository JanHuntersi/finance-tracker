<?php

use App\Models\Budget;
use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budget_categories', function (Blueprint $table) {
            $table->foreignIdFor(Budget::class)->constrained('budgets')->onDelete('cascade');
            $table->foreignIdFor(Category::class)->constrained('categories')->onDelete('cascade');
            $table->float('amount')->default(0);
            $table->integer('month');
            $table->unique(['budget_id', 'category_id', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_categories');
    }
};
