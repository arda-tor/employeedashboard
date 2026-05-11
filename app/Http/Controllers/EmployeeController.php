<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->query('q', '');

        $employees = Employee::when($query, function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('phone', 'like', "%{$query}%");
        })->paginate(15);
        
        return EmployeeResource::collection($employees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
       $employee =Employee::create($request->validated());
       return (new EmployeeResource($employee)) 
       ->response()
       ->setStatusCode(201);
    }
    public function show(Employee $employee)
    {
      return new EmployeeResource($employee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee){
        $employee->update($request->validated());
        return new EmployeeResource($employee);
    }
    /**
     * Remove the specified resource from storage.
     */
     public function destroy (Employee $employee){
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully'], 200);
     }
}
