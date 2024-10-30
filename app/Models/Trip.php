<?php

namespace App\Models;

use App\Models\User;
use App\Models\TripItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trip extends Model
{
    use HasFactory;
    protected $guarded = null;

    public function tripItems()
    {
        return $this->hasMany(TripItem::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
