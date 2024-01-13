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

// var collapsedGroups = {};

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
            "success" : function(data) {              
                    var orderDetails= JSON.stringify(data);
                    console.log(orderDetails)
                    $('#orderDetails').text(orderDetails);
            },
            "error" : function(response, error)
            {
                console.log("ERROR: " + JSON.stringify(response));
            }
        });
        
        modal.show();
    }
})