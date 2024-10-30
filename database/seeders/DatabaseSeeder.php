<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Pincodes;
use App\Models\UserRole;
use App\Models\CoreImage;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed user roles
        $roles = [
            ['name' => 'superadmin', 'code' => 0],
            ['name' => 'admin', 'code' => 1],
            ['name' => 'manager', 'code' => 2],
            ['name' => 'product manager', 'code' => 3],
            ['name' => 'delivery partner', 'code' => 4],
        ];

        foreach ($roles as $role) {
            UserRole::updateOrCreate(['name' => $role['name']], $role);
        }

        // Create an Admin user
        $adminRole = UserRole::where('code', 1)->first();
        User::updateOrCreate(
            ['email' => 'admin@idol.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@idol.com',
                'password' => bcrypt('admin123'),
                'user_role_id' => $adminRole->id,
            ]
        );

        // Seed pincodes
        $pincodes = [
            ['pin' => '781001', 'description' => 'Panbazar, Fancy Bazar', 'distance' => 4.5],
            ['pin' => '781002', 'description' => '', 'distance' => 3],
            ['pin' => '781003', 'description' => 'Silpukhuri', 'distance' => 3.5],
            ['pin' => '781004', 'description' => 'Dispur', 'distance' => 8.0],
            ['pin' => '781005', 'description' => 'Dispur', 'distance' => 8.0],
            ['pin' => '781010', 'description' => 'Kamakhya', 'distance' => 8.5],
            ['pin' => '781019', 'description' => 'Kahilipara', 'distance' => 7.0],
            ['pin' => '781024', 'description' => 'Zoo Road', 'distance' => 6.0],
            ['pin' => '781027', 'description' => 'Satgaon', 'distance' => 10.0],
            ['pin' => '781029', 'description' => 'Narangi', 'distance' => 12.0],
            ['pin' => '781034', 'description' => 'Odalbakra', 'distance' => 9.0],
            ['pin' => '781036', 'description' => 'Hengrabari', 'distance' => 7.0],
            ['pin' => '781038', 'description' => 'Birkuchi', 'distance' => 12.0],
            ['pin' => '781039', 'description' => 'Noonmati', 'distance' => 9.0],
        ];

        foreach ($pincodes as $pincode) {
            $pincode['active'] = 1;
            Pincodes::updateOrCreate(['pin' => $pincode['pin']], $pincode);
        }

        // Seed banners
        $banners = [
            ['image_url' => '/images/banner/1.png', 'type' => 'banner', 'status' => 1],
            ['image_url' => '/images/banner/2.png', 'type' => 'banner', 'status' => 1],
            ['image_url' => '/images/banner/3.png', 'type' => 'banner', 'status' => 1],
        ];

        foreach ($banners as $bnr) {
            CoreImage::updateOrCreate(['image_url' => $bnr['image_url']], $bnr);
        }

        // Seed categories
        $categories = [
            ['name' => 'All', 'icon_path' => '/images/category-icon/all.png', 'status' => 1],
            ['name' => 'Covid Essential', 'icon_path' => '/images/category-icon/covit-essential.jpg', 'status' => 1],
            ['name' => 'Fitness', 'icon_path' => '/images/category-icon/fitness.png', 'status' => 1],
            ['name' => 'Mom & Baby', 'icon_path' => '/images/category-icon/mom-baby.png', 'status' => 1],
            ['name' => 'Device & Surgical', 'icon_path' => '/images/category-icon/device-surgical.png', 'status' => 1],
            ['name' => 'First Aid', 'icon_path' => '/images/category-icon/first-aid.png', 'status' => 1],
            ['name' => 'Prescription Drugs', 'icon_path' => '/images/category-icon/presc-drug.png', 'status' => 1],
            ['name' => 'Ayurvedic', 'icon_path' => '/images/category-icon/ayurvedic.png', 'status' => 1],
            ['name' => 'Vitamins', 'icon_path' => '/images/category-icon/vitamins.png', 'status' => 1],
            ['name' => 'Health', 'icon_path' => '/images/category-icon/health.png', 'status' => 1],
            ['name' => 'Personal Care', 'icon_path' => '/images/category-icon/personal-care.png', 'status' => 1],
            ['name' => 'Diabetes', 'icon_path' => '/images/category-icon/diabetes.png', 'status' => 1],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }
        // Product::factory()->count(100)->create();
    }
}
