<?php

namespace App\Helpers;

class FrontendError
{
    public $icon;
    public $loader;
    public $title;
    public $description;
    public $loaderBg;
    public $timeout;
    public $name;
    
    private function __construct($data)
    {
        $this->icon = $data['icon'];
        $this->loader = $data['loader'];
        $this->title = $data['title'];
        $this->icon = $data['icon'];
        $this->loaderBg = $data['loaderBg'];
        $this->description = $data['description'];
        $this->timeout = $data['timeout'];
        $this->name = md5($data['name']);
    }
    
    public static function create($data)
    {
        return new self($data);
    }
}