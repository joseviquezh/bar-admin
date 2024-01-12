new DataTable('#ordersTable', {
    paging: false,
    scrollCollapse: true,
    ordering: false,
    searching: true,
    "columns": [
        null,
        null,
        null,
        { "width": "1%" },
        { "width": "1%" }
    ],
    fixedColumns: true,
    scrollY: 300
});

new DataTable('#inventoryTable', {
    paging: false,
    scrollCollapse: true,
    ordering: true,
    order: [[0, 'asc'], [1, 'asc']],
    searching: true,
    fixedColumns: true,
    scrollY: 300
});

var products_table = {
    searching: true,
    ordering: true,
    order: [[0, 'asc'], [1, 'asc']],
    paging: false,
    scrollY: 300
}

new DataTable('#createOrderTable', products_table);

new DataTable('#addProductTable', products_table);

new DataTable('#updateInventoryTable', products_table);


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