new DataTable('#ordersTable', {
    paging: false,
    scrollCollapse: true,
    ordering: true,
    searching: true,
    "columns": [
        null,
        null,
        { "width": "15%" },
    ],
    fixedColumns: true,
    scrollY: 300,
    info: false
});


new DataTable('#inventoryTable', {
    paging: false,
    scrollCollapse: true,
    order: [[0, 'asc'], [1, 'asc']],
    ordering: true,
    searching: true,
    fixedColumns: true,
    scrollY: 300,
    rowGroup: {
        dataSrc: [0],
    },
    columnDefs: [
        {
            targets: [0],
            visible: false
        }
    ],
    info: false
});

new DataTable('#createOrderTable', {
    paging: false,
    scrollCollapse: true,
    order: [[0, 'asc'], [1, 'asc']],
    ordering: true,
    searching: true,
    fixedColumns: true,
    scrollY: 300,
    rowGroup: {
        dataSrc: [0],
    },
    columnDefs: [
        {
            targets: [0],
            visible: false
        }
    ],
    info: false
});

new DataTable('#updateInventoryTable', {
    paging: false,
    scrollCollapse: true,
    order: [[0, 'asc'], [1, 'asc']],
    ordering: true,
    searching: true,
    fixedColumns: true,
    scrollY: 300,
    rowGroup: {
        dataSrc: [0],
    },
    columnDefs: [
        {
            targets: [0],
            visible: false
        }
    ],
    info: false,
});

document.addEventListener('click', function(e){
    if(e.target.tagName=="BUTTON" && e.target.id=="addProductButton"){
        modal = new bootstrap.Modal(document.getElementById('addProduct'), {keyboard: false})

        var orderId = e.target.getAttribute('data-order-id');
        $('#addProductOrderId').val(orderId);
        modal.show();
    }
})

document.addEventListener('click', function(e){
    if(e.target.tagName=="BUTTON" && e.target.id=="payButton"){
        modal = new bootstrap.Modal(document.getElementById('closeOrder'), {keyboard: false})

        var orderId = e.target.getAttribute('data-order-id');
        var detailUrl = e.target.getAttribute('data-detail-url');

        $('#closeOrderOrderId').val(orderId);

        $.ajax({
            "url" : detailUrl,
            "type" : "GET",
            "success" : function(orderDetails) {
                    var block_size = 40;
                    var total_due = 0;
                    var detailsString = "Cant Producto" + " ".repeat(22) + "Monto<br>";
                    detailsString += '='.repeat(block_size) + '<br>';
                    Object.keys(orderDetails).forEach(function(key) {
                        var value = orderDetails[key];
                        var total = value["total_due"].toString();
                        var total_string = "₡" + total;
                        var quantity = value["quantity"].toString();
                        var items = quantity + " ".repeat((5 - quantity.length)) + key;
                        detailsString += items + '.'.repeat(block_size - (items.length + total_string.length)) + total_string + '<br>';
                        total_due += parseInt(total);
                    });
                    detailsString += '-'.repeat(block_size) + '<br>';
                    total_due = "₡" + total_due
                    detailsString += "Total" + '.'.repeat(block_size - (5 + total_due.toString().length)) + total_due + '<br>';
                    detailsString = detailsString.replaceAll(" ", "&nbsp;")
                    document.getElementById('orderDetails').innerHTML = detailsString;
            },
            "error" : function(response, error)
            {
                console.log("ERROR: " + JSON.stringify(response));
            }
        });

        modal.show();
    }
})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const averageSalesCanvas = document.getElementById('averageSales').getContext('2d');

// Render the chart
const averageSalesChart = new Chart(averageSalesCanvas, {
    type: 'bar',
    data: {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Sunday"],
        datasets: [{
            label: "Ganancia Promedio",
            backgroundColor: getRandomColor(),
            data: averageData
        }]
    },
    options: {
        scales: {
            y: {
                ticks: {
                stepSize: 1
                },
                beginAtZero: true,
            }
            }
    }
});

const dailySalesCanvas = document.getElementById('dailySales').getContext('2d');
var datasets = new Array();

Object.keys(dailyData).forEach(key => {
    datasets.push({
        backgroundColor: 'transparent',
        borderColor: getRandomColor(),
        label: "Venta del día",
        data: dailyData[key]
    })
});

dailyLabels.sort()

// Render the chart
const dailySalesChart = new Chart(dailySalesCanvas, {
    type: 'line',
    data: {
        labels: Array.from(dailyLabels),
        datasets: datasets,
    },
    options: {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        elements: {
            line: {
                tension: 0
            }
        }
    },
});

const licorSalesCanvas = document.getElementById('licorSales').getContext('2d');
var datasets = new Array();

Object.keys(licorDataset).forEach(key => {
    datasets.push({
        backgroundColor: getRandomColor(),
        label: key,
        data: licorDataset[key]
    })
});

// Render the chart
const licorSalesChart = new Chart(licorSalesCanvas, {
    type: 'bar',
    data: {
        labels: Array.from(licorLabels),
        datasets: datasets,
    },
    options: {
        scales: {
            y: {
                ticks: {
                stepSize: 1
                },
                beginAtZero: true,
            }
        }
    }
});

const bocaSalesCanvas = document.getElementById('bocaSales').getContext('2d');
var datasets = new Array();

Object.keys(bocasDataset).forEach(key => {
    datasets.push({
        backgroundColor: getRandomColor(),
        label: key,
        data: bocasDataset[key]
    })
});

// Render the chart
const bocaSalesChart = new Chart(bocaSalesCanvas, {
    type: 'bar',
    data: {
        labels: Array.from(bocasLabels),
        datasets: datasets,
    },
    options: {
        scales: {
            y: {
                ticks: {
                stepSize: 1
                },
                beginAtZero: true,
            }
        }
    }
});