<html lang='en'>

<head>
    <title>Home / CrimeView</title>
    <?php require __DIR__ . '/shared/head.view.php'; ?>
</head>

<body>
    <?php require __DIR__ . '/shared/navbar.view.php'; ?>
    <div class='container'>
        <div class='row align-items-center align-items-xl-center mt-5 justify-content-between'>
            <div class='col-sm-6 mb-2'>
                <h1>CrimeView </h1>
                <small>
                    <p>CrimeView analyses your travel route and generates an overview of all german-counties
                        and their current crime rates you'll pass. </p>
                    <p>We retrieve our data from a variety of open data sources. Use the navbar above to check them out.</p>
                    <p>This project was built for the <a target='_blank' href='https://osr.cs.fau.de/teaching/specific/amse/'>AMSE Course</a> at FAU.</p>
                </small>
            </div>
            <div class='col-sm-6 d-sm-block d-none text-center'>
                <img class='main-img' src='assets/images/fau.png' alt='CrimeView Logo'>
            </div>
        </div>
        <hr>
        <div class='row justify-content-between align-items-stretch'>
            <div class='col-lg-6'>
                <h3>Submit route here</h3>
                <small>
                    <p>After a valid input, we'll display a map of your route and mark the counties on the way based on their current crime rate (CR).</p>
                    <p>Last years CR of a county = <strong> Commited crimes / Population</strong>.</p>
                </small>
                <form action="#" id="inputForm">
                    <div class="form-group">
                        <input id='inputFrom' name='to' type="text" placeholder='Departure e.g. Regensburg'>
                    </div>
                    <div class="form-group">
                        <input id='inputTo' type="text" name='from' placeholder='Destination e.g. Erlangen'>
                    </div>
                    <button onclick='this.blur();' type='submit' id='btnSubmit' class='btn btn-dark'>Submit route</button>
                </form>
                <div class='container-cards'></div>
            </div>
            <div class='container-right col-lg-6'>
                <div id='container-spinner'>
                    <div class='d-flex justify-content-center'>
                        <div class='spinner-border text-dark' role='status' style='width: 4rem; height: 4rem;'>
                            <span class='sr-only'>Loading...</span>
                        </div>
                    </div>
                    <p>Loading route data...</p>
                </div>
                <div id='osm-map'></div>
                <div id='container-status-fail'>
                    <img src='assets/images/warning.svg' alt=''>
                    <p>Something went wrong. <br>
                        Please try again later with a valid input.</p>
                </div>
            </div>
        </div>
    </div>

    <script type='text/javascript'>
        initializeAlgoliaInputs(['inputFrom', 'inputTo']);

        $('#inputForm').submit(function(e) {
            e.preventDefault();
            showSearch();

            fetch('/routeData' + '?from=' + $('#inputFrom').val() + '&to=' + $('#inputTo').val())
                .then(data => {
                    if (data.status != 200) {
                        return showFail();
                    }

                    data.json().then(json => {
                        initializeLeafletMap(json.from.city.lat, json.from.city.lon, json.to.city.lat, json.to.city.lon);

                        appendRouteInformationCard('container-right', json);
                        appendPlaceholderCard('container-cards');

                        json.counties.forEach(county => {
                            let card_id = makeid(5);
                            addCountyBorders(county, card_id);
                            appendCountyCard('container-cards', county, card_id);
                        });

                        showSuccess();
                        document.getElementById('osm-map').scrollIntoView(true);
                    })
                });
        });

        function showSuccess() {
            $('#container-spinner, #container-status-fail').hide();
            $('#btnSubmit').attr('disabled', false);
            $('#osm-map').show();

            map.invalidateSize();
            map.fitBounds(polyline.getBounds());
        }

        function showFail() {
            $('#btnSubmit').attr('disabled', false);
            $('#container-spinner, #osm-map').hide();
            $('#container-status-fail').show();
            $('.card').remove();
        }

        function showSearch() {
            $('#container-status-fail, #osm-map').hide();
            $('#btnSubmit').attr('disabled', true);
            $('#container-spinner').show();
            $('.card').remove();
        }
    </script>
</body>

</html>
