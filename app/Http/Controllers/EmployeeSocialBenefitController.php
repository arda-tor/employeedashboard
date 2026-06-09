<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeSocialBenefitRequest;
use App\Http\Requests\UpdateEmployeeSocialBenefitRequest;
use App\Http\Resources\EmployeeSocialBenefitResource;
use App\Models\EmployeeSocialBenefit;
use Illuminate\Http\Request;

class EmployeeSocialBenefitController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('q', '');

        $employeeSocialBenefits = EmployeeSocialBenefit::with(['employee', 'socialBenefit'])
            ->when($query, function ($q) use ($query) {
                $q->where('status', 'like', "%{$query}%")
                    ->orWhereHas('employee', function ($employeeQuery) use ($query) {
                        $employeeQuery->where('name', 'like', "%{$query}%")
                            ->orWhere('email', 'like', "%{$query}%");
                    })
                    ->orWhereHas('socialBenefit', function ($benefitQuery) use ($query) {
                        $benefitQuery->where('name', 'like', "%{$query}%");
                    });
            })
            ->latest()
            ->paginate(15);

        return EmployeeSocialBenefitResource::collection($employeeSocialBenefits);
    }

    public function store(StoreEmployeeSocialBenefitRequest $request)
    {
        $employeeSocialBenefit = EmployeeSocialBenefit::create($request->validated())
            ->load(['employee', 'socialBenefit']);

        return (new EmployeeSocialBenefitResource($employeeSocialBenefit))
            ->response()
            ->setStatusCode(201);
    }

    public function show(EmployeeSocialBenefit $employeeSocialBenefit)
    {
        return new EmployeeSocialBenefitResource(
            $employeeSocialBenefit->load(['employee', 'socialBenefit'])
        );
    }

    public function update(UpdateEmployeeSocialBenefitRequest $request, EmployeeSocialBenefit $employeeSocialBenefit)
    {
        $employeeSocialBenefit->update($request->validated());

        return new EmployeeSocialBenefitResource(
            $employeeSocialBenefit->load(['employee', 'socialBenefit'])
        );
    }

    public function destroy(EmployeeSocialBenefit $employeeSocialBenefit)
    {
        $employeeSocialBenefit->delete();

        return response()->json(['message' => 'Employee social benefit deleted successfully'], 200);
    }
}
