<?php

namespace App\Models;

use App\Models\CartItem;
use App\Models\CustomerLogin;
use App\Models\CustomerAddress;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class, 'customer_id');
    }


    public function customerLogins()
    {
        return $this->hasMany(CustomerLogin::class, 'customer_id');
    }
    
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
