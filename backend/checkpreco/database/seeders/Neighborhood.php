<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Address;

class Neighborhood extends Seeder
{
    public function run(): void
    {
        $address = new Address;
        $row = 1;
        if (($handle = fopen(base_path("resources/neighborhood.csv"), "r")) !== false) {
            while (($data = fgetcsv($handle, 0, ",")) !== false) {
                $row++;

                $address::create([
                    'neighborhood' => $data[0],
                    'city' => $data[1],
                    'state' => $data[2],
                ]);
            }
            fclose($handle);
        }
    }
}
