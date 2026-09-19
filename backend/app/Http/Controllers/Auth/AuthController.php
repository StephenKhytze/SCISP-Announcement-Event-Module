<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Group 1: Add authentication logic here
    public function login(Request $request) {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        try {
            $user = User::where('username', $credentials['username'])->first();
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Database connection error. Please try again later.'
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred during authentication.'
            ], 500);
        }

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid username or password.'
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account has been disabled.'
            ], 403);
        }

        $name = 'Test User';
        $role = 'Student';
        $department = 'IT';
        $idNumber = '99999';

        if ($user->username === 'DelaCruz_Juan_C1234') {
            $name = 'Juan Dela Cruz';
            $role = 'Student';
            $department = 'College of Computer Studies';
            $idNumber = '2023-00123';
        } elseif ($user->username === 'Santos_Maria_F4021' || $user->role === 'faculty') {
            $name = $user->username === 'Santos_Maria_F4021' ? 'Prof. Maria Santos' : str_replace('_', ' ', $user->username);
            $role = 'Teacher';
            $department = 'Faculty of Computer Studies';
            $idNumber = 'FAC-4021';
        } elseif ($user->username === 'Admin_User_00001' || $user->role === 'administrator') {
            $name = $user->username === 'Admin_User_00001' ? 'Dr. Alejandro Reyes' : str_replace('_', ' ', $user->username);
            $role = 'Admin';
            $department = 'Office of the Dean';
            $idNumber = 'ADM-0091';
        } elseif ($user->username === 'SuperAdmin_User_00001' || $user->role === 'superadmin') {
            $name = $user->username === 'SuperAdmin_User_00001' ? 'Engr. Marco Torres' : str_replace('_', ' ', $user->username);
            $role = 'Super Admin';
            $department = 'IT Infrastructure & Security';
            $idNumber = 'SA-0001';
        } else {
            $name = str_replace('_', ' ', $user->username);
            $role = ucfirst($user->role);
            $department = 'Academic';
            $idNumber = (string)(10000 + $user->user_id);
        }

        try {
            $jwt = \App\Services\JwtService::generateToken($user, [
                'name' => $name,
                'role' => $role,
                'department' => $department,
                'idNumber' => $idNumber,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate authentication token: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'access_token' => $jwt,
            'user' => [
                'name' => $name,
                'username' => $user->username,
                'role' => $role,
                'department' => $department,
                'idNumber' => $idNumber,
            ]
        ]);
    }

    public function logout(Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out.'
        ]);
    }
}
