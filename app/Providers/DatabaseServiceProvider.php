<?php
    
    namespace App\Providers;
    
    use Doctrine\DBAL\Types\StringType;
    use Doctrine\DBAL\Types\Type;
    use Illuminate\Support\ServiceProvider;
    
    class DatabaseServiceProvider extends ServiceProvider
    {
        public function register()
        {
            Type::addType('enum', StringType::class);
        }
    }