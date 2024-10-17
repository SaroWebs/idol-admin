<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderPayment extends Model
{
    use HasFactory;
    protected $guarded = null;

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
