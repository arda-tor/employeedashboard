<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\SocialBenefit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PDO;
use Tests\TestCase;

class EmployeeSocialBenefitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! in_array('sqlite', PDO::getAvailableDrivers(), true)) {
            $this->markTestSkipped('SQLite PDO driver is not available in this PHP environment.');
        }

        parent::setUp();
    }

    public function test_it_creates_employee_social_benefit_assignment(): void
    {
        $employee = Employee::factory()->create();
        $benefit = SocialBenefit::create([
            'name' => 'Meal Card',
            'description' => 'Monthly meal support.',
            'default_amount' => 2500,
        ]);

        $response = $this->postJson('/api/employee-social-benefits', [
            'employee_id' => $employee->id,
            'social_benefit_id' => $benefit->id,
            'amount' => 2500,
            'start_date' => '2026-01-01',
            'end_date' => null,
            'status' => 'active',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.employee_id', $employee->id)
            ->assertJsonPath('data.social_benefit_id', $benefit->id)
            ->assertJsonPath('data.employee_name', $employee->name)
            ->assertJsonPath('data.benefit_name', $benefit->name);

        $this->assertDatabaseHas('employee_social_benefits', [
            'employee_id' => $employee->id,
            'social_benefit_id' => $benefit->id,
            'status' => 'active',
        ]);
    }

    public function test_it_filters_employee_social_benefits_by_employee_name(): void
    {
        $employee = Employee::factory()->create(['name' => 'Alice Benefits']);
        $benefit = SocialBenefit::create([
            'name' => 'Transport Support',
            'description' => 'Monthly transport support.',
            'default_amount' => 1500,
        ]);

        $this->postJson('/api/employee-social-benefits', [
            'employee_id' => $employee->id,
            'social_benefit_id' => $benefit->id,
            'amount' => 1500,
            'start_date' => '2026-01-01',
            'end_date' => null,
            'status' => 'active',
        ])->assertCreated();

        $response = $this->getJson('/api/employee-social-benefits?q=Alice');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.employee_name', 'Alice Benefits')
            ->assertJsonPath('data.0.benefit_name', 'Transport Support');
    }

    public function test_it_updates_and_deletes_employee_social_benefit_assignment(): void
    {
        $employee = Employee::factory()->create();
        $benefit = SocialBenefit::create([
            'name' => 'Gym Membership',
            'description' => 'Gym access support.',
            'default_amount' => 900,
        ]);

        $assignmentId = $this->postJson('/api/employee-social-benefits', [
            'employee_id' => $employee->id,
            'social_benefit_id' => $benefit->id,
            'amount' => 900,
            'start_date' => '2026-01-01',
            'end_date' => null,
            'status' => 'active',
        ])->assertCreated()->json('data.id');

        $this->patchJson("/api/employee-social-benefits/{$assignmentId}", [
            'employee_id' => $employee->id,
            'social_benefit_id' => $benefit->id,
            'amount' => 1000,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'status' => 'inactive',
        ])
            ->assertOk()
            ->assertJsonPath('data.amount', 1000)
            ->assertJsonPath('data.status', 'inactive');

        $this->deleteJson("/api/employee-social-benefits/{$assignmentId}")
            ->assertOk();

        $this->assertDatabaseMissing('employee_social_benefits', [
            'id' => $assignmentId,
        ]);
    }
}
