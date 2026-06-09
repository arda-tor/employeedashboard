<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'note' => fake()->optional()->sentence(),
            'salary' => fake()->randomFloat(2, 2000, 10000),
        ];
    }
}
