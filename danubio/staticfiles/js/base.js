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
});

new DataTable('#inventoryTable', {
    paging: false,
    scrollCollapse: true,
    ordering: false,
    searching: true,
    fixedColumns: true,
});


new DataTable('#productsTable', {
    searching: true,
    ordering: false,
    paging: false,
});

var myModal = new bootstrap.Modal(document.getElementById('addProduct'), {keyboard: false})

document.addEventListener('click', function(e){
    if(e.target.tagName=="BUTTON" && event.target.id=="addProductButton"){
        var orderId = event.target.getAttribute('data-order-id');
        $('#orderId').val(orderId);
        myModal.show();
    }
})

document.addEventListener('click', function(e){
    if(e.target.tagName=="BUTTON" && event.target.id=="payButton"){
        var orderId = event.target.getAttribute('data-order-id');
        var closeOrderUrl = event.target.getAttribute('data-close-order-url');

        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', closeOrderUrl);
        form.style.display = 'hidden';

        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "orderId");
        input.setAttribute("id", "orderId");
        input.setAttribute("value", orderId);


        form.appendChild(input)
        document.body.appendChild(form);

        form.submit();
    }
})