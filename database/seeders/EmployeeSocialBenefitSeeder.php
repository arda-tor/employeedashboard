<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeSocialBenefit;
use App\Models\SocialBenefit;
use Illuminate\Database\Seeder;

class EmployeeSocialBenefitSeeder extends Seeder
{
    public function run(): void
    {
        $benefits = SocialBenefit::all();

        if ($benefits->isEmpty()) {
            return;
        }

        Employee::query()->limit(20)->get()->each(function (Employee $employee) use ($benefits) {
            $selectedBenefits = $benefits->random(min(2, $benefits->count()));

            foreach ($selectedBenefits as $benefit) {
                EmployeeSocialBenefit::updateOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'social_benefit_id' => $benefit->id,
                    ],
                    [
                        'amount' => $benefit->default_amount,
                        'start_date' => now()->startOfYear()->toDateString(),
                        'end_date' => null,
                        'status' => 'active',
                    ]
                );
            }
        });
    }
}
