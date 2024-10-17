<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Pincodes;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $su = UserRole::create(['name' => 'superadmin', 'code' => 0]);
        // $au = UserRole::create(['name' => 'admin', 'code' => 1]);
        // $ma = UserRole::create(['name' => 'manager', 'code' => 2]);
        // $pu = UserRole::create(['name' => 'product manager', 'code' => 3]);
        // $dp = UserRole::create(['name' => 'delivery partner', 'code' => 4]);

        // // Create an user named Admin with admin role
        // User::create([
        //     'name' => 'Admin',
        //     'email' => 'admin@idol.com',
        //     'password' => bcrypt('admin123'),
        //     'user_role_id' => $au->id,
        // ]);
        // Seed some pincodes
        // $pincodes = [
        //     ['pin' => '781001', 'description' => 'Panbazar, Fancy Bazar', 'distance' => 4.5],
        //     ['pin' => '781003', 'description' => 'Silpukhuri', 'distance' => 3.5],
        //     ['pin' => '781005', 'description' => 'Dispur', 'distance' => 8.0],
        //     ['pin' => '781010', 'description' => 'Kamakhya', 'distance' => 8.5],
        //     ['pin' => '781019', 'description' => 'Kahilipara', 'distance' => 7.0],
        //     ['pin' => '781024', 'description' => 'Zoo Road', 'distance' => 6.0],
        //     ['pin' => '781027', 'description' => 'Satgaon', 'distance' => 10.0],
        //     ['pin' => '781029', 'description' => 'Narangi', 'distance' => 12.0],
        //     ['pin' => '781034', 'description' => 'Odalbakra', 'distance' => 9.0],
        //     ['pin' => '781036', 'description' => 'Hengrabari', 'distance' => 7.0],
        //     ['pin' => '781038', 'description' => 'Birkuchi', 'distance' => 12.0],
        //     ['pin' => '781039', 'description' => 'Noonmati', 'distance' => 9.0]
        // ];

        // foreach ($pincodes as $pincode) {
        //     $pincode['active'] = 1;
        //     Pincodes::updateOrCreate(['pin' => $pincode['pin']], $pincode);
        // }
    }
}
