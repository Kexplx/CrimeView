<?php

require __DIR__ . '/../../vendor/autoload.php';
$routes = require __DIR__ . '/../core/routes.php';

$router = new CrimeViewRouter($routes);
$router->direct(Request::url());
