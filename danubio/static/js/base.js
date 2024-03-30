new DataTable('#ordersTable', {
    paging: false,
    scrollCollapse: true,
    ordering: false,
    searching: true,
    "columns": [
        null,
        null,
        { "width": "1%" },
        { "width": "1%" }
    ],
    fixedColumns: true,
    scrollY: 300,
});


var inventoryTable = new DataTable('#inventoryTable', {
    paging: false,
    scrollCollapse: true,
    ordering: true,
    order: [[0, 'asc'], [1, 'asc']],
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
    ]
});

$("#inventoryTable tbody").on('click', 'tr.group-start', function () {
    var name = $(this).data('name');
    collapsedGroups[name] = !collapsedGroups[name];
    inventoryTable.draw();
});

var products_table = {
    searching: true,
    ordering: true,
    order: [[0, 'asc'], [1, 'asc']],
    paging: false,
    scrollY: 300,
    rowGroup: {
        dataSrc: [0],

        // startRender: function (rows, group) {
        //     var not_collapsed = !!collapsedGroups[group];

        //     // Swap this to show the group expanded
        //     rows.nodes().each(function (r) {
        //         r.style.display = not_collapsed ? '' : 'none';
        //     });

        //     // Add category name to the <tr>. NOTE: Hardcoded colspan
        //     return $('<tr/>')
        //         .append('<td colspan="8">' + group + ' (' + rows.count() + ')</td>')
        //         .attr('data-name', group)
        //         .toggleClass('collapsed', not_collapsed);
        // }
    },
    columnDefs: [
        {
            targets: [0],
            visible: false
        }
    ]
}

var createOrderTable = new DataTable('#createOrderTable', products_table);
// $("#createOrderTable tbody").on('click', 'tr.group-start', function () {
//     var name = $(this).data('name');
//     collapsedGroups[name] = !collapsedGroups[name];
//     createOrderTable.draw();
// });
createOrderTable.on( 'draw', function () {
    console.log( 'Table redrawn' );
} );

var addProductTable = new DataTable('#addProductTable', products_table);
// $("#addProductTable tbody").on('click', 'tr.group-start', function () {
//     var name = $(this).data('name');
//     collapsedGroups[name] = !collapsedGroups[name];
//     addProductTable.draw();
// });

var updateInventoryTable = new DataTable('#updateInventoryTable', products_table);
// $("#updateInventoryTable tbody").on('click', 'tr.group-start', function () {
//     var name = $(this).data('name');
//     collapsedGroups[name] = !collapsedGroups[name];
//     updateInventoryTable.draw();
// });

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
  var datasets = new Array();
  backgroundColors = new Array();
  
  for (let i = 0; i < 6; i++) {
    random_color = getRandomColor();
    backgroundColors.push(random_color)
  }
  
  // Render the chart
  const averageSalesChart = new Chart(averageSalesCanvas, {
    type: 'bar',
      data: {
          labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
          datasets: [{
            label: "Ganancia Promedio",
            backgroundColor: backgroundColors,
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
    },
    
    //   type: 'line',
    //   data: {
    //       labels: Array.from(averageLabels),
    //       datasets: datasets,
    //   },
    //   options: {
    //       responsive: true,
    //       interaction: {
    //           mode: 'index',
    //           intersect: false,
    //       },
    //       stacked: false,
    //       elements: {
    //           line: {
    //               tension: 0
    //           }
    //       }
    //   },
  });

const productSalesCanvas = document.getElementById('productSales').getContext('2d');
var datasets = new Array();

Object.keys(productData).forEach(key => {
    datasets.push({
        backgroundColor: 'transparent',
        borderColor: getRandomColor(),
        label: key,
        data: productData[key]
    })
});

// Render the chart
const productSalesChart = new Chart(productSalesCanvas, {
    type: 'line',
    data: {
        labels: Array.from(productLabels),
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