new DataTable('#openOrdersTable', {
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
    info: false,
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
});

new DataTable('#closedOrdersTable', {
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
    info: false,
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
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
    info: false,
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
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
    info: false,
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
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
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
});

new DataTable('#addProductTable', {
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
    language: {
        url: '//cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json',
    },
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
                    total_due_str = "₡" + total_due
                    detailsString += "Total" + '.'.repeat(block_size - (5 + total_due_str.toString().length)) + total_due_str + '<br>';
                    detailsString = detailsString.replaceAll(" ", "&nbsp;")
                    document.getElementById('orderDetails').innerHTML = detailsString;
                    document.getElementById('total_amount').value = total_due;
            },
            "error" : function(response, error)
            {
                console.log("ERROR: " + JSON.stringify(response));
            }
        });

        modal.show();
    }
})

addEventListener("input", (e) => {
    if(e.target.tagName=="INPUT" && e.target.id=="pay_amount"){
        var total_due = parseInt(document.getElementById('total_amount').value);
        var pay_amount = parseInt(document.getElementById("pay_amount").value);
        var pay_return = document.getElementById("pay_return");
        if (pay_amount > total_due){
            pay_return.value = pay_amount - total_due;
        } else {
            pay_return.value = 0;
        };
    }
});

function showHideRows() {
    var paymentMethod = document.getElementById("paymentMethod");
    var pay_amount_row = document.getElementById("pay_amount_row");
    var pay_return_row = document.getElementById("pay_return_row");
    if (paymentMethod.value == "Efectivo") {
        pay_amount_row.style.display = "";
        pay_return_row.style.display = "";
    } else {
        pay_amount_row.style.display = "none";
        pay_return_row.style.display = "none";
    }
}

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
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
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

const cervezaSalesCanvas = document.getElementById('cervezaSales').getContext('2d');
var datasets = new Array();

Object.keys(cervezaDataset).forEach(key => {
    datasets.push({
        backgroundColor: getRandomColor(),
        label: key,
        data: cervezaDataset[key]
    })
});

// Render the chart
const cervezaSalesChart = new Chart(cervezaSalesCanvas, {
    type: 'bar',
    data: {
        labels: Array.from(cervezaLabels),
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