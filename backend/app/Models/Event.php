<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $primaryKey = 'event_id';

    protected $fillable = [
        'type',
        'title',
        'description',
        'event_date',
        'event_time',
        'venue',
        'host',
        'seats_total',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class, 'event_id', 'event_id');
    }

    public function getSeatsTakenAttribute(): int
    {
        return $this->registrations()->where('status', '!=', 'Cancelled')->count();
    }
}
