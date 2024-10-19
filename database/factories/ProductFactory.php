<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = $this->faker->randomFloat(2, 10, 500);  // Random price between 10 and 500
        $discount = $this->faker->randomElement([5, 8, 10, 12, 15, 20]);  // Random discount from specified values
        $offerPrice = $price - ($price * ($discount / 100));  // Calculate offer price after discount

        return [
            'name' => $this->faker->word(),
            'code' => strtoupper($this->faker->lexify('PROD-???')),
            'details' => $this->faker->paragraph(),
            'top' => $this->faker->randomElement(['Y', 'N']),  // Random Y/N for top
            'feat' => $this->faker->randomElement(['Y', 'N']),  // Random Y/N for feat
            'k_details' => $this->faker->paragraph(),
            'd_details' => $this->faker->paragraph(),
            'sip_details' => $this->faker->paragraph(),
            'o_details' => $this->faker->paragraph(),
            'price' => $price,
            'discount' => $discount,
            'offer_price' => $offerPrice,
            'mfg_name' => $this->faker->company(),
            'total_qty' => $this->faker->numberBetween(1, 100),
            'alert_qty' => $this->faker->numberBetween(1, 10),
            'category_id' => Category::inRandomOrder()->first()->id,  // Assign a random category
            'prescription' => $this->faker->boolean(),
            'status' => $this->faker->numberBetween(0, 1),
            'returnable' => $this->faker->boolean(),
            'return_time' => $this->faker->numberBetween(1, 30),
        ];
    }
}
