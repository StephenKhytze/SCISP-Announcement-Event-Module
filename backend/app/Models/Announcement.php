<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $primaryKey = 'announcement_id';

    protected $fillable = [
        'title',
        'category',
        'source',
        'description',
        'pinned',
        'posted_by',
    ];

    protected function casts(): array
    {
        return [
            'pinned' => 'boolean',
        ];
    }

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by', 'user_id');
    }
}
