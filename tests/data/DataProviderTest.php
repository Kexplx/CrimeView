<?php
// Run tests like this from root dir: .\vendor\bin\phpunit .\tests\data\
use PHPUnit\Framework\TestCase;

class DataProviderTest extends TestCase
{

    /**
     * @dataProvider dataProvider
     */
    public function testGetCountyCrimeRate(IDataProvider $provider)
    {
        $countyNames = ["Regensburg","Erlangen","München"];

        foreach ($countyNames as $countyName)
        {
            // expecting values between 0.0 and 1.0
            $this->assertEqualsWithDelta(0.5, $provider->getCountyCrimeRate($countyName), 0.5);
        }
    }

    /**
     * @dataProvider dataProvider
     */
    public function testGetCountiesOnRoute(IDataProvider $provider)
    {
        // Route data
        $regensburgCity = new City("Regensburg", "city", 59.000, 43.02);
        $erlangenCity = new City("Erlangen", "city", 46.0123, 40.10213);
        $nuernbergCity = new City("Nürnberg", "city", 45.0123, 41.10213);

        $routeRegensburgErlangen["from"] = $regensburgCity;
        $routeRegensburgErlangen["to"] = $erlangenCity;

        $routeErlangenNuernberg["from"] = $erlangenCity;
        $routeErlangenNuernberg["to"] = $nuernbergCity;

        $routeNuernbergRegensburg["from"] = $nuernbergCity;
        $routeNuernbergRegensburg["to"] = $regensburgCity;

        $cites = [$routeRegensburgErlangen, $routeErlangenNuernberg, $routeNuernbergRegensburg];

        // Test routes
        foreach ($cites as $route)
        {
            $counties = $provider->getCountiesOnRoute($route["from"], $route["to"]);
            $this->assertIsArray($counties);
            foreach ($counties as $county) 
            {
                $this->assertInstanceOf('County', $county);
            }
        }
    }

    /**
     * @dataProvider dataProvider
     */
    public function testMockGetCityFromName(IDataProvider $provider)
    {
        $cityNames = ["Regensburg","Erlangen","München"];

        foreach ($cityNames as $cityName)
        {
            $this->assertInstanceOf('City', $provider->getCityFromName($cityName));
        }
    }


    public function dataProvider() {
        return array(
                 array(new MockDataProvider));
    }
}
