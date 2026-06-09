<?php

namespace Database\Seeders;

use App\Models\SocialBenefit;
use Illuminate\Database\Seeder;

class SocialBenefitSeeder extends Seeder
{
    public function run(): void
    {
        $benefits = [
            [
                'name' => 'Meal Card',
                'description' => 'Monthly food allowance for employees.',
                'default_amount' => 2500,
            ],
            [
                'name' => 'Private Health Insurance',
                'description' => 'Supplementary private health insurance package.',
                'default_amount' => 4500,
            ],
            [
                'name' => 'Transport Support',
                'description' => 'Monthly transportation support.',
                'default_amount' => 1500,
            ],
            [
                'name' => 'Gym Membership',
                'description' => 'Wellness and gym membership support.',
                'default_amount' => 900,
            ],
            [
                'name' => 'Education Support',
                'description' => 'Training and certification budget.',
                'default_amount' => 3000,
            ],
        ];

        foreach ($benefits as $benefit) {
            SocialBenefit::updateOrCreate(
                ['name' => $benefit['name']],
                $benefit
            );
        }
    }
}
