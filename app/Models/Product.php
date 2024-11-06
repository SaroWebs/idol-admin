<?php

namespace App\Models;

use App\Models\Category;
use App\Models\Subcategory;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function tax() {
        return $this->belongsToOne(tax::class);
    }

}
