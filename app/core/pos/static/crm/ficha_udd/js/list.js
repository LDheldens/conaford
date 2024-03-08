function getData() {
    $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: pathname,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {
                'action': 'search'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "primer_titular"},
            {"data": "num_titulares"},
            {"data": "cel_wsp"},
            {"data": "direccion_fiscal"},
            {"data":null},
            // {"data":null},
        ],        
        columnDefs: [
            {
                targets: 4,
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var dropdownMenu = '<div class="dropdown">';
                    dropdownMenu += '<button class="btn-list-fichas dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>';

                    dropdownMenu += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';

                    dropdownMenu += '<a class="dropdown-item" href="/pos/crm/acta/update/' + row.id + '/"><i class="fas fa-edit text-warning"></i> Editar</a>';

                    dropdownMenu += '<a class="dropdown-item" href="/pos/crm/acta/delete/' + row.id + '/"><i class="fas fa-trash-alt text-danger"></i> Eliminar</a>';

                    dropdownMenu += '<a href="/pos/crm/ficha/login" class="dropdown-item" data-id="' + row.id + '" onclick="mostrarTitulares(' + row.id + ')"><i class="fas fa-plus-circle text-primary"></i> Generar Matrix</a>';

                    dropdownMenu += '</div></div>';

                    return dropdownMenu;
                }
            }
        ],
        initComplete: function (settings, json) {

        }
    });
}

$(function () {
    getData();
});