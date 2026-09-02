<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        Event::insert([
            [
                'type' => 'Hackathon',
                'title' => 'Annual College Hackathon 2026: AI & Cloud Computing',
                'description' => 'Build innovative AI solutions and cloud microservices in 24 hours. Open to all BSIT & BSCS students.',
                'event_date' => '2026-08-15',
                'event_time' => '09:00 AM - 05:00 PM',
                'venue' => 'CCS Audio-Visual Hall',
                'host' => 'CCS Student Council & Dev Club',
                'seats_total' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Symposium',
                'title' => 'Cybersecurity & Ethical Hacking Symposium',
                'description' => 'Industry practitioners discuss penetration testing, network defense, and zero-trust security frameworks.',
                'event_date' => '2026-08-22',
                'event_time' => '01:00 PM - 04:30 PM',
                'venue' => 'Tech Auditorium B',
                'host' => 'Information Security Org',
                'seats_total' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Career Fair',
                'title' => 'Graduate Career Fair & Industry Partner Expo',
                'description' => 'Meet recruiters from top tech enterprises, software houses, and financial institutions for internships & jobs.',
                'event_date' => '2026-09-05',
                'event_time' => '10:00 AM - 04:00 PM',
                'venue' => 'University Grand Gymnasium',
                'host' => 'Office of Student Placement',
                'seats_total' => 300,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Workshop',
                'title' => 'Database Systems & SQL Optimization Workshop',
                'description' => 'Hands-on query execution plan tuning, indexing strategies, and performance profiling for relational databases.',
                'event_date' => '2026-08-29',
                'event_time' => '01:00 PM - 05:00 PM',
                'venue' => 'Computer Laboratory 3',
                'host' => 'Database Systems Guild',
                'seats_total' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
