<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Student Account
        User::factory()->create([
            'username' => 'DelaCruz_Juan_C1234',
            'password' => \Illuminate\Support\Facades\Hash::make('secretpassword123'),
            'role' => 'student',
            'status' => 'active',
        ]);

        // 2. Faculty Account
        User::factory()->create([
            'username' => 'Santos_Maria_F4021',
            'password' => \Illuminate\Support\Facades\Hash::make('secretpassword123'),
            'role' => 'faculty',
            'status' => 'active',
        ]);

        // 3. Administrator Account
        User::factory()->create([
            'username' => 'Admin_User_00001',
            'password' => \Illuminate\Support\Facades\Hash::make('secretpassword123'),
            'role' => 'administrator',
            'status' => 'active',
        ]);

        // 4. Superadmin Account
        User::factory()->create([
            'username' => 'SuperAdmin_User_00001',
            'password' => \Illuminate\Support\Facades\Hash::make('secretpassword123'),
            'role' => 'superadmin',
            'status' => 'active',
        ]);

        // Announcements & Event Registration module (Group 3)
        $this->call([
            AnnouncementSeeder::class,
            EventSeeder::class,
            EventRegistrationSeeder::class,
            EventRequestSeeder::class,
        ]);
    }
}
