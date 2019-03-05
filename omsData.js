(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    //tableau.log("starting");

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "courseid",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "difficulty",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rating",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "workload",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "department",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "reviewCount",
            dataType: tableau.dataTypeEnum.string
        }
    
        ];

        var tableSchema = {
            id: "omscentraldata",
            alias: "class reviews",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
    

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://raw.githubusercontent.com/martzcodes/OMSCentral/master/data/courses-base.json", function(resp) {
            var feat = resp.courses,
                tableData = [];
 
            // Iterate over the JSON object
            for (var key in feat) {

                //not all courses have reviews
                if (feat[key].hasOwnProperty('reviews')) {
                    var reviewCount = Object.keys(feat[key].reviews).length
                  } else reviewCount = 0
           
                tableData.push({
                    "courseid": feat[key].number,
                    "difficulty": feat[key].average.difficulty,
                    "rating": feat[key].average.rating,
                    "workload": feat[key].average.workload,
                    "department": feat[key].department,
                    "name": feat[key].name,
                    "reviewCount": reviewCount

            });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "omscentral data connector"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
