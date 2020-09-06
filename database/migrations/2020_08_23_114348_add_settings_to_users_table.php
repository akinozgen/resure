<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSettingsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('private')->default(true);
            $table->boolean('notifications')->default(false);
            $table->boolean('show_twitter')->default(true);
            $table->boolean('only_anons')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('private');
            $table->dropColumn('notifications');
            $table->dropColumn('show_twitter');
            $table->dropColumn('only_anons');
        });
    }
}
