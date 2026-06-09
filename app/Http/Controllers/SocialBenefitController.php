<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSocialBenefitRequest;
use App\Http\Requests\UpdateSocialBenefitRequest;
use App\Http\Resources\SocialBenefitResource;
use App\Models\SocialBenefit;
use Illuminate\Http\Request;

class SocialBenefitController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('q', '');

        $socialBenefits = SocialBenefit::when($query, function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%");
        })->paginate(15);

        return SocialBenefitResource::collection($socialBenefits);
    }

    public function store(StoreSocialBenefitRequest $request)
    {
        $socialBenefit = SocialBenefit::create($request->validated());

        return (new SocialBenefitResource($socialBenefit))
            ->response()
            ->setStatusCode(201);
    }

    public function show(SocialBenefit $socialBenefit)
    {
        return new SocialBenefitResource($socialBenefit);
    }

    public function update(UpdateSocialBenefitRequest $request, SocialBenefit $socialBenefit)
    {
        $socialBenefit->update($request->validated());

        return new SocialBenefitResource($socialBenefit);
    }

    public function destroy(SocialBenefit $socialBenefit)
    {
        $socialBenefit->delete();

        return response()->json(['message' => 'Social benefit deleted successfully'], 200);
    }
}
