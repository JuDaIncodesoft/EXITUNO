function busca_producto() {
    $("#tabla_articulos > tbody:last").children().remove();
    $("#nro_of_iso").val('');

    producto = $("#pro").val();

    $(document).ready(function () {
        $("#modal_tabla_productos").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        $.ajax({
            beforeSend: function () {
                $("#lista_producto").html("Cargando...");
            },
            url: 'prueba2.php',
            type: 'POST',
            data: { producto: producto.toUpperCase() },
            success: function (x) {
                $("#lista_producto").html(x);
                $('#tabla_pro').DataTable();
                //$('#clie').val('');
            },
            error: function (jqXHR, estado, error) {
                $("#lista_producto").html('Hubo un error: ' + estado + ' ' + error);
            }
        });
    })
}

function char2() {
    $.ajax({
        beforeSend: function () {
            $("#data_cc").html("Recuperando proveedores...");
        },
        url: "listar_of_ca2.php",
        dataType: 'json',
        type: "POST",
        data: null,
        success: function (x) {
            cajas_cerraras = x[0].PLANIFICADAS
            cajas_abiertas = x[0].PROCESO
            cajas_cerra = x[0].CERRADA
            cajas_totales = x[0].OF_TOTALES
            var total = cajas_totales; // La suma de los valores en los datos
            var value = parseFloat(cajas_abiertas / cajas_totales * 100).toFixed(2);
            var ctx = $('#myDoughnutChart2')[0].getContext('2d');
            var myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Planificada', 'Proceso', 'Cerrada'],
                    datasets: [{
                        data: [value, 100 - value], // El primer segmento tendrá el valor actual
                        backgroundColor: [
                            'rgba(243, 171, 47)',
                            'rgba(60, 177, 45)',
                            'rgba(235, 26, 26)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Oculta la leyenda
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    if (tooltipItem.label === 'Planificada') {
                                        return 'Planificada: ' + tooltipItem.raw;
                                    } else if (tooltipItem.label === 'Proceso') {
                                        return 'Proceso: ' + tooltipItem.raw;
                                    } else if (tooltipItem.label === 'Cerrada') {
                                        return 'Cerrada: ' + tooltipItem.raw;
                                    }
                                    return tooltipItem.label + ': ' + tooltipItem.raw;
                                }
                            }
                        }
                    },
                    onClick: function (event, elements) {
                        // Evita que se cambie el valor por clic en el gráfico
                    }
                }
            });

            function updateChart(value) {
                myDoughnutChart.data.datasets[0].data[0] = parseFloat(cajas_cerraras).toFixed(2);
                myDoughnutChart.data.datasets[0].data[1] = parseFloat(cajas_abiertas).toFixed(2);
                myDoughnutChart.data.datasets[0].data[2] = parseFloat(cajas_cerra).toFixed(2);
                myDoughnutChart.update();
                $("#chartValueContainer2").text(cajas_abiertas);
            }
            // Generar leyenda manualmente
            function generateLegend(chart) {
                var text = [];
                chart.data.labels.forEach(function (label, index) {
                    text.push('<div class="legend-item"><div class="legend-color-box" style="background-color:' + chart.data.datasets[0].backgroundColor[index] + '"></div>' + label + '</div>');
                });
                return text.join('');
            }

            $("#chartLegend").html(generateLegend(myDoughnutChart));
            updateChart(cajas_abiertas);

        },
        error: function (jqXHR, estado, error) { },
    });
}


function busca_pro_iso(producto, id) {
    //producto = $("#nro_of_iso").val();


    $.ajax({
        beforeSend: function (x) {

        },
        url: 'busca_datos_iso.php',
        type: 'POST',
        data: { producto, id },
        success: function (x) {
            var client = x;
            //var cant = 1;
            var idcl = client.split("|");
            $("#idproducto").val(idcl[5]);
            $("#descripcion_pro").val(idcl[1]);
            $("#unidadM").val(idcl[2]);
            $("#nro_of_iso").val(idcl[3]);
            $("#cant_planificada").val(idcl[4]);
            $("#cant_merma").val(0);
            //llena_detalle(producto, id);
            llena_detalle_elementos(producto, id);
            $('#btn_guardar').show();
            $("#modal_tabla_productos").modal('hide');
            $('#btn_añadir_pro').show();

            $("#fecha_op").val(idcl[6]);

            setTimeout(() => {
                cargar_automatico_stock()
            }, 1000);
        },
        error: function (jqXHR, estado, error) {

        }
    });
}




function dar_de_baja(docentry) {

    swal({
        title: "Anular Emision",
        text: "Desea Anularlo?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                dar_de_baja_emision(docentry)
            } else {
                swal("Cancelado");
            }
        });
}




function dar_baja_recibo(docentry) {

    swal({
        title: "Anular Recibo",
        text: "Desea Anularlo?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                dar_baja_recibo_new(docentry)
            } else {
                swal("Cancelado");
            }
        });
}



function dar_baja_recibo_new(docentry) {

    $.ajax({
        beforeSend: function () {

        },
        url: 'anular_recibo.php',
        type: 'POST',
        data: { docentry: docentry },
        success: function (x) {
            lista_recibo_prod();

        },
        error: function (jqXHR, estado, error) {

        }
    });

}





function dar_de_baja_emision(docentry) {

    $.ajax({
        beforeSend: function () {

        },
        url: 'anular_emision.php',
        type: 'POST',
        data: { docentry: docentry },
        success: function (x) {
            lista_of_entrega();

        },
        error: function (jqXHR, estado, error) {

        }
    });

}

function dar_baja_of_elemento(docentry, elemento, nro_is) {

    $.ajax({
        beforeSend: function () {

        },
        url: 'anular_elemento_of.php',
        type: 'POST',
        data: { docentry, elemento, nro_is },
        success: function (x) {
            lista_of_reg();

        },
        error: function (jqXHR, estado, error) {

        }
    });

}

function llena_detalle_elementos(producto, id) {
    //console.log(producto);
    $.ajax({
        beforeSend: function (x) {

        },
        url: 'pone_datos_det_elementos.php',
        dataType: 'json',
        type: 'POST',
        data: { producto, id },
        success: function (data) {
            console.log(data); //console.log(data[0]);
            if (data == 0) {
                var n = noty({
                    text: "No existe el articulo...!",
                    theme: 'relax',
                    layout: 'center',
                    type: 'error',
                    timeout: 2000,
                });
            } else {

                for (let i = 0; i < data.length; i++) {
                    fil = ultimo_valor_fila()
                    if (fil === 0) {

                        $("#tabla_articulos > tbody > tr > td").remove();
                    }
                    var num = ultimo_valor_fila() + 1;


                    precio = 1;
                    // precio = parseFloat(data[i].precio).toFixed(4);
                    precio_igv = precio * 1.18;
                    precioigv_parse = parseFloat(precio_igv).toFixed(4);
                    li = parseFloat(num - 1).toFixed(0);

                    tipoMo = data[i].TIPO;

                    if (tipoMo === 'EL') {
                        ele = 'ELE' + data[i].CODIGO_ELEMENTO;
                    } else {
                        ele = 'MO' + data[i].CODIGO_ELEMENTO;
                    }



                    $("#tabla_articulos > tbody").append("<tr><td   class='center'>" + num + "</td>" +
                        "<td style='text-align:center'> <select class='form-control' onchange='' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='proceso'><option value='" + ele + "' SELECTED>" + ele + "</option></select></td>" +
                        "<td class='center'>" + data[i].CODIGO_ELEMENTO + "</td>" +
                        "<td style='center'>" + data[i].DESCRIPCION + "</td>" +
                        "<td style='center'>" + data[i].TIPO + "</td>" +


                        "<td style='text-align:center'><input type='text'  class='form-control pull-right teclado-numerico' id='cantidad_base'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='1' onchange='calcular_total_item(this," + li + ")' onkeyup='calcular_total_item(this," + li + ")' onkeypress='return validar_numero(event)' onselectstart='return false;' oncontextmenu='return false;'></td>" +

                        "<td style='text-align:center'><input type='text'  class='form-control pull-right' id='cantidad_item'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='" + precio + "'  onkeypress='return validar_numero(event)' onselectstart='return false;' oncontextmenu='return false;'></td>" +


                        "<td style='text-align:center' onchange=''><select class='form-control' onchange='carga_stock(this," + li + ");' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='almacen_detalle'><option value=''>ELIJA.</option><option value='ALM01' SELECTED>ALMACEN PRINCIPAL</option><option value='ALM02'>ALMACEN ALMACEN DE IMPORTACION</option><option value='ALM03' >ALMACEN DE CONVERSION</option><option value='ALM04' >ALMACEN DE SISA</option><option value='ALM05'>ALMACEN PRINTS</option><option value='ALM06' >ALMACEN DE LUCUMOS</option><option value='ALM07' >ALMACEN DE LIFEWIZE</option><option value='ALM08' >ALMACEN PRODUCTO TERMINADO</option><option value='ALM09' >ALMACEN DE CALIDAD</option><option value='ALM10' >ALMACEN DE PRODUCCION</option><option value='ALM11'>ALMACEN DE PRE PRENSA</option><option value='ALM12' >ALMACEN DE CORTE</option><option value='ALM13' >ALMACEN DE IMPRESION</option><option value='ALM14'>ALMACEN DE TROQUELADO</option><option value='ALM15' >ALMACEN DE PEGADO</option><option value='ALM16' >ALMACEN DE FORMADO</option><option value='ALM17' >ALMACEN DE TERMOFORMADO</option><option value='ALM18' >ALMACEN DE SELLADO</option><option value='ALM19' >ALMACEN DE MANUALIDADES</option><option value='ALM20' >ALMACEN DE EMBALAJE</option>option value='ALM21' >ALMACEN DE DESECHOS</option></select></td>" +

                        "<td style='text-align:center'><input type='number'  class='form-control pull-right' value ='0' id='cant_stock'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' disabled></td>" +

                        "<td style='display:none'>" + data[i].BASEENTRY_VALIDACION + "</td>" +
                        "<td style='display:none'>" + data[i].id_validacion + "</td>" +
                        "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
                    );

                    $("#btn-procesa").prop("disabled", false);
                    $('#cantidad_base').focus();
                    carga_datos();

                    //listar_almacen2();

                }


            }

        },
        error: function (jqXHR, estado, error) {

        }
    });

}


function validar_numero(event) {
    //console.log(event);
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        alertify.error('No puede ingresar letras');
        return false;
    }
    return true;
}


function llena_detalle(producto, id) {
    //console.log(producto);
    $.ajax({
        beforeSend: function (x) {

        },
        url: 'pone_datos_det.php',
        dataType: 'json',
        type: 'POST',
        data: { producto, id },
        success: function (data) {
            console.log(data); //console.log(data[0]);
            if (data == 0) {
                var n = noty({
                    text: "No existe el articulo...!",
                    theme: 'relax',
                    layout: 'center',
                    type: 'error',
                    timeout: 2000,
                });
            } else {

                for (let i = 0; i < data.length; i++) {
                    fil = ultimo_valor_fila()
                    if (fil === 0) {

                        $("#tabla_articulos > tbody > tr > td").remove();
                    }
                    var num = ultimo_valor_fila() + 1;


                    precio = 1;
                    // precio = parseFloat(data[i].precio).toFixed(4);
                    precio_igv = precio * 1.18;
                    precioigv_parse = parseFloat(precio_igv).toFixed(4);
                    li = parseFloat(num - 1).toFixed(0);


                    $("#tabla_articulos > tbody").append("<tr><td   class='center'>" + num + "</td>" +
                        "<td style='text-align:center'> <select class='form-control' onchange='' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='proceso'><option value='' >ELIJA.</option><option value='1' SELECTED>CONVERTIDORA</option><option value='2' >GUILLOTINA</option><option value='3' >IMPRESION</option><option value='4'>TROQUELADO Y DESGLOSE</option><option value='5' >PEGADO</option><option value='6' >EMBALAJE</option><option value='7' >FORMADO</option></select></td>" +


                        "<td class='center'>" + data[i].codmatS + "</td>" +
                        "<td style='center'>" + data[i].DesLarga + "</td>" +
                        "<td style='center'>" + data[i].Tipos + "</td>" +


                        "<td style='text-align:center'><input type='number'  class='form-control pull-right' id='cantidad_base'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='1' onchange='calcular_total_item(this," + li + ")' onkeyup='calcular_total_item(this," + li + ");' ></td>" +

                        "<td style='text-align:center'><input type='number'  class='form-control pull-right' id='cantidad_item'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='" + precio + "' ></td>" +


                        "<td style='text-align:center' onchange=''><select class='form-control' onchange='carga_stock(this," + li + ");' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='almacen_detalle'><option value='' SELECTED>ELIJA.</option><option value='ALM01' >ALMACEN PRINCIPAL</option><option value='ALM02'>ALMACEN SAGITARIO</option><option value='ALM03' >ALMACEN PRINTS</option><option value='ALM04' >ALMACEN DE IMPORTACION</option><option value='ALM05'>ALMACEN DE CUARENTENA</option><option value='ALM06'  >ALMACEN DE PRODUCCION</option><option value='ALM07' >ALMACEN DE PRE PRENSA</option><option value='ALM08' >ALMACEN DE CORTE</option><option value='ALM09' >ALMACEN DE IMPRESION</option><option value='ALM10' >ALMACEN DE TROQUELADO</option><option value='ALM11'>ALMACEN DE PEGADO</option><option value='ALM12' >ALMACEN DE FORMADO</option><option value='ALM13' >ALMACEN DE TERMOFORMADO</option><option value='ALM14'>ALMACEN DE SELLADO</option><option value='ALM15' >ALMACEN DE MANUALIDADES</option><option value='ALM16' >ALMACEN DE EMBALAJE</option><option value='ALM17' >ALMACEN DE PRODUCTO TERMINADO</option><option value='ALM18' >ALMACEN DE PT EXTERNO</option><option value='ALM19' >ALMACEN DE PT INMOBILIZADO</option><option value='ALM20' >ALMACEN DE TRANSITO</option></select></td>" +

                        "<td style='text-align:center'><input type='number'  class='form-control pull-right' value ='' id='cant_stock'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' disabled></td>" +

                        "<td style='display:none'>" + data[i].docentry + "</td>" +
                        "<td style='display:none'>" + data[i].id_validacion + "</td>" +
                        "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
                    );

                    $("#btn-procesa").prop("disabled", false);
                    $('#cantidad_base').focus();
                    carga_datos();

                    //listar_almacen2();

                }


            }

        },
        error: function (jqXHR, estado, error) {

        }
    });

}


function pone_producto(elid) {
    var client = elid;
    var cant = 1;
    var idcl = client.split("|");
    $("#idproducto").val(idcl[0]);
    $("#descripcion_pro").val(idcl[1]);
    $("#unidadM").val(idcl[2]);
    $("#cant_planificada").val(cant);


    $("#modal_tabla_productos").modal('hide');


}



function añadir_articulo() {
    $("#modal_busqueda_arts").modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    $('#modal_busqueda_arts').on('shown.bs.modal', function () {
        $("#lista_articulos").html("");
        $("#articulo_buscar").val("");
        $("#articulo_buscar").focus();
    });
    //lista_marca();
}

function busca() {
    data_buscar = $("#articulo_buscar").val();
    var data = data_buscar.split("//");

    if (data_buscar === '') {
        datasupcatname = ''
        data_descripcion = ''
    }

    if (data.length == 1) {
        datasupcatname = data[0]
        data_descripcion = ''
    }
    if (data.length == 2) {
        datasupcatname = data[0]
        data_descripcion = data[1]
    }

    //console.log(data);
    $.ajax({
        beforeSend: function () {
            $("#lista_articulos").html("");
        },
        url: "prueba3.php",
        type: "POST",
        data: {
            descripcion: data_descripcion,
            supcatname: datasupcatname,
        },
        success: function (x) {
            $("#lista_articulos").html(x);
            $("#tabla_art").DataTable();
        },
        error: function (jqXHR, estado, error) {
            $("#lista_articulos").html(
                "Error en la peticion AJAX..." + estado + "      " + error
            );
        },
    });

}




$(document).on("click", "#tabla_art tbody tr", function () {

    var checkbox = $(this).find("#cotizacion_seg");

    checkbox.prop("checked", !checkbox.prop("checked"));

    actualizarFila(checkbox);

});



function actualizarFila(checkbox) {
    var checkbox2 = $('#tabla_art tbody tr').find("#cotizacion_seg");
    var cant = checkbox2.closest("tr").find("#cotizacion_seg:checked").length;
    //console.log(cant);
    if (checkbox.is(":checked")) {
        checkbox.closest("tr").find("td").css("background-color", "LightGreen");
    } else {
        checkbox.closest("tr").find("td").css("background-color", "white");
    }
    if (cant > 0) {
        $("#enviar").removeClass("disabledTab");
        $("#enviar").addClass("activeTab");


    } else {
        $("#enviar").removeClass("activeTab");
        $("#enviar").addClass("disabledTab");

    }
}

function migrar_sap(docentry, tipo_dc) {
    $.ajax({
        beforeSend: function () { },
        url: "insertar_cola_service_of.php",
        type: "POST",
        data: { docentry: docentry, tipo_doc: tipo_dc, objtype: '202' },
        success: function (x) {
        },
        error: function (jqXHR, estado, error) {
            $("#errores").html("Error... " + estado + "  " + error);
        },
    });
}


$(document).keypress(function (event) {
    if (event.which == 13) {
        var checkbox = $('#tabla_art tbody tr').find("#cotizacion_seg");
        var checkbox2 = $('#tabla_art_mod tbody tr').find("#cotizacion_mod");

        bandera = false;
        if (checkbox.is(":checked")) {
            add_art_add();
            bandera = true;
        }
        if (bandera === false) {
            if (checkbox2.is(":checked")) {
                add_art_mod();
                bandera = true;
            }
        }
    }
});




$(document).keypress(function (event) {
    if (event.which == 13) {
        var checkboxItem = $('#tabla_art_item tbody tr').find("#item_check");

        bandera = false;
        if (checkboxItem.is(":checked")) {
            add_art_add_items();
            bandera = true;
        }

    }
});


function ultimo_valor_fila() {
    //let tableBody = document.getElementById('tabla_articulos_mod'); 
    let line = [];
    $("#tabla_articulos > tbody > tr").each(function () {
        articulos = parseFloat($(this).find("td").eq(0).html());
        line.push(articulos)
        //console.log(articulos);
    });

    line.sort(function (a, b) { return a - b });
    cantidad = line.length
    data = isNaN(line[cantidad - 1]) == true ? 0 : line[cantidad - 1]

    return data;
}




function add_art_add() {
    //alert(art);
    $("#modal_busqueda_arts").modal("toggle");
    let line = [];

    $('#tabla_art input[type="checkbox"]:checked').each(function (e) {
        codigo = $(this).closest("tr").children("td:eq(1)").text();
        line.push(codigo)
    });
    codigo = line.toString();

    $('#codigo').val(codigo);
    // console.log(codigo);
    busca_articulo_add();
    $('#btn_guardar').show();

}


$(function () {
    // Evento que selecciona la fila y la elimina
    $(document).on("click", ".delete", function () {
        var parent = $(this).parents().parents().get(0);
        $(parent).remove();

        // num_filas = document.getElementById("tabla_articulos").rows.length - 1;
        // $i = 1;
        var num_filas = $("#tabla_articulos tbody tr").length;
        for (var i = 0; i < num_filas; i++) {
            $("#tabla_articulos tbody tr").eq(i).find('td:first').text(i + 1);
        }
    });
});


num = 0;
function agregar_defectos() {
    var defecto = $("#defecto_list option:selected").val();
    var nom_defecto = $("#defecto_list option:selected").text().trim();
    var cantidad = $("#cantidad_defecto").val();
    bandera = true;

    if (defecto === 'Seleccione') {
        alertify.error("Seleccione defecto");
        bandera = false;
    }

    if (cantidad === '') {
        alertify.error("Ingrese Cantidad");
        bandera = false;
    }

    if (bandera === true) {
        num++;

        $("#tabla_defectos > tbody").append("<tr><td class='center'>" + num + "</td>" +
            "<td class='center'>" + defecto + "</td>" +
            "<td class='center'>" + nom_defecto + "</td>" +
            "<td style='center'>" + cantidad + "</td>" +

            "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
        );
    }


}




num2 = 0;
function agregar_defectos_pt() {
    var defecto = $("#defecto_list_pt option:selected").val();
    var nom_defecto = $("#defecto_list_pt option:selected").text().trim();
    var cantidad = $("#cantidad_defecto_pt").val();
    bandera = true;

    if (defecto === 'Seleccione') {
        alertify.error("Seleccione defecto");
        bandera = false;
    }

    if (cantidad === '') {
        alertify.error("Ingrese Cantidad");
        bandera = false;
    }

    if (bandera === true) {
        num2++;

        $("#tabla_defectos_pt > tbody").append("<tr><td class='center'>" + num2 + "</td>" +
            "<td class='center'>" + defecto + "</td>" +
            "<td class='center'>" + nom_defecto + "</td>" +
            "<td style='center'>" + cantidad + "</td>" +

            "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
        );
    }


}



function busca_articulo_add() {

    $(document).ready(function () {
        var cod = $("#codigo").val().toString();
        var codigo = $("#codigo").val().toString();
        //console.log(cod);
        //var tipcli = $("#tipocliente_mod").val().trim();
        var cmoneda = $("#lista_cmoneda option:selected").val();
        if (cod.trim() != "") {

            $(document).ready(function () {
                $.ajax({
                    beforeSend: function () {
                        $("#data_articulo").html("Buscando informacion del articulo...");
                    },
                    url: 'prueba4.php',
                    dataType: 'json',
                    type: 'POST',
                    data:
                    {
                        codigo: codigo
                    },
                    success: function (data) {
                        $("#enviar").removeClass("activeTab");
                        $("#enviar").addClass("disabledTab");
                        //console.log(data);


                        if (data == 0) {
                            var n = noty({
                                text: "No existe el articulo...!",
                                theme: 'relax',
                                layout: 'center',
                                type: 'error',
                                timeout: 2000,
                            });
                        } else {

                            for (let i = 0; i < data.length; i++) {
                                fil = ultimo_valor_fila()
                                if (fil === 0) {
                                    // $("#tabla_articulos_mod > tbody > tr > td").remove();
                                    $("#tabla_articulos > tbody > tr > td").remove();
                                }
                                var num = ultimo_valor_fila() + 1;

                                precio = parseFloat(data[i].precio).toFixed(4);
                                precio_igv = precio * 1.18;
                                precioigv_parse = parseFloat(precio_igv).toFixed(4);
                                li = parseFloat(num - 1).toFixed(0);


                                $("#tabla_articulos > tbody").append("<tr><td class='center'>" + num + "</td>" +
                                    "<td style='text-align:center'> <select class='form-control' onchange='' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='proceso'><option value='' >ELIJA.</option><option value='1' SELECTED>CONVERTIDORA</option><option value='2' >GUILLOTINA</option><option value='3'>IMPRESION</option><option value='4'>TROQUELADO Y DESGLOSE</option><option value='5' >PEGADO</option><option value='6' >EMBALAJE</option><option value='7' >FORMADO</option></select></td>" +


                                    "<td class='center'>" + data[i].ItemCode + "</td>" +
                                    "<td style='center'>" + data[i].ItemName + "</td>" +
                                    "<td style='center'>" + data[i].ItmsGrpNam + "</td>" +


                                    "<td style='text-align:center'><input type='number'  class='form-control pull-right' id='cantidad_base'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='1' onchange='calcular_total_item(this," + li + ")' onkeyup='calcular_total_item(this," + li + ");' ></td>" +

                                    "<td style='text-align:center'><input type='number'  class='form-control pull-right' id='cantidad_item'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' value='" + precio + "' ></td>" +


                                    "<td style='text-align:center' onchange='carga_stock(this," + li + ");'><select class='form-control' onchange='' style='width: 100%;font-size:12px;' tabindex='-1' aria-hidden='true'  id='almacen_detalle'><option value='' SELECTED>ELIJA.</option><option value='ALM01' >ALMACEN PRINCIPAL</option><option value='ALM02'>ALMACEN SAGITARIO</option><option value='ALM03' >ALMACEN PRINTS</option><option value='ALM04' >ALMACEN DE IMPORTACION</option><option value='ALM05'>ALMACEN DE CUARENTENA</option><option value='ALM06' >ALMACEN DE PRODUCCION</option><option value='ALM07' >ALMACEN DE PRE PRENSA</option><option value='ALM08' >ALMACEN DE CORTE</option><option value='ALM09' >ALMACEN DE IMPRESION</option><option value='ALM10' >ALMACEN DE TROQUELADO</option><option value='ALM11'>ALMACEN DE PEGADO</option><option value='ALM12'>ALMACEN DE FORMADO</option><option value='ALM13' >ALMACEN DE TERMOFORMADO</option><option value='ALM14'>ALMACEN DE SELLADO</option><option value='ALM15' >ALMACEN DE MANUALIDADES</option><option value='ALM16' >ALMACEN DE EMBALAJE</option><option value='ALM17' >ALMACEN DE PRODUCTO TERMINADO</option><option value='ALM18' >ALMACEN DE PT EXTERNO</option><option value='ALM19' >ALMACEN DE PT INMOBILIZADO</option><option value='ALM20' >ALMACEN DE TRANSITO</option></select></td>" +

                                    "<td style='text-align:center'><input type='number'  class='form-control pull-right' id='cant_stock' value='0.0000'  autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' disabled></td>" +

                                    "<td style='display:none'>" + data[i].DocEntry + "</td>" +
                                    "<td style='display:none'>" + data[i].DocEntry + "</td>" +

                                    "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
                                );

                                $("#btn-procesa").prop("disabled", false);
                                $('#cantidad_base').focus();
                                carga_datos()
                                //listar_almacen2();

                            }
                        }
                    },

                    error: function (jqXHR, estado, error) {
                        // GERSON: AGREGANDO VALIDACION VISUAL - Plugins=>Noty
                        var n = noty({
                            text: "Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!",
                            theme: 'relax',
                            layout: 'center',
                            type: 'error',
                            timeout: 2000,
                        });
                        //            alert("Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!");
                    }
                });
            });
        } else {
        }
    })
}


function carga_stock(input, linea) {

    var fila = obtenerFila3(input);
    codigo = $($("#tabla_articulos").find("tbody > tr")[fila]).children("td")[2].innerHTML;
    almacen = $($("#tabla_articulos").find("tbody > tr")[fila]).children("td")[7].children[0].value;
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#cant_stock").html("Recuperando Lista ...");
            },
            url: 'listar_stock_almacen.php',
            type: 'POST',
            data: { codigo: codigo, almacen: almacen },
            success: function (x) {
                //console.log(x);
                var cod = parseFloat(x).toFixed(4)
                if (isNaN(cod)) cod = 0
                // $("#cant_stock").html(cod);
                $($("#tabla_articulos").find("tbody > tr")[fila]).children("td")[8].children[0].value = cod

                // let celdas2 = document.getElementById("tabla_articulos").rows[fila].cells;
                // celdas2[8].innerHTML = cod;
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}


function carga_stock_2daexplo(input, linea) {
    //console.log("HOLA")
    var fila = obtenerFila3(input);
    codigo = $($("#table_explo2").find("tbody > tr")[fila]).children("td")[2].innerHTML;
    almacen = $($("#table_explo2").find("tbody > tr")[fila]).children("td")[7].children[0].value;
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#cant_stock").html("Recuperando Lista ...");
            },
            url: 'listar_stock_almacen.php',
            type: 'POST',
            data: { codigo: codigo, almacen: almacen },
            success: function (x) {
                //console.log(x);
                var cod = parseFloat(x).toFixed(4)
                if (isNaN(cod)) cod = 0
                // $("#cant_stock_explo2").html(cod);
                $($("#table_explo2").find("tbody > tr")[fila]).children("td")[8].children[0].value = cod

                // let celdas2 = document.getElementById("table_explo2").rows[fila].cells;
                // celdas2[8].innerHTML = cod;
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}



function cargar_automatico_stock() {
    almacen = $('#tabla_articulos > tbody > tr').find("td").find('select[id="almacen_detalle"]').find('option:selected').val();

    $.ajax({
        beforeSend: function () {
            //$("#cant_stock").html("Recuperando Lista ...");
        },
        url: 'listar_alma.php',
        type: 'POST',
        data: { almacen: almacen },
        success: function (x) {
            //console.log(x);
            var cod = parseFloat(x).toFixed(4)
            // $("#cant_stock").html(cod);
            $('#tabla_articulos > tbody > tr').find("td").find('input[id="cant_stock"]').val(cod);

        },
        error: function (jqXHR, estado, error) {
        }
    });

}

function lista_turno() {

    $.ajax({
        beforeSend: function () {
            //$("#list_turno").html("Recuperando Lista ...");
        },
        url: 'consulta_sql_datos_turnos.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#list_turno").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}



function lista_isograf() {

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_isograf.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_isograf").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}





function lista_isograf_2da() {

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_isograf.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_isograf_2da").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}




function lista_isograf_3ra() {

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_isograf.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_isograf_3ra").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}






function lista_maquinaria() {

    $.ajax({
        beforeSend: function () {
            //$("#list_maquinaria").html("Recuperando Lista ...");
        },
        url: 'consulta_sql_datos_maquinaria.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#list_maquinaria").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}




function listar_almacen() {
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#lista_almacen").html("Recuperando Lista ...");
            },
            url: 'lista_almacen_ordenF.php',
            type: 'POST',
            data: null,
            success: function (x) {
                $("#lista_almacen").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });

}



function registrar_reciboP_pt() {
    modal_op_iso = $("#modal_op_iso_pt").val();
    modal_pro = $("#modal_pro_pt").val();
    modal_des = $("#modal_des_pt").val();
    modal_docentry = $("#modal_docentry_pt").val();
    modal_fi = $("#modal_fi_pt").val();
    modal_ff = $("#modal_ff_pt").val();


    bandera2 = true;

    if (bandera2 === true) {

        $.ajax({
            url: "inserta_datos_reciboCab.php",
            type: "POST",
            data: { modal_op_iso: modal_op_iso, modal_pro: modal_pro, modal_des: modal_des, modal_docentry: modal_docentry, modal_fi: modal_fi, modal_ff: modal_ff },
            success: function (x) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso',
                    text: 'El recibo fue registrado.',
                    showConfirmButton: false, // Oculta el botón "Aceptar"
                    timer: 2000
                }).then(function () {
                    // Actualizar la página
                    // location.reload();
                });

                global = parseInt(x);
                console.log(global);
                //aqui comienza el deta
                if (global == 0) {
                    alertify.error("No inserto");
                } else {

                    var unidad_buena = $("#uni_buenas_pt").val();
                    var unidad_mala = $("#uni_malas_pt").val();
                    var almacen = $("#almacen_detalle_pt option:selected").val();
                    var observaciones = $("#uni_observaciones_pt").val();

                    $.ajax({
                        beforeSend: function () { },
                        url: "inserta_datos_reciboDet.php",
                        type: "POST",
                        data:
                            "&modal_op_iso=" +
                            modal_op_iso +
                            "&unidad_buena=" +
                            unidad_buena +
                            "&unidad_mala=" +
                            unidad_mala +
                            "&almacen=" +
                            almacen +
                            "&observaciones=" +
                            observaciones +
                            "&docentry=" +
                            global,
                        success: function (data) {

                            $("#modal_recibo_produc_pt").modal("hide");
                            lista_recibo_prod();



                            $('#tabla_defectos_pt > tbody > tr').each(function () {
                                linea = $(this).find('td').eq(0).html()
                                lina2 = linea;
                                var line = parseInt(linea);

                                var codigo = $(this).find('td').eq(1).html();
                                var nombres = $(this).find('td').eq(2).html();
                                var cantidad = $(this).find('td').eq(3).html();


                                $.ajax({
                                    beforeSend: function () {
                                    },
                                    url: 'inserta_defectos_recibo.php',
                                    type: 'POST',
                                    data: '&line=' + line + '&codigo=' + codigo + '&nombres=' + nombres + '&cantidad=' + cantidad + '&modal_op_iso=' + modal_op_iso + '&global=' + global,
                                    success: function (data) {
                                        $("#tabla_defectos_pt > tbody:last").children().remove();
                                        $("#uni_buenas_pt").val("");
                                        $("#uni_malas_pt").val("");
                                        $("#uni_observaciones_pt").val("");
                                        $("#cantidad_defecto_pt").val("");
                                    },
                                    error: function (jqXHR, estado, error) {
                                        $("#errores").html('Error... ' + estado + '  ' + error);
                                    }
                                });


                            });

                        },

                        error: function (jqXHR, estado, error) {

                        },
                    });




                    migrar_sap(global, 3)
                }
            },
            error: function (jqXHR, estado, error) {

            }
        });
    }

}




// function cargar_defec_stock(id){
//     $.ajax({
//         beforeSend: function () {
//             $("#almacen_detalle2").html("Recuperando Lista ...");
//         },
//         url: 'lista_almacen_ordenF.php',
//         type: 'POST',
//         data: {id },
//         success: function (x) {

//             var cod = parseFloat(x).toFixed(4)

//             $('#tabla_articulos > tbody > tr').find("td").find('input[id="cant_stock2"]').val(cod);
//         },
//         error: function (jqXHR, estado, error) {
//         }
//     });
// }


function listar_almacen2() {
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#almacen_detalle").html("Recuperando Lista ...");
            },
            url: 'lista_almacen_ordenF.php',
            type: 'POST',
            data: null,
            success: function (x) {
                $("#almacen_detalle").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}




function listar_defectos() {
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#defecto_list").html("Cargando ...");
            },
            url: 'lista_defectos.php',
            type: 'POST',
            data: null,
            success: function (x) {
                $("#defecto_list").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}


function obtenerFila3(elemento) {
    var index = $(elemento).closest("tr").index();
    //console.log(index);
    return index;
}


function calcular_total_item(input, linea) {
    var fila = obtenerFila3(input);
    cantidad_base = parseFloat($($("#tabla_articulos").find("tbody > tr")[fila]).children("td")[5].children[0].value);
    cantidad_planificada = parseFloat($("#cant_planificada").val());
    var monto = parseFloat((cantidad_base * cantidad_planificada)).toFixed(4);
    $($("#tabla_articulos").find("tbody > tr")[fila]).children("td")[6].children[0].value = monto
}

function calcular_total_item2da_explo(input, linea, costo) {
    console.log(costo);
    var fila = obtenerFila3(input);
    cantidad_base = parseFloat($($("#table_explo2").find("tbody > tr")[fila]).children("td")[5].children[0].value);
    //cantidad_planificada = parseFloat($("#cant_planificada").val());
    //cantidad_planificada = parseFloat($($("#table_explo2").find("tbody > tr")[fila]).children("td")[6].children[0].value);

    var monto = parseFloat((cantidad_base * costo)).toFixed(4);

    //console.log(monto);
    $($("#table_explo2").find("tbody > tr")[fila]).children("td")[6].children[0].value = monto

    //$('#table_explo2 > tbody > tr').find("td").find('input[id="cantidad_item_explo2"]').val(monto);
}



function carga_datos() {
    cantidad_base = parseFloat($($("#tabla_articulos").find("tbody > tr")).children("td")[5].children[0].value);
    cantidad_planificada = parseFloat($("#cant_planificada").val());

    var monto = parseFloat((cantidad_base * cantidad_planificada)).toFixed(4);

    // $($("#tabla_articulos").find("tbody > tr")).children("td")[6].children[0].value = monto
    $('#tabla_articulos > tbody > tr').find("td").find('input[id="cantidad_item"]').val(monto);
}



function grabar_datos() {

    $(document).ready(function () {

        band = true;

        tipo = $("#lista_tipo option:selected").val().trim();
        estado = $("#lista_estado option:selected").text().trim();
        nro_producto = $("#idproducto").val();
        unidad_medida = $("#unidadM").val();
        descripcion = $("#descripcion_pro").val();
        cant_planificada = $("#cant_planificada").val();
        almacen = $("#lista_almacen option:selected").val().trim();
        fecha_op = $("#fecha_op").val();
        fecha_inicio = $("#fecha_inicio").val();
        fecha_fin = $("#fecha_fin").val();
        nro_of_isograf = $("#nro_of_iso").val();
        cant_merma = $("#cant_merma").val();
        doc_of_padre = 0;
        var proce_inicial = '';
        nueva_cantidad = 0;


        $('#tabla_articulos > tbody > tr').each(function () {
            linea = $(this).find('td').eq(0).html()
            lina2 = linea;
            var line = parseInt(linea);

            var proceso = $(this).find("td").find('select[id="proceso"]').find('option:selected').val();
            var codigo = $(this).find('td').eq(2).html();
            var descripcion = $(this).find('td').eq(3).html();
            var tipo = $(this).find('td').eq(4).html();
            var cant_base = $(this).find("td").find('input[id="cantidad_base"]').val();
            var cant_requerida = $(this).find("td").find('input[id="cantidad_item"]').val();
            var almacen_det = $(this).find("td").find('select[id="almacen_detalle"]').find('option:selected').val();
            var cant_almacen = $(this).find("td").find('input[id="cant_stock"]').val();
            var docentry = $(this).find('td').eq(9).html();

            if (cant_requerida === '' || cant_requerida <= 0) {
                alertify.error('Linea: ' + lina2 + ' ' + 'Falta Cantidad Invalida');
                $(this).find('td').eq(6).css("background-color", "#F67280");
                band = false;
            } else {
                $(this).find('td').eq(6).css("background-color", "white");
            }
            if (almacen_det === '') {
                alertify.error('Linea: ' + lina2 + ' ' + 'Falta Cantidad Invalida');
                $(this).find('td').eq(7).css("background-color", "#F67280");
                band = false;
            } else {
                $(this).find('td').eq(7).css("background-color", "white");
            }

            if ((cant_almacen === '' || cant_almacen <= 0) && tipo !== 'EL' && tipo !== 'MO') {
                alertify.error('Linea: ' + lina2 + ' ' + 'Falta Cantidad Invalida');
                $(this).find('td').eq(8).css("background-color", "#F67280");
                band = false;
            } else {
                $(this).find('td').eq(8).css("background-color", "white");
            }
        });

        if (cant_merma === '') {
            alertify.error('Ingresar Merma');
            band = false;
        }


        if (band === true) {
            $.ajax({
                beforeSend: function () {
                },
                url: 'procesa_of_cab.php',
                type: 'POST',
                data: { tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion, cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial, of_padre: doc_of_padre, proceso: 0, elemento: '-' },
                success: function (x) {
                    global = parseInt(x);
                    console.log(global);
                    //$("#num_tick_act").val(global);
                    $("#comentarios").val("");
                    $("#idproducto").val("");
                    $("#unidadM").val("");
                    $("#descripcion_pro").val("");
                    $("#cant_planificada").val("");
                    $("#nro_of_iso").val('');
                    $("#cant_merma").val('');


                    if (global == 0) {
                        alertify.error("No Inserto");
                    } else {
                        $('#tabla_articulos > tbody > tr').each(function () {
                            linea = $(this).find('td').eq(0).html()
                            lina2 = linea;
                            var line = parseInt(linea);

                            var proceso = $(this).find("td").find('select[id="proceso"]').find('option:selected').val();
                            var codigo = $(this).find('td').eq(2).html();
                            var descripcion = $(this).find('td').eq(3).html();
                            var tipo = $(this).find('td').eq(4).html();
                            var cant_base = $(this).find("td").find('input[id="cantidad_base"]').val();
                            var cant_requerida = $(this).find("td").find('input[id="cantidad_item"]').val();
                            var almacen_det = $(this).find("td").find('select[id="almacen_detalle"]').find('option:selected').val();
                            var cant_almacen = $(this).find("td").find('input[id="cant_stock"]').val();
                            var docentry = $(this).find('td').eq(9).html();
                            var id_validacion = $(this).find('td').eq(10).html();

                            $.ajax({
                                beforeSend: function () {
                                },
                                url: 'procesa_of_det.php',
                                type: 'POST',
                                data: '&line=' + line + '&proceso=' + proceso + '&codigo=' + codigo + '&descripcion=' + descripcion + '&tipo=' + tipo +
                                    '&cant_base=' + cant_base + '&cant_requerida=' + cant_requerida + '&almacen_det=' + almacen_det + '&cant_almacen=' + cant_almacen + '&docentry=' + docentry + '&global=' + global + '&id_validacion=' + id_validacion,
                                success: function (data) {
                                    var n = noty({
                                        text: "Procesando OF...  articulo: " + codigo,
                                        theme: 'relax',
                                        layout: 'topLeft',
                                        type: 'success',
                                        timeout: 2000,
                                    });

                                    $("#tabla_articulos > tbody:last").children().remove();

                                },
                                error: function (jqXHR, estado, error) {
                                    $("#errores").html('Error... ' + estado + '  ' + error);
                                }
                            });
                        });
                        //aca puedo poner para que liste
                        lista_isograf();
                        lista_of_reg();


                    }
                },
                error: function (jqXHR, estado, error) {
                    $("#errores").html('Error... ' + estado + '  ' + error);
                }
            });
        }
    })
}

function buscar_data_stock(value, data) {
    var fila = obtenerFila3(data);
    var codigo = $($("#tabla_detpr").find("tbody > tr")[fila]).children("td")[4].innerText;

    //console.log(codigo);
    $.ajax({
        beforeSend: function () {
            $("#data_stock").html("Recuperando Lista ...");
        },
        url: "consulta_data_stocks.php",
        type: "POST",
        data: { almacen: value, codigo: codigo },
        success: function (x) {
            x2 = parseFloat(x)
            if (isNaN(x2)) x2 = 0
            $($("#tabla_detpr").find("tbody > tr")[fila]).children("td")[12].children[0].value = x2
        },
        error: function (jqXHR, estado, error) { },
    });
}



function buscar_data_stock2(value, data) {
    var fila = obtenerFila3(data);
    var codigo = $($("#tabla_detpr_otros").find("tbody > tr")[fila]).children("td")[4].innerText;

    //console.log(codigo);
    $.ajax({
        beforeSend: function () {
            $("#data_stock").html("Recuperando Lista ...");
        },
        url: "consulta_data_stocks.php",
        type: "POST",
        data: { almacen: value, codigo: codigo },
        success: function (x) {
            x2 = parseFloat(x)
            if (isNaN(x2)) x2 = 0
            $($("#tabla_detpr_otros").find("tbody > tr")[fila]).children("td")[12].children[0].value = x2
        },
        error: function (jqXHR, estado, error) { },
    });
}



function lista_of_reg() {
    fecha_i = $("#fecha_inix").val();
    fecha_f = $("#fecha_finx").val();
    isograf = $("#pone_isograf option:selected").val();
    tipo = $("#filtro_tipo option:selected").val();

    setTimeout(() => {
        $.ajax({
            beforeSend: function () {
                //$("#lista_of_registrados").html("Recuperando Lista ...");
            },
            url: "consulta_listado_of_liberar.php",
            type: "POST",
            data: { fecha_i: fecha_i, fecha_f: fecha_f, isograf: isograf, tipo: tipo },
            success: function (x) {

            },
            error: function (jqXHR, estado, error) { },
        });
        setTimeout(() => {


            $.ajax({
                beforeSend: function () {
                    $("#lista_of_registrados").html("Recuperando Lista ...");
                },
                url: "consulta_listado_of.php",
                type: "POST",
                data: { fecha_i: fecha_i, fecha_f: fecha_f, isograf: isograf, tipo: tipo },
                success: function (x) {
                    $("#lista_of_registrados").html(x);
                    $("#tabla_cot").DataTable({
                        order: [[0, 'desc']]
                    });
                },
                error: function (jqXHR, estado, error) { },
            });

        }, 1000);
    }, 2000);



}



function lista_of_entrega() {
    setTimeout(() => {
        fecha_i = $("#fecha_inix_e").val();
        fecha_f = $("#fecha_finx_f").val();
        isograf = $("#pone_isograf_2da option:selected").val();


        $.ajax({
            beforeSend: function () {
                $("#lista_entrega_mat").html("Recuperando Lista ...");
            },
            url: "consulta_listado_entrega.php",
            type: "POST",
            data: { fecha_i: fecha_i, fecha_f: fecha_f, isograf: isograf },
            success: function (x) {
                $("#lista_entrega_mat").html(x);
                $("#tabla_entrega_d").DataTable({
                    order: [[0, 'asc']]
                });
            },
            error: function (jqXHR, estado, error) { },
        });
    }, 1500);
}


function lista_recibo_prod() {

    setTimeout(() => {
        fecha_i = $("#fecha_inix_rp").val();
        fecha_f = $("#fecha_finx_rp").val();
        isograf = $("#pone_isograf_3ra option:selected").val();
        $.ajax({
            beforeSend: function () {
                $("#lista_recibo_pro").html("Recuperando Lista ...");
            },
            url: "consulta_listado_recibo.php",
            type: "POST",
            data: { fecha_i: fecha_i, fecha_f: fecha_f, isograf: isograf },
            success: function (x) {
                $("#lista_recibo_pro").html(x);
                $("#tabla_RP").DataTable({
                    order: [[0, 'desc']]
                });
            },
            error: function (jqXHR, estado, error) { },
        });
    }, 1500);
}




function detalle_of(docentry) {
    $("#modal_procesar").modal("toggle");
    consulta_datos_of_cab(docentry);
    lista_turno();
    lista_maquinaria();

}



function detalle_of2(docentry) {
    $("#modal_procesar").modal("toggle");
    consulta_datos_of_cab2(docentry);
}

function actualizar_por_of(elemento, nro_iso, docentry) {
    $("#modal_actualizar_of").modal("toggle");
    $("#doc_entry_actu").val(docentry)
    lista_datos_of_sql(elemento, nro_iso);
}


function lista_datos_of_sql(elemento, nro_iso) {
    $.ajax({
        beforeSend: function (x) {

        },
        url: 'pone_mate_validado_actualizacion.php',
        dataType: 'json',
        type: 'POST',
        data: { producto: nro_iso, elemento },
        success: function (data) {
            console.log(data);
            $("#tabla_articulos2 > tbody > tr").remove();
            for (let key in data) {
                console.log(data[key].tipo_actu);
                if (data[key].codmatS == 0) {

                } else {
                    if (data[key].tipo_actu === '00') {
                        $("#tabla_articulos2 > tbody").append("<tr  style='background-color:LightGreen' ><td class='center'>" + (key) + "</td>" +
                            "<td class='center' >" + data[key].codmatS + "</td>" +
                            "<td style='' >" + data[key].DesLarga + "</td>" +
                            "<td style='' >" + data[key].unim + "</td>" +
                            "<td style='' >" + data[key].Tipos + "</td>" +
                            "<td style='' >" + data[key].OdtCant + "</td>" +
                            "<td style='' >" + data[key].odtcod + "</td>" +
                            "<td style='display:none' >" + data[key].MotNroElem + "</td>" +
                            "<td style='' >" + data[key].etapa + "</td>" +
                            "<td style='' >" + data[key].ALMACEN + "</td>" +
                            "<td style='' >" + data[key].eotDes + "</td>" +
                            "<td style='display:none' >" + data[key].tipo_actu + "</td>"
                        );
                    } else if (data[key].tipo_actu === '02') {
                        $("#tabla_articulos2 > tbody").append("<tr  style='background-color:red;color:white' ><td class='center'>" + (key) + "</td>" +
                            "<td class='center' >" + data[key].codmatS + "</td>" +
                            "<td style='' >" + data[key].DesLarga + "</td>" +
                            "<td style='' >" + data[key].unim + "</td>" +
                            "<td style='' >" + data[key].Tipos + "</td>" +
                            "<td style='' >" + data[key].OdtCant + "</td>" +
                            "<td style='' >" + data[key].odtcod + "</td>" +
                            "<td style='display:none' >" + data[key].MotNroElem + "</td>" +
                            "<td style='' >" + data[key].etapa + "</td>" +
                            "<td style='' >" + data[key].ALMACEN + "</td>" +
                            "<td style='' >" + data[key].eotDes + "</td>" +
                            "<td style='display:none' >" + data[key].tipo_actu + "</td>"
                        );
                    } else {
                        $("#tabla_articulos2 > tbody").append("<tr><td class='center'>" + (key) + "</td>" +
                            "<td class='center'>" + data[key].codmatS + "</td>" +
                            "<td style=''>" + data[key].DesLarga + "</td>" +
                            "<td style=''>" + data[key].unim + "</td>" +
                            "<td style=''>" + data[key].Tipos + "</td>" +
                            "<td style=''>" + data[key].OdtCant + "</td>" +
                            "<td style=''>" + data[key].odtcod + "</td>" +
                            "<td style='display:none'>" + data[key].MotNroElem + "</td>" +
                            "<td style=''>" + data[key].etapa + "</td>" +
                            "<td style=''>" + data[key].ALMACEN + "</td>" +
                            "<td style=''>" + data[key].eotDes + "</td>" +
                            "<td style='display:none' >" + data[key].tipo_actu + "</td>"
                        );
                    }

                }
            }

        },
        error: function (jqXHR, estado, error) {

        }
    });
}
function ultimo_valor_fila_tabla2() {
    //let tableBody = document.getElementById('tabla_articulos_mod'); 
    let line = [];
    $("#tabla_articulos2 > tbody > tr").each(function () {
        articulos = parseFloat($(this).find("td").eq(0).html());
        line.push(articulos)
        //console.log(articulos);
    });

    line.sort(function (a, b) { return a - b });
    cantidad = line.length
    data = isNaN(line[cantidad - 1]) == true ? 0 : line[cantidad - 1]

    return data;
}

function recibo_produccion(nro_of_isograf) {
    var idcl = nro_of_isograf.split("|");

    docentry = idcl[0];
    iso = idcl[1];

    $.ajax({
        url: "consulta_traeMateriales.php",
        type: "POST",
        data: {
            docentry, iso
        },
        success: function (x) {
            var data_2 = x;
            var idcl2 = data_2.split("|");
            var total = idcl2[0];

            $("#modal_recibo_produc_pt").modal("toggle");

            $.ajax({
                url: "consulta_sql_datos.php",
                type: "POST",
                data: {
                    iso: iso
                },
                success: function (x) {
                    var datita = x;
                    var icle = datita.split("|");
                    var pliego_cant = icle[0];
                    var minutos = icle[1];

                    $.ajax({
                        url: "consulta_recibo_prod.php",
                        type: "POST",
                        data: {
                            docentry: docentry, total: total, pliego_cant: pliego_cant, minutos: minutos
                        },
                        success: function (x) {
                            $("#tabla_recibo").html(x);
                            /*$("#tabla_recibo_mostrar").DataTable({
                                order: [[0, 'asc']]
                            });*/
                            recibo_produccion_cab_pt(docentry);
                            listar_almacen2_pt();
                            listar_defectos_pt();
                        },
                        error: function (jqXHR, estado, error) { },
                    });
                },
                error: function (jqXHR, estado, error) { },
            });




        },
        error: function (jqXHR, estado, error) { },
    });
}


function listar_almacen2_pt() {
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#almacen_detalle_pt").html("Recuperando Lista ...");
            },
            url: 'lista_almacen_ordenF.php',
            type: 'POST',
            data: null,
            success: function (x) {
                $("#almacen_detalle_pt").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}



function listar_defectos_pt() {
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#defecto_list_pt").html("Cargando ...");
            },
            url: 'lista_defectos.php',
            type: 'POST',
            data: null,
            success: function (x) {
                $("#defecto_list_pt").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) {
            }
        });
    });
}




function recibo_produccion_cab_pt(docentry) {

    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#modal_docentry_pt").val(docentry);
            $("#modal_op_iso_pt").val(idcl[8]);
            $("#modal_pro_pt").val(idcl[3]);
            $("#modal_des_pt").val(idcl[5]);
            $("#modal_estado_pt").val(idcl[2]);
            $("#modal_fi_pt").val(idcl[10]);
            $("#modal_ff_pt").val(idcl[11]);
            $("#modal_maqui_pt").val(idcl[15]);
            $("#modal_turno_pt").val(idcl[16]);
            $("#modal_opera_pt").val(idcl[17]);

        },
        error: function (jqXHR, estado, error) { },

    });
}



function jalar_ofs() {
    iso = $("#iso_oculto").val();

    $("#modal_seleccionar_of").modal("toggle");

    $.ajax({
        url: "listado_of_seleccionar.php",
        type: "POST",
        data: {
            iso: iso
        },
        success: function (x) {
            $("#tabla_seleccionar_ofs").html(x);
            $("#tabla_selec_of").DataTable({
                order: [[1, 'asc']]
            });

        },
        error: function (jqXHR, estado, error) { },
    });
}



$(document).on('click', '#selec_of', function () {
    var checkbox = $('#tabla_selec_of tbody tr').find("#selec_of");
    var cant = checkbox.closest("tr").find("#selec_of:checked").length;

    if ($(this).is(':checked')) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
    }

    if (cant > 0) {
        $("#btn_cerrar_of_selec").removeClass("disabledTab");
        $("#btn_cerrar_of_selec").addClass("activeTab");


    } else {
        $("#btn_cerrar_of_selec").removeClass("activeTab");
        $("#btn_cerrar_of_selec").addClass("disabledTab");

    }
});



//VALIDACION DE SI TIENE MATERIAL Y RECIBO DE PRODUCCION
// $(document).on('click', '#selec_of', function () {

//     em = $("[name='selec_of[]']:checked").parents("tr").find('td:eq(7)').text();
//     rp = $("[name='selec_of[]']:checked").parents("tr").find('td:eq(8)').text();

//     if (em === ' No ') {

//         alertify.error('No tiene Entrega de Materiales');

//     }
//     if (rp === ' No ') {

//         alertify.error('No tiene Recibo de Produccion');

//     }
// });




function cerrar_of() {
    //iso = $("#iso_oculto").val();

    bandera = true;

    if (bandera === true) {
        $("[name='selec_of[]']:checked").each(function (key) {
            var docentry = $(this).parents("tr").find('td:eq(1)').text();
            var nro_of_isograf = $(this).parents("tr").find('td:eq(2)').text();


            $.ajax({
                beforeSend: function () { },
                url: "cerrar_ofs.php",
                type: "POST",
                data:
                    "&docentry=" +
                    docentry +
                    "&nro_of_isograf=" +
                    nro_of_isograf,
                success: function (data) {

                    Swal.fire({
                        icon: 'success',
                        title: 'OF Cerrada',
                        text: 'Se cerraron las OF.',
                        showConfirmButton: false, // Oculta el botón "Aceptar"
                        timer: 2000
                    }).then(function () {
                        // Actualizar la página
                        // location.reload();
                    });
                    $("#modal_seleccionar_of").modal("hide");
                    $("#modal_resumen_detalle").modal("hide");
                    lista_of_reg();
                    migrar_sap(sapdocentry, 5);
                    char2();
                },

                error: function (jqXHR, estado, error) {

                },
            });

        });

    }

}



function resumen(docentry, nro_isograf) {

    $("#modal_resumen_detalle").modal("toggle");
    //tabla materiales entregados resumen
    $.ajax({
        url: "consulta_materialesE_resumen.php",
        type: "POST",
        data: {
            nro_isograf
        },
        success: function (x) {
            $("#tabla_ME_resumen").html(x);
            $("#tabla_MateE_modal").DataTable({
                order: [[2, 'asc']]
            });
            $("#iso_oculto").val(nro_isograf);

        },
        error: function (jqXHR, estado, error) { },
    });


    //tabla consumo resumen
    $.ajax({
        url: "consulta_consumoE_resumen.php",
        type: "POST",
        data: {
            nro_isograf,
        },
        success: function (x) {
            $("#tabla_CO_resumen").html(x);
            $("#tabla_ConsumoE_modal").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}



function modificar(docentry, nro_isograf) {
    $("#modal_modificar_of").modal("toggle");

    $.ajax({
        url: "listado_modificar.php",
        type: "POST",
        data: {
            docentry
        },
        success: function (x) {
            $("#tabla_modificar").html(x);
            $("#tabla_modal_modi").DataTable({
                order: [[0, 'asc']]
            });

            $("#doc_mod_oculto").val(docentry);
            $("#nro_isograf_mod_oculto").val(nro_isograf);

        },
        error: function (jqXHR, estado, error) { },
    });


}


function registrar_modificacion() {
    docentry = $("#doc_mod_oculto").val();
    nro_of_isograf = $("#nro_isograf_mod_oculto").val();
    bandera = true;




    $('#tabla_modal_modi > tbody').each(function () {

        var ingresarcantidad = $(this).find('input[id="nuevaCantidad_mod"]').val();
        var ingresarcantidad2 = parseFloat(ingresarcantidad);
        var cant_planicada = $(this).find('td').eq(5).html();


        if (ingresarcantidad === "") {
            bandera = false;
            alertify.error("Ingrese cantidad");
        }

        if (ingresarcantidad < cant_planicada) {
            bandera = false;
            alertify.error("El valor no puede ser mayor a la CANTIDAD PLANIFICADA");
        }

        if (bandera === true) {
            $.ajax({
                beforeSend: function () {
                },
                url: 'registrar_modificacion.php',
                type: 'POST',
                data: { docentry: docentry, nro_of_isograf: nro_of_isograf, ingresarcantidad2: ingresarcantidad2 },
                success: function (data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'OF Modificada',
                        text: 'Se realizo con exito',
                        showConfirmButton: false, // Oculta el botón "Aceptar"
                        timer: 2000
                    }).then(function () {
                        // Actualizar la página
                        // location.reload();
                    });
                    $("#modal_modificar_of").modal("hide");
                    lista_of_reg();

                },
                error: function (jqXHR, estado, error) {

                }
            });
        }
    });
    lista_of_reg();

}



function resumen_por_of(docentry, nro_isograf) {

    $("#modal_resumenXOF").modal("toggle");

    $.ajax({
        url: "consulta_materiales_XOP.php",
        type: "POST",
        data: {
            docentry, nro_isograf
        },
        success: function (x) {
            $("#tabla_entrega_XOP").html(x);
            $("#tabla_MateE_modal2").DataTable({
                order: [[0, 'asc']]
            });
            $("#iso_oculto2").val(nro_isograf);
        },
        error: function (jqXHR, estado, error) { },
    });


    //tabla consumo resumen
    $.ajax({
        url: "consulta_consumos_XOP.php",
        type: "POST",
        data: {
            docentry, nro_isograf,
        },
        success: function (x) {
            $("#tabla_consumo_XOP").html(x);
            $("#tabla_ConsumoE_modal2").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}




function mostrar_det_emate(docentry_of) {

    var idcl = docentry_of.split("|");

    docentry = idcl[0];
    nro_isograf = idcl[1];

    $("#modal_emisionPF").modal("toggle");

    $("#tabla_emiPF").hide();


    $.ajax({
        url: "lista_det_emiPrincipal.php",
        type: "POST",
        data: {
            docentry: docentry
        },
        success: function (x) {
            $("#tabla_emiPF_principal").html(x);
            $("#EPtabla").DataTable({
                order: [[0, 'asc']]
            });

        },
        error: function (jqXHR, estado, error) { },
    });


}


function listar_det_emi(docentry) {
    $("#tabla_emiPF").show();
    $.ajax({
        url: "lista_entrega_D.php",
        type: "POST",
        data: {
            docentry: docentry
        },
        success: function (x) {
            $("#tabla_emiPF").html(x);
            $("#tabla_ODDET_emi").DataTable({
                order: [[0, 'asc']]
            });

        },
        error: function (jqXHR, estado, error) { },
    });
}


$(document).on("click", "#EPtabla tbody tr", function () {
    // Al hacer clic, verificamos si la fila ya estaba seleccionada.
    var estabaSeleccionada = $(this).hasClass("seleccionada");

    // Removemos la clase 'seleccionada' de todas las filas para asegurarnos de que solo una pueda estar seleccionada a la vez.
    $("#EPtabla tbody tr").removeClass("seleccionada").css("background-color", "white");

    if (estabaSeleccionada) {
        // Si la fila ya estaba seleccionada, desactivamos los detalles.
        $("#tabla_emiPF").hide();
    } else {
        // Si la fila no estaba seleccionada, la marcamos como seleccionada y cambiamos su color de fondo.
        $(this).addClass("seleccionada").css("background-color", "LightGreen");

        // Extraemos los códigos de apertura y caja de la fila seleccionada.
        var docentry = $(this).closest("tr").find("td:eq(0)").text();


        // Mostramos los detalles de los pagos realizados.
        listar_det_emi(docentry)
    }
});



function mostrar_det_rprodu(docentry_of) {

    var idcl = docentry_of.split("|");

    docentry = idcl[0];
    nro_isograf = idcl[1];

    $("#modal_reciboPF").modal("toggle");
    $("#tabla_reciPF").hide();

    $.ajax({
        url: "lista_reci.php",
        type: "POST",
        data: {
            docentry: docentry
        },
        success: function (x) {
            $("#tabla_reciPF_principal").html(x);
            $("#tabla_RP_tabex").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}



function listar_reci(docentry) {
    $("#tabla_reciPF").show();
    $.ajax({
        url: "consulta_consumos_XOP.php",
        type: "POST",
        data: {
            docentry: docentry
        },
        success: function (x) {
            $("#tabla_reciPF").html(x);
            $("#tabla_ConsumoE_modal2").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}




$(document).on("click", "#tabla_RP_tabex tbody tr", function () {
    // Al hacer clic, verificamos si la fila ya estaba seleccionada.
    var estabaSeleccionada = $(this).hasClass("seleccionada");

    // Removemos la clase 'seleccionada' de todas las filas para asegurarnos de que solo una pueda estar seleccionada a la vez.
    $("#tabla_RP_tabex tbody tr").removeClass("seleccionada").css("background-color", "white");

    if (estabaSeleccionada) {
        // Si la fila ya estaba seleccionada, desactivamos los detalles.
        $("#tabla_reciPF").hide();
    } else {
        // Si la fila no estaba seleccionada, la marcamos como seleccionada y cambiamos su color de fondo.
        $(this).addClass("seleccionada").css("background-color", "LightGreen");

        // Extraemos los códigos de apertura y caja de la fila seleccionada.
        var docentry = $(this).closest("tr").find("td:eq(0)").text();


        // Mostramos los detalles de los pagos realizados.
        listar_reci(docentry);
    }
});




function eventos_of(docentry, nro_isograf) {

    $("#modal_eventosOF").modal("toggle");

    $("#iso_evento").val(nro_isograf);
    $("#doc_evento").val(docentry);
    listar_eventos(docentry, nro_isograf);
    //listar_maquina();
}


$(document).on("change", "#selecito_materiales select", function () {
    var maquina = this.value;
    console.log(maquina);
    listar_maquina(maquina);
});


function listar_maquina(maquina) {
    console.log(maquina);

    $.ajax({
        url: "consulta_maquinas.php",
        type: "POST",
        data: { maquina: maquina },
        success: function (x) {

            $("#lista_maquina").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
}



function listar_eventos(docentry, nro_isograf) {

    $.ajax({
        url: "consulta_eventos_new.php",
        type: "POST",
        data: {
            docentry: docentry, nro_isograf: nro_isograf
        },
        success: function (x) {
            $("#tabla_eventos").html(x);
            $("#tabla_eventos2").DataTable({
                order: [[0, 'asc']]
            });

        },
        error: function (jqXHR, estado, error) { },
    });
}
function registrarEventos() {

    swal({
        title: "Quiere Resgitrar Eventos?",
        text: "Reguistre Eventos",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Se Registro Evento", {
                    icon: "success",
                });
                registrarEventosxd();

            } else {
                swal("No se Registro Evento");
            }
        });
}

function registrarEventosxd() {
    console.log('go');

    eventos = $("#list_eventos option:selected").val();
    fecha = $("#event_fecha_ahora").val();
    hora_inicio = $("#event_hora_inicio").val();
    hora_fin = $("#event_hora_fin").val();
    observaciones = $("#even_observaciones").val();
    nro_isograf = $("#iso_evento").val();
    docentry = $("#doc_evento").val();
    maquina = $("#codigo_maquinita").val();
    bandera = true;

    if (maquina === '') {
        bandera = false;
        alertify.error("No hay maquina");
    }
    if (eventos === '') {
        bandera = false;
        alertify.error("Seleccione evento");
    }

    if (bandera === true) {
        $.ajax({
            url: "registrar_eventos_nuevo.php",
            type: "POST",
            data: {
                eventos: eventos, fecha: fecha, hora_inicio: hora_inicio, hora_fin: hora_fin, observaciones: observaciones, nro_isograf: nro_isograf, docentry: docentry, maquina: maquina
            },
            success: function (x) {


                $("#even_observaciones").val("");
                $("#nombre_maquinita").val("");
                listar_eventos(docentry, nro_isograf);

            },
            error: function (jqXHR, estado, error) { },
        });
    }



}


function finalizar_evento(id) {

    swal({
        title: "Finalizar",
        text: "Desea finalizar Evento?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                finalizar_evento2(id)
            } else {
                swal("Cancelado");
            }
        });
}


function finalizar_evento2(id) {
    nro_isograf = $("#iso_evento").val();
    docentry = $("#doc_evento").val();

    $.ajax({
        url: "finalizar_eventos.php",
        type: "POST",
        data: {
            id
        },
        success: function (x) {
            listar_eventos(docentry, nro_isograf);
        },
        error: function (jqXHR, estado, error) { },
    });
}


function recibo_produccion_nroisograf(nro_of_isograf) {
    var idcl = nro_of_isograf.split("|");

    docentry = idcl[0];
    iso = idcl[1];
    almacen_nom = idcl[2];
    almacen_cod = idcl[3];
    cantidad_plani = idcl[4];
    nro_pros = idcl[5];


    // console.log(docentry);
    // console.log(iso);

    // console.log(almacen_nom);
    // console.log(almacen_cod);

    $.ajax({
        url: "consulta_traeMateriales.php",
        type: "POST",
        data: {
            docentry, iso
        },
        success: function (x) {
            var data_2 = x;
            var idcl2 = data_2.split("|");
            var total = idcl2[0];

            //console.log(total)

            $("#modal_recibo_produc").modal("toggle");

            $.ajax({
                url: "consulta_recProd2.php",
                type: "POST",
                data: {
                    iso, almacen_nom, almacen_cod, cantidad_plani, total, nro_pros
                },
                success: function (x) {
                    $("#tabla_recibo").html(x);
                    /*$("#tabla_recibo_mostrar2").DataTable({
                        order: [[0, 'asc']]
                    });*/
                    recibo_produccion_cab(docentry);
                    recibo_produccion_cabSQL(iso);
                    listar_almacen2();
                    listar_defectos();
                },
                error: function (jqXHR, estado, error) { },
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}



function recibo_produccion_cab(docentry) {

    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#modal_docentry").val(docentry);
            $("#modal_op_iso").val(idcl[8]);
            $("#modal_pro").val(idcl[3]);
            $("#modal_des").val(idcl[5]);
            $("#modal_estado").val(idcl[2]);
            $("#modal_fi").val(idcl[10]);
            $("#modal_ff").val(idcl[11]);
            $("#modal_maqui").val(idcl[15]);
            $("#modal_turno").val(idcl[16]);
            $("#modal_opera").val(idcl[17]);

        },
        error: function (jqXHR, estado, error) { },

    });
}


function recibo_produccion_cabSQL(iso) {
    //console.log(iso);
    $.ajax({
        url: "buscar_dato_of_sql.php",

        type: "POST",
        data: {
            iso,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            //var idcl = data.split("|");

            //$("#modal_fi").val(idcl[0]);
            //$("#modal_ff").val(idcl[1]);



        },
        error: function (jqXHR, estado, error) { },
    });

}



function generar_excel_listadoEntrega(docentry) {
    javascript: window.open("excel_listado_entrega.php?docentry=" + docentry + "");
}


function ver_detalle(docentry) {
    $("#modal_procesar_detalle").modal("toggle");
    $.ajax({
        url: "consulta_detalle.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_ver_detalle").html(x);
            $("#tabla_detalle2do").DataTable({
                order: [[2, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });


}



function det_recibo(docentry) {
    $("#modal_det_recibox").modal("toggle");
    $.ajax({
        url: "consulta_det_defectos_re.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_recibo_detx").html(x);
            $("#tabla_defectos_prid").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });


}



function ver_detallePT(docentry) {
    $("#modal_procesar_detalle").modal("toggle");

    $.ajax({
        url: "consulta_detallePT.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_ver_detalle").html(x);
            $("#tabla_detalle2do").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}



function consulta_datos_of_cab(docentry) {
    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#docentry_mod").val(docentry);
            $("#tipo_mod").val(idcl[1]);
            $("#estado_mod").val(idcl[2]);
            $("#producto_mod").val(idcl[3]);
            $("#um_mod").val(idcl[4]);
            $("#des_mod").val(idcl[5]);
            $("#cant_plan_mod").val(parseFloat(idcl[6]).toFixed(2));
            $("#almacen_modal").val(idcl[7]);
            $("#fechai_modal").val(idcl[10]);
            $("#fechaf_modal").val(idcl[11]);

            $("#operario_modal").val(idcl[14]);

            consulta_datos_of_det(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });
}



function consulta_datos_of_cab2(docentry) {
    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#docentry_mod").val(docentry);
            $("#tipo_mod").val(idcl[1]);
            $("#estado_mod").val(idcl[2]);
            $("#producto_mod").val(idcl[3]);
            $("#um_mod").val(idcl[4]);
            $("#des_mod").val(idcl[5]);
            $("#cant_plan_mod").val(parseFloat(idcl[6]).toFixed(2));
            $("#almacen_modal").val(idcl[7]);
            $("#fechai_modal").val(idcl[10]);
            $("#fechaf_modal").val(idcl[11]);


            consulta_datos_of_det2(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });
}



function consulta_datos_of_det(docentry) {
    $.ajax({
        url: "buscar_data_of_det.php",
        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_of_det").html(x);
            $("#tabla_detpr").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}




function consulta_datos_of_det2(docentry) {
    $.ajax({
        url: "buscar_data_of_det_otro.php",
        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_of_det").html(x);
            $("#tabla_detpr_otros").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}







$(document).on('click', '#salida_2', function () {

    if ($(this).is(':checked')) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        document.getElementById('regist_sal').disabled = false;
        num = $(this).parents("tr").find("td:eq(8)").text();

        num = parseFloat(num);
        num = isNaN(num) ? 0 : Math.abs(num);
        $(this).parents("tr").find('input[id="ingresarCant"]').val(num);


        // $(this).parents("tr").find("td:eq(13)").text(nuevo_valor);

    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        document.getElementById('regist_sal').disabled = true;
        num = "";
        $(this).parents("tr").find('input[id="ingresarCant"]').val(num);
    }

});




$(document).on('click', '#procesos', function () {

    if ($(this).is(':checked')) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        document.getElementById('btn_ofs').disabled = false;


    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        document.getElementById('btn_ofs').disabled = true;


    }
});


$(document).on('click', '#procesos_docito', function () {

    if ($(this).is(':checked')) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        document.getElementById('btn_ofs_kho').disabled = false;


    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        document.getElementById('btn_ofs_kho').disabled = true;


    }
});



$(document).on('click', '#procesos2', function () {

    if ($(this).is(':checked')) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        document.getElementById('btn_ofs_2da').disabled = false;


    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        document.getElementById('btn_ofs_2da').disabled = true;


    }
});




$(document).on('input', '#ingresarCant', function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        if ($(this).is('input[type="number"]')) {
            $(this).parents("tr").find("td").css("background-color", "LightGreen");
            document.getElementById('regist_sal').disabled = false
            $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)


        } else {
            $(this).parents("tr").find("td").css("background-color", "white");
            document.getElementById('regist_sal').disabled = true

        }
    } else {
        $(this).closest("tr").find("td").css("background-color", "");
        document.getElementById('regist_sal').disabled = true;
        $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

    }
});


$(document).on('input', '#cant_devolucion', function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        if ($(this).is('input[type="number"]')) {
            $(this).parents("tr").find("td").css("background-color", "LightGreen");
            document.getElementById('btn_devolucion').disabled = false
            $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)


        } else {
            $(this).parents("tr").find("td").css("background-color", "white");
            document.getElementById('btn_devolucion').disabled = true

        }
    } else {
        $(this).closest("tr").find("td").css("background-color", "");
        document.getElementById('btn_devolucion').disabled = true;
        $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

    }
});



$(document).on('input', '#cantMala1', function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        if ($(this).is('input[type="number"]')) {
            $(this).parents("tr").find("td").css("background-color", "LightGreen");
            document.getElementById('btn_regis_recibo').disabled = false
            $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)


        } else {
            $(this).parents("tr").find("td").css("background-color", "white");
            document.getElementById('btn_regis_recibo').disabled = true

        }
    } else {
        $(this).closest("tr").find("td").css("background-color", "");
        document.getElementById('btn_regis_recibo').disabled = true;
        $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

    }
});









$(document).on('input', '#cantRecibida', function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        if ($(this).is('input[type="number"]')) {
            $(this).parents("tr").find("td").css("background-color", "LightGreen");
            document.getElementById('btn_regis_recibo').disabled = false
            $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)


        } else {
            $(this).parents("tr").find("td").css("background-color", "white");
            document.getElementById('btn_regis_recibo').disabled = true

        }
    } else {
        $(this).closest("tr").find("td").css("background-color", "");
        document.getElementById('btn_regis_recibo').disabled = true;
        $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

    }
});




$(document).on('click', '#recibito', function () {
    // Obtener la fila asociada al checkbox
    var $row = $(this).closest("tr");

    // Desactivar todos los otros checkboxes y cambiar el color de sus filas a blanco
    $('input[type="checkbox"]').not(this).prop('checked', false).closest("tr").css("background-color", "white");

    // Realizar la acción deseada al activar el checkbox
    if ($(this).is(':checked')) {
        $row.css("background-color", "LightGreen");
        $('#btn_regis_recibo').prop('disabled', false);
    } else {
        $row.css("background-color", "white");
        $('#btn_regis_recibo').prop('disabled', true);
    }
});






$(document).on("keyup", "#ingresarCant", function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        stock = $(this).parents("tr").find("td:eq(11)").text();

        num = $(this).parents("tr").find("td:eq(8)").text();
        num = parseFloat(num);
        num = isNaN(num) ? 0 : Math.abs(num);
        num2 = $(this).parents("tr").find('input[id="ingresarCant"]').val();

        if (parseFloat(valor) > num) {
            alertify.error("El valor ingresado no puede ser mayor que " + num + "| CANTIDAD REQUERIDA");

        }

        if (parseFloat(stock) <= 0) {
            alertify.error("No hay stock");

        }



        //nuevo_valor = (num - num2).toFixed(4);

        //$(this).parents("tr").find("td:eq(9)").text(nuevo_valor);
    } else {

    }
});


$(document).on('input', '#ingresarItem', function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        if ($(this).is('input[type="text"]')) {
            //$(this).parents("tr").find("td").css("background-color", "LightGreen");
            document.getElementById('btn_ofs').disabled = false
            $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)


        } else {
            //$(this).parents("tr").find("td").css("background-color", "white");
            document.getElementById('btn_ofs').disabled = true

        }
    } else {
        //$(this).closest("tr").find("td").css("background-color", "");
        document.getElementById('btn_ofs').disabled = true;
        $(this).parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

    }
});








function registrar_datos() {
    tipo_mod = $("#tipo_mod").val();
    estado_mod = $("#estado_mod").val();
    producto_mod = $("#producto_mod").val();
    um_mod = $("#um_mod").val();
    des_mod = $("#des_mod").val();
    cant_plan_mod = $("#cant_plan_mod").val();
    almacen_modal = $("#almacen_modal").val();
    docentry_mod = $("#docentry_mod").val();
    comentarios = $("#comentarios").val();
    fechai_modal = $("#fechai_modal").val();
    fechaf_modal = $("#fechaf_modal").val();

    maquinaria_modal = $("#list_maquinaria option:selected").val();
    turno_modal = $("#list_turno option:selected").val();
    operario_modal = $("#operario_modal").val();


    bandera = true;
    bandera2 = true;

    if (maquinaria_modal === 'Seleccione') {
        bandera = false;
        alertify.error("Seleccione maquina");
    }

    if (turno_modal === 'Seleccione un Item') {
        bandera = false;
        alertify.error("Seleccione Turno");
    }


    if (bandera === true) {
        $("[name='salida_mer[]']:checked").each(function (key) {
            var BaseLineNum = $(this).parents("tr").find('td:eq(1)').text();
            var baseentry = $(this).parents("tr").find('td:eq(2)').text();
            var proceso = $(this).parents("tr").find('td:eq(3)').text();
            var codigo = $(this).parents("tr").find('td:eq(4)').text();
            var descripcion = $(this).parents("tr").find('td:eq(5)').text();
            var tipo = $(this).parents("tr").find('td:eq(6)').text();
            var cant_b = $(this).parents("tr").find('td:eq(7)').text();
            var cant_r = $(this).parents("tr").find('td:eq(8)').text();
            var cant_mala = $(this).parents("tr").find('input[id="ingresarCant_mala"]').val();
            var cant_mala2 = parseFloat(cant_mala);
            var ingresarcantidad = $(this).parents("tr").find('input[id="ingresarCant"]').val();
            var almacen = $(this).parents("tr").find("#almacen_entrega option:selected").val();
            var cant_almacen = $(this).parents("tr").find('input[id="cant_stock"]').val();
            var ingresarcantidad2 = parseFloat(ingresarcantidad);


            if (0 > ingresarcantidad2) {
                bandera2 = false
                alertify.error('Cantidad no Validad');
                $(this).parents("tr").find('td:eq(10)').css("background-color", "#F67280");
            }
            if (ingresarcantidad === "") {
                bandera2 = false
                alertify.error('Falta llenar la cantidad');
                $(this).parents("tr").find('td:eq(10)').css("background-color", "#F67280");
            }

            if (ingresarcantidad2 > cant_r) {
                bandera2 = false
                alertify.error('Valor incorrecto');

            }

            if ((parseFloat(cant_almacen) <= 0) && tipo !== 'RE') {
                bandera2 = false;
                alertify.error("No hay stock");
                // Limpiar el campo
                //return;
            }

        });

        if (bandera2 === true) {
            $.ajax({
                url: "inserta_datos_entrega_cab.php",
                type: "POST",
                data: {
                    tipo_mod: tipo_mod, estado_mod: estado_mod, producto_mod: producto_mod, um_mod: um_mod, des_mod:
                        des_mod, cant_plan_mod: cant_plan_mod, almacen_modal: almacen_modal, docentry_mod: docentry_mod, comentarios:
                        comentarios, fechai_modal: fechai_modal, fechaf_modal: fechaf_modal, maquinaria_modal: maquinaria_modal, turno_modal: turno_modal, operario_modal: operario_modal
                },
                success: function (x) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro Exitoso',
                        text: 'La Entrega fue registrada.',
                        showConfirmButton: false, // Oculta el botón "Aceptar"
                        timer: 2000
                    }).then(function () {
                        // Actualizar la página
                        // location.reload();
                    });
                    lista_of_reg();
                    lista_of_entrega();
                    $("#comentarios").val('');
                    $("#maquinaria_modal").val('');
                    $("#turno_modal").val('');
                    $("#operario_modal").val('');
                    global = parseInt(x);
                    //console.log(global);
                    //aqui comienza el deta
                    if (global == 0) {
                        alertify.error("No inserto");
                    } else {
                        $("[name='salida_mer[]']:checked").each(function (key) {
                            var BaseLineNum = $(this).parents("tr").find('td:eq(1)').text();
                            var baseentry = $(this).parents("tr").find('td:eq(2)').text();
                            var proceso = $(this).parents("tr").find('td:eq(3)').text();
                            var codigo = $(this).parents("tr").find('td:eq(4)').text();
                            var descripcion = $(this).parents("tr").find('td:eq(5)').text();
                            var tipo = $(this).parents("tr").find('td:eq(6)').text();
                            var cant_b = $(this).parents("tr").find('td:eq(7)').text();
                            var cant_r = $(this).parents("tr").find('td:eq(8)').text();
                            var cant_mala = $(this).parents("tr").find('input[id="ingresarCant_mala"]').val();
                            var cant_mala2 = parseFloat(cant_mala);
                            var ingresarcantidad = $(this).parents("tr").find('input[id="ingresarCant"]').val();
                            var almacen = $(this).parents("tr").find("#almacen_entrega option:selected").val();
                            console.log(almacen);
                            var cant_almacen = $(this).parents("tr").find('input[id="cant_stock"]').val();
                            var ingresarcantidad2 = parseFloat(ingresarcantidad);
                            var nro_isograph = $(this).parents("tr").find('td:eq(13)').text();

                            $.ajax({
                                beforeSend: function () { },
                                url: "inserta_datos_entrega_det.php",
                                type: "POST",
                                data:
                                    "&BaseLineNum=" +
                                    BaseLineNum +
                                    "&baseentry=" +
                                    baseentry +
                                    "&proceso=" +
                                    proceso +
                                    "&codigo=" +
                                    codigo +
                                    "&descripcion=" +
                                    descripcion +
                                    "&tipo=" +
                                    tipo +
                                    "&cant_b=" +
                                    cant_b +
                                    "&cant_r=" +
                                    cant_r +
                                    "&cant_mala=" +
                                    cant_mala2 +
                                    "&ingresarcantidad=" +
                                    ingresarcantidad2 +
                                    "&almacen=" +
                                    almacen +
                                    "&cant_almacen=" +
                                    cant_almacen +
                                    "&docentry=" +
                                    global +
                                    "&nro_isograph=" +
                                    nro_isograph,
                                success: function (data) {

                                    $("#modal_procesar").modal("hide");

                                },

                                error: function (jqXHR, estado, error) {

                                },
                            });
                        });
                        //migrar_sap(global, 4)
                    }
                },
                error: function (jqXHR, estado, error) {

                }
            });
        }

    }

}



// $(document).on("click", "#tabla_enSap2 tbody tr", function () {
//     // Encuentra el checkbox dentro de la fila actual
//     var checkbox = $(this).find("#emision_check");

//     // Cambia el estado del checkbox al hacer clic en cualquier parte de la fila
//     checkbox.prop("checked", !checkbox.prop("checked"));
//     // Actualiza la apariencia y el botón según el estado del checkbox
//     actualizarFila_sap_entrega(checkbox);
// });



// function actualizarFila_sap_entrega(checkbox) {
//     // var cant = checkbox.closest("tr").find("#procesar:checked").length / 2;
//     cant = document.querySelectorAll('#emision_check:checked').length / 2;

//     // Verifica si el checkbox está marcado
//     if (checkbox.is(":checked")) {
//         checkbox.closest("tr").find("td").css("background-color", "LightGreen");
//         if (cant > 0) {
//             $('#botonzzz').show();
//         } else {
//             $('#botonzzz').hide();
//         }

//     } else {
//         checkbox.closest("tr").find("td").css("background-color", "white");
//         if (cant > 0) {
//             $('#botonzzz').show();
//         } else {
//             $('#botonzzz').hide();
//         }
//     }
// }


$(document).on('click', '#emision_check', function () {
    cant = document.querySelectorAll('#emision_check:checked').length / 2;
    //console.log('hola');
    if ($(this).is(':checked')) {
        if (cant > 0) {
            $('#botonzzz').show();
        } else {
            $('#botonzzz').hide();
        }
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        if (cant > 0) {
            $('#botonzzz').show();
        } else {
            $('#botonzzz').hide();
        }

    }
});



$(document).on('click', '#recibo_check', function () {
    cant = document.querySelectorAll('#recibo_check:checked').length / 2;
    //console.log('hola');
    if ($(this).is(':checked')) {
        if (cant > 0) {
            $('#botonzzz_recibo').show();
        } else {
            $('#botonzzz_recibo').hide();
        }
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        if (cant > 0) {
            $('#botonzzz_recibo').show();
        } else {
            $('#botonzzz_recibo').hide();
        }

    }
});





function migrar_entrega_sap() {
    $("#modal_seleccionar_entregas").modal("toggle");

    $.ajax({
        url: "listado_migrar_entregas.php",

        type: "POST",
        data: null,
        success: function (x) {
            $("#tabla_entregasPen_sap").html(x);
            $("#tabla_enSap2").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });



}



function migrar_recibo_sap() {
    $("#modal_seleccionar_recibos").modal("toggle");

    $.ajax({
        url: "listado_migrar_recibos.php",

        type: "POST",
        data: null,
        success: function (x) {
            $("#tabla_recibos_sap").html(x);
            $("#tablaReciboSupremo").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}



function migrarEntregas() {
    $("[name='emision_check[]']:checked").each(function (key) {
        var global = $(this).parents("tr").find('td:eq(1)').text();


        migrar_sap(global, 4);

    });
    $("#modal_seleccionar_entregas").modal("hide");
    lista_of_entrega();
}


function migrarRecibos() {
    $("[name='recibo_check[]']:checked").each(function (key) {
        var global = $(this).parents("tr").find('td:eq(1)').text();


        migrar_sap(global, 3);

    });
    $("#modal_seleccionar_recibos").modal("hide");
    lista_recibo_prod();

}




function registrar_reciboP() {
    modal_op_iso = $("#modal_op_iso").val();
    modal_pro = $("#modal_pro").val();
    modal_des = $("#modal_des").val();
    modal_docentry = $("#modal_docentry").val();
    modal_fi = $("#modal_fi").val();
    modal_ff = $("#modal_ff").val();

    unidad_buena = $("#uni_buenas").val();
    unidad_mala = $("#uni_malas").val();
    almacen = $("#almacen_detalle option:selected").val();
    observaciones = $("#uni_observaciones").val();

    bandera2 = true;

    if (unidad_buena === '') {
        bandera2 = false;
        alertify.error("Ingrese Unidad Buena");

    }

    if (unidad_mala === '') {
        bandera2 = false;
        alertify.error("Ingrese Unidad Mala");

    }

    if (bandera2 === true) {

        $.ajax({
            url: "inserta_datos_reciboCab.php",
            type: "POST",
            data: { modal_op_iso: modal_op_iso, modal_pro: modal_pro, modal_des: modal_des, modal_docentry: modal_docentry, modal_fi: modal_fi, modal_ff: modal_ff },
            success: function (x) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso',
                    text: 'El recibo fue registrado.',
                    showConfirmButton: false, // Oculta el botón "Aceptar"
                    timer: 2000
                }).then(function () {
                    // Actualizar la página
                    // location.reload();
                });

                global = parseInt(x);
                console.log(global);
                //aqui comienza el deta
                if (global == 0) {
                    alertify.error("No inserto");
                } else {

                    var unidad_buena = $("#uni_buenas").val();
                    var unidad_mala = $("#uni_malas").val();
                    var almacen = $("#almacen_detalle option:selected").val();
                    var observaciones = $("#uni_observaciones").val();


                    $.ajax({
                        beforeSend: function () { },
                        url: "inserta_datos_reciboDet.php",
                        type: "POST",
                        data:
                            "&modal_op_iso=" +
                            modal_op_iso +
                            "&unidad_buena=" +
                            unidad_buena +
                            "&unidad_mala=" +
                            unidad_mala +
                            "&almacen=" +
                            almacen +
                            "&observaciones=" +
                            observaciones +
                            "&docentry=" +
                            global,
                        success: function (data) {

                            $("#modal_recibo_produc").modal("hide");
                            lista_recibo_prod();



                            $('#tabla_defectos > tbody > tr').each(function () {
                                linea = $(this).find('td').eq(0).html()
                                lina2 = linea;
                                var line = parseInt(linea);

                                var codigo = $(this).find('td').eq(1).html();
                                var nombres = $(this).find('td').eq(2).html();
                                var cantidad = $(this).find('td').eq(3).html();


                                $.ajax({
                                    beforeSend: function () {
                                    },
                                    url: 'inserta_defectos_recibo.php',
                                    type: 'POST',
                                    data: '&line=' + line + '&codigo=' + codigo + '&nombres=' + nombres + '&cantidad=' + cantidad + '&modal_op_iso=' + modal_op_iso + '&global=' + global,
                                    success: function (data) {
                                        $("#tabla_defectos > tbody:last").children().remove();
                                        $("#uni_buenas").val("");
                                        $("#uni_malas").val("");
                                        $("#uni_observaciones").val("");
                                        $("#cantidad_defecto").val("");
                                    },
                                    error: function (jqXHR, estado, error) {
                                        $("#errores").html('Error... ' + estado + '  ' + error);
                                    }
                                });


                            });

                        },

                        error: function (jqXHR, estado, error) {

                        },
                    });




                    //migrar_sap(global, 3)
                }
            },
            error: function (jqXHR, estado, error) {

            }
        });
    }

}


function detalle_entrega(docentry) {
    $("#modal_detalle_entrega").modal("toggle");
    datos_entrega_det(docentry);

}


function datos_entrega_det(docentry) {
    $.ajax({
        url: "consulta_listado_entregaD.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_entrega_detcito").html(x);
            $("#tabla_ODDET").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}



function devolucion_entrega(docentry) {
    $("#modal_devolucion_entrega").modal("toggle");
    datos_devolucion_det(docentry);

}


function seleccionar_eventos(docentry, nro_isograf) {
    $("#modal_eventosOF").modal("toggle");
    listar_nomEventos();


    $("#iso_evento").val(nro_isograf);
    $("#doc_evento").val(docentry);

    listar_eventos(docentry, nro_isograf)

}


function listar_nomEventos() {
    $.ajax({
        url: "consulta_listadoEventx.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#list_eventos").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
}



function busca_maquinas() {
    $("#modal_material").modal('show')
    listar_Tipomaquina()
    //listar_maquina();
}


function listar_Tipomaquina() {
    $.ajax({
        url: "consulta_Tipomaquinas.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#selecito_materiales").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
}


$(document).on("change", "#selecito_materiales select", function () {
    var maquina = this.value;
    console.log(maquina);
    listar_maquina(maquina);
});




function listar_maquina(maquina) {
    console.log(maquina);

    $.ajax({
        url: "consulta_maquinas.php",
        type: "POST",
        data: { maquina: maquina },
        success: function (x) {

            $("#tabla_matecitox").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
}



function colocarMaquina(valor) {
    $("#modal_material").modal('hide')

    var client = valor;
    var idcl = client.split("|");
    $("#codigo_maquinita").val(idcl[0]);
    $("#nombre_maquinita").val(idcl[1]);

}




function datos_devolucion_det(docentry) {
    $.ajax({
        url: "consulta_devolucion_det.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_devolucion_detcito").html(x);
            $("#tabla_devo").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}



function generar_excel_RP() {
    estado = $("#estado").val();
    javascript: window.open('reporte_excel_OP.php?estado=' + estado + '');
}



function exportarExcelGeneral() {
    estado = $("#estado").val();
    javascript: window.open('reporte_excel_entregaM.php?estado=' + estado + '');

}

function exportarExcelGeneralOF() {
    estado = $("#estado").val();
    javascript: window.open('reporte_excel_listadOF.php?estado=' + estado + '');

}


function transformar_of(docentry) {
    $("#modal_transformarOP").modal("toggle");

    $.ajax({
        url: "lista_transformer.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_transformer").html(x);
            $("#table_transfor").DataTable({
                order: [[0, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}


function listado_materiales_transf2(docentry, of_padre) {
    $("#modalcito_xd").modal("toggle");
    $("#of_padre_segda_2").val(of_padre);
    $.ajax({
        url: "listado_datosMregis.php",

        type: "POST",
        data: {
            docentry
        },
        success: function (x) {
            $("#tabla_transformer_xd").html(x);
            $("#tablita_2da").DataTable({
                order: [[2, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}

function listado_materiales_trasns_actu(docentry, of_padre) {
    $("#modalcito_xd2").modal("toggle");
    $("#of_padre_segda_3").val(docentry);
    $.ajax({
        url: "listado_datosMregis_actu.php",

        type: "POST",
        data: {
            docentry
        },
        success: function (x) {
            $("#tabla_transformer_xd2").html(x);
            $("#tablita_3era").DataTable({
                order: [[2, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });
}

function registrar_mat_actualizar() {
    bandera = false;
    var num_iso = '';
    docentry = $("#doc_entry_actu").val()
    $('#tabla_articulos2 > tbody > tr').each(function () {
        var tipo_actu = $(this).find('td').eq(11).html();

        if (tipo_actu !== '01') {
            bandera = true;
            linea = $(this).find('td').eq(0).html()
            lina2 = linea;
            var line = parseInt(linea);

            var codigo = $(this).find('td').eq(1).html();
            var descripcion = $(this).find('td').eq(2).html();
            var um = $(this).find('td').eq(3).html();
            var tipo = $(this).find('td').eq(4).html();
            var cantidad = $(this).find('td').eq(5).html();
            var isograf = $(this).find('td').eq(6).html();
            var cox = $(this).find('td').eq(7).html();
            var etapa = $(this).find('td').eq(8).html();
            var almacen = $(this).find('td').eq(9).html();
            var eotDesc = $(this).find('td').eq(10).html();
            num_iso = isograf;
            console.log(num_iso);

            $.ajax({
                beforeSend: function () {
                },
                url: 'inserta_materiales_det_actu.php',
                type: 'POST',
                data: '&line=' + line + '&codigo=' + codigo + '&descripcion=' + descripcion + '&um=' + um + '&tipo=' + tipo + '&cantidad=' + cantidad + '&isograf=' + isograf + '&global=' + 0 + '&cox=' + cox + '&etapa=' + etapa + '&almacen=' + almacen + '&eotDesc=' + eotDesc + '&tipo_actu=' + tipo_actu + '&docentry=' + docentry,
                success: function (data) {
                    $("#modal_actualizar_of").modal("hide");


                },
                error: function (jqXHR, estado, error) {
                    $("#errores").html('Error... ' + estado + '  ' + error);
                }
            });

        }
    });
    console.log(num_iso);

    if (bandera == true) {
        enviar_correo_actu_opf(num_iso);
    }
}

function enviar_correo_actu_opf(num_iso) {
    $.ajax({
        url: "enviar_correo_actualiza_of.php",
        type: "POST",
        data: {
            correo: 'produccion_sap@exituno.pe', docentry: num_iso,
        },
        success: function (x) {
            alertify.success('Se envio Correo');
        },
        error: function (jqXHR, estado, error) {
        },
    });
}

function listado_materiales_transf(docentry, codigo, of_padre) {
    console.log(codigo)

    $("#modal_2da_explosion").modal("toggle");
    $("#of_padre_segda").val(of_padre)

    $.ajax({
        url: "lista_mate_explosion.php",

        type: "POST",
        data: {
            docentry, codigo
        },
        success: function (x) {
            $("#tabla_2da_explosion").html(x);
            $("#table_explo2").DataTable({
                order: [[1, 'asc']]
            });
        },
        error: function (jqXHR, estado, error) { },
    });

}

function dar_baja_elemento(docentry, elemento, nro_iso) {
    swal({
        title: "Anular OF Vinculadas",
        text: "Desea Anularlo?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                dar_baja_of_elemento(docentry, elemento, nro_is)
            } else {
                swal("Cancelado");
            }
        });
}


function transformar_of2(docentry) {
    $("#modal_transformarOP2").modal("toggle");

    $.ajax({
        url: "lista_transformer2.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            $("#tabla_transformer2").html(x);
            $("#table_transfor_2da").DataTable({
                order: [[2, 'asc']]
            });
        },


        error: function (jqXHR, estado, error) { },
    });

}



function reg_transformar() {
    $("#modal_transformer").modal("toggle");

    var docentry = $('#table_transfor > tbody > tr').find('td').eq(1).html();
    var proceso = $('#table_transfor > tbody > tr').find('td').eq(11).html();
    var isograf = $('#table_transfor > tbody > tr').find('td').eq(12).html();
    var tipo = $('#table_transfor > tbody > tr').find('td').eq(5).html();
    //console.log(docentry);

    $.ajax({
        url: "lista_procesosOF.php",

        type: "POST",
        data: {
            docentry, proceso, isograf, tipo
        },
        success: function (x) {
            $("#tabla_muestra_OFS").html(x);
            $("#tablaofs").DataTable({
                order: [[1, 'asc']]
            });

            $("#tablaofs input[id='procesos']").each(function () {
                $(this).prop('checked', true);
                $(this).parents("tr").find("td").css("background-color", "LightGreen");
            });

            $("#btn_ofs").prop('disabled', false);

            //cargar_transformer_cab(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });

}

function registrardetcito() {
    // Swal.fire({
    //     icon: 'success',
    //     title: 'Registro Exitoso',
    //     text: 'Materiales Registrados.',
    //     showConfirmButton: false, // Oculta el botón "Aceptar"
    //     timer: 2000
    // }).then(function () {

    // });
    bandera_vali = false;
    // $('#table_explo2 > tbody > tr').each(function () {        

    //     var proceso = $(this).find("td").find('select[id="proceso_explo2"]').find('option:selected').val();


    //     if (proceso === "00") {
    //         bandera_vali = true;
    //         alertify.error("Seleccione proceso");
    //         //return false

    //     }      


    // });
    // console.log(bandera_vali)
    if (bandera_vali === false) {
        $('#table_explo2 > tbody > tr').each(function () {
            linea = $(this).find('td').eq(0).html()
            lina2 = linea;
            of_padre = $("#of_padre_segda").val();
            var line = parseInt(linea);
            var proceso = $(this).find("td").find('select[id="proceso_explo2"]').find('option:selected').val();
            var codigo = $(this).find('td').eq(2).html();
            var descripcion = $(this).find('td').eq(3).html();
            var tipo = $(this).find('td').eq(4).html();
            var cant_base = $(this).find("td").find('input[id="cantidad_base_explo2"]').val();
            var cant_requerida = $(this).find("td").find('input[id="cantidad_item_explo2"]').val();
            var almacen_det = $(this).find("td").find('select[id="almacen_detalle_explo2"]').find('option:selected').val();
            var cant_almacen = $(this).find("td").find('input[id="cant_stock_explo2"]').val();
            var docentry = $(this).find('td').eq(9).html();
            var id_validacion = 1;
            var global = $(this).find('td').eq(10).html();

            $.ajax({
                beforeSend: function () {
                },
                url: 'procesa_of_det.php',
                type: 'POST',
                data: '&line=' + line + '&proceso=' + proceso + '&codigo=' + codigo + '&descripcion=' + descripcion + '&tipo=' + tipo +
                    '&cant_base=' + cant_base + '&cant_requerida=' + cant_requerida + '&almacen_det=' + almacen_det + '&cant_almacen=' + cant_almacen + '&docentry=' + docentry + '&global=' + global + '&id_validacion=' + id_validacion,
                success: function (data) {

                    $("#table_explo2 > tbody:last").children().remove();
                    $("#modal_2da_explosion").modal("hide");
                    lista_of_reg();
                },
                error: function (jqXHR, estado, error) {
                    $("#errores").html('Error... ' + estado + '  ' + error);
                }
            });


        });


    }


}


function registrar_devolucion() {
    $("[name='devo[]']:checked").each(function (key) {
        var baseentry = $(this).parents("tr").find('td:eq(1)').text();
        var proceso = $(this).parents("tr").find('td:eq(2)').text();
        var codigo = $(this).parents("tr").find('td:eq(3)').text();
        var descripcion = $(this).parents("tr").find('td:eq(4)').text();
        var tipo = $(this).parents("tr").find('td:eq(5)').text();
        var cant_ingresada = $(this).parents("tr").find('td:eq(6)').text();
        var cant_devo = $(this).parents("tr").find('input[id="cant_devolucion"]').val();
        var cant_devo2 = parseFloat(cant_devo);

        var almacen = $(this).parents("tr").find('td:eq(8)').text();

        $.ajax({
            beforeSend: function () { },
            url: "inserta_datos_devolucion.php",
            type: "POST",
            data:
                "&baseentry=" +
                baseentry +
                "&proceso=" +
                proceso +
                "&codigo=" +
                codigo +
                "&descripcion=" +
                descripcion +
                "&tipo=" +
                tipo +
                "&cant_ingresada=" +
                cant_ingresada +
                "&cant_devo=" +
                cant_devo2 +
                "&almacen=" +
                almacen,

            success: function (data) {

                $("#modal_devolucion_entrega").modal("hide");

            },

            error: function (jqXHR, estado, error) {

            },
        });
    });

}

function reg_2da_explosion() {
    $("#modal_ver_datos_explo2").modal("toggle");

    var docentry = $('#tablita_2da > tbody > tr').find('td').eq(1).html();
    var proceso = $('#tablita_2da > tbody > tr').find('td').eq(11).html();
    var isograf = $('#tablita_2da > tbody > tr').find('td').eq(12).html();

    //console.log(docentry);

    $.ajax({
        url: "lista_mate_procesos.php",

        type: "POST",
        data: {
            docentry, proceso, isograf
        },
        success: function (x) {
            $("#tabla_ver2daexplo").html(x);
            $("#tablex").DataTable({
                order: [[1, 'asc']]
            });

            $("#tablex input[id='procesos_docito']").each(function () {
                $(this).prop('checked', true);
                $(this).parents("tr").find("td").css("background-color", "LightGreen");
            });

            $("#btn_ofs_kho").prop('disabled', false);

            //cargar_transformer_cab(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });

}

function reg_actu_explosion() {
    $("#modal_ver_datos_explo_actu").modal("toggle");

    var docentry = $('#tablita_3era > tbody > tr').find('td').eq(1).html();
    var proceso = $('#tablita_3era > tbody > tr').find('td').eq(11).html();
    var isograf = $('#tablita_3era > tbody > tr').find('td').eq(12).html();

    //console.log(docentry);

    $.ajax({
        url: "lista_mate_procesos_actu.php",

        type: "POST",
        data: {
            docentry, proceso, isograf
        },
        success: function (x) {
            $("#tabla_ver2daexplo2").html(x);
            // $("#tablex2").DataTable({
            //     order: [[1, 'asc']]
            // });

            $("#tablex2 input[id='procesos_docito2']").each(function () {
                $(this).prop('checked', true);
                $(this).parents("tr").find("td").css("background-color", "LightGreen");
            });

            $("#btn_ofs_kho2").prop('disabled', false);

            //cargar_transformer_cab(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });

}
function registrar_OFS_demacrado2() {
    console.log("hola")
    i = '0001';
    prod_cod = $("#of_padre_segda_3").val();
    $("[name='procesos_docito2[]']:checked").each(function (key) {
        var docentry_of = $(this).parents("tr").find('td:eq(1)').text();
        var docentry = docentry_of;
        var of_padre = 0;
        var proceso = $(this).parents("tr").find('td:eq(19)').text();
        var nro_producto = $(this).parents("tr").find('input[id="codigoItem_2dita2"]').val();
        var descripcion = $(this).parents("tr").find('input[id="descItem_2dita2"]').val();
        var cant_planificada = $(this).parents("tr").find('td:eq(5)').text();

        var nro_of_isograf = $(this).parents("tr").find('td:eq(6)').text();
        //var nro_of_isograf = 'PRODUCTO_PROCESO_'+i;
        var tipo = $(this).parents("tr").find('td:eq(7)').text();
        // var estado = $(this).parents("tr").find('td:eq(7)').text();
        var cod_prodc = $(this).parents("tr").find('td:eq(22)').text();
        var primeros_ocho_digitos = cod_prodc.substring(0, 8);
        //console.log(primeros_ocho_digitos);
        var ultimos_cinco_digitos = primeros_ocho_digitos.slice(-5);
        //console.log(ultimos_cinco_digitos);

        var estado = "PP";  //Producto Proceso

        var nro_producto2 = 'PRODUCTO_PROCESO_' + i; //
        var unidad_medida = $(this).parents("tr").find('td:eq(10)').text();
        var descripcion2 = $(this).parents("tr").find('td:eq(11)').text();
        var almacen = $(this).parents("tr").find('td:eq(12)').text();
        var fecha_op = $(this).parents("tr").find('td:eq(13)').text();
        var fecha_inicio = $(this).parents("tr").find('td:eq(14)').text();
        var fecha_fin = $(this).parents("tr").find('td:eq(15)').text();
        var cant_merma = $(this).parents("tr").find('td:eq(16)').text();
        var proce_inicial = $(this).parents("tr").find('td:eq(20)').text();
        var elemento = $(this).parents("tr").find('td:eq(21)').text();
        nueva_cantidad = 0;

        // if (nro_producto === '') {
        //     nro_producto = cod_prodc + proceso
        // }

        if (nro_producto === '') {
            nro_producto = cod_prodc;
        }

        if (descripcion === '') {
            descripcion = 'PRODUCTO_PROCESO_' + proceso + '_' + descripcion2
        }
        //var ingresarcantidad2 = parseFloat(ingresarcantidad);

        $.ajax({
            beforeSend: function () { },
            url: 'procesa_of_cab.php',
            type: 'POST',
            data: {
                tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion,
                cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin,
                nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial, of_padre: of_padre, proceso: proceso, elemento
            },
            success: function (data) {
                //liberar(docentry, 0);

                global = parseInt(data);
                console.log(global);
                migrar_sap(global, 1)
                if (global == 0) {
                    alertify.error("No Inserto");
                } else {
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'procesa_of_det_new.php',
                        type: 'POST',
                        data: { docentry: global, docentry_of: docentry_of, proceso: proceso, cant_planificada: cant_planificada },
                        success: function (data) {
                            var n = noty({
                                text: "Procesando venta...  articulo actual: " + codigo,
                                theme: 'relax',
                                layout: 'topLeft',
                                type: 'success',
                                timeout: 2000,
                            });

                            $("#tabla_articulos > tbody:last").children().remove();


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_apt_det.php',
                        type: 'POST',
                        data: '&doc_of=' + docentry_of + '&proceso=' + proceso + '&items=' + nro_producto + '&cantidad=' + cant_planificada + '&global=' + global,
                        success: function (data) {


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_ofs.php',
                        type: 'POST',
                        data: '&docentry_of=' + prod_cod + '&proceso=' + proceso + '&ingresarcantidad=' + nro_producto + '&cantidad=' + cant_planificada,
                        success: function (data) {




                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'insertar_pt_cola_sap.php',
                        type: 'POST',
                        data: { docentry_of, proceso, nro_of_isograf, elemento },
                        success: function (data) {




                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $("#modal_ver_datos_explo_actu").modal("hide");
                    $("#modalcito_xd2").modal("hide");
                    lista_of_reg()

                }


            },

            error: function (jqXHR, estado, error) {

            },
        });
        i++;
    });
}


function unique(arr) {
    let result = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    return result;
}

function reg_transformar2() {
    $("#modal_transformer_2da").modal("toggle");

    //var cantidad_modificada= $('#tabla_cot > tbody > tr').find('td').eq(13).html()

    var docentry = [];
    var proceso = [];
    var isograf = [];
    var proceso2 = [];
    var cantidad = $('#table_transfor_2da > tbody > tr').find('td').eq(7).html();

    $('#table_transfor_2da > tbody > tr').each(function () {
        // var docentry = $(this).find('td').eq(1).html();
        // var proceso = $(this).find('td').eq(11).html();
        // var isograf = $(this).find('td').eq(12).html();


        docentry.push($(this).find('td').eq(1).html());
        proceso.push($(this).find('td').eq(11).html());
        isograf.push($(this).find('td').eq(12).html());





        doc = unique(docentry);
        iso = unique(isograf);
        proceso2 = unique(proceso);
        //console.log(proceso2);


    });

    $.ajax({
        url: "lista_procesos_OF_2.php",
        type: "POST",
        data: {
            docentry: docentry[0], proceso: proceso2, isograf: isograf[0], cantidad: cantidad
        },
        success: function (x) {
            $("#tabla_muestra_OFS_2da").html(x);
            $("#tablaofs_2da").DataTable({
                order: [[1, 'desc']]
            });

            //cargar_transformer_cab(docentry);
        },
        error: function (jqXHR, estado, error) { },
    });
}




function cargar_transformer_cab(docentry) {
    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#trans_docentry").val(docentry);
            $("#trans_isograf").val(idcl[8]);
            $("#trans_producto").val(idcl[5]);

            $("#trans_tipo").val(idcl[1]);
            $("#trans_estado").val(idcl[2]);
            $("#trans_nroproducto").val(idcl[3]);
            $("#trans_UM").val(idcl[4]);
            $("#trans_cantPlanificada").val(idcl[6]);
            $("#trans_almacen").val(idcl[7]);
            $("#trans_fechaOp").val(idcl[9]);
            $("#trans_fechaInicio").val(idcl[10]);
            $("#trans_fechafin").val(idcl[11]);

        },
        error: function (jqXHR, estado, error) { },
    });
}


function registrar_OFS() {
    i = '0001';

    $("[name='procesos[]']:checked").each(function (key) {
        var docentry_of = $(this).parents("tr").find('td:eq(1)').text();
        var proce_inici = $(this).parents("tr").find('td:eq(2)').text();
        var primeras_tres_letras = proce_inici.substring(0, 3);
        var docentry = docentry_of;
        var proceso = $(this).parents("tr").find('td:eq(19)').text();
        var nro_producto = $(this).parents("tr").find('input[id="codigoItem"]').val();
        var descripcion = $(this).parents("tr").find('input[id="descItem"]').val();
        var cant_planificada = $(this).parents("tr").find('td:eq(5)').text();

        var nro_of_isograf = $(this).parents("tr").find('td:eq(6)').text();
        //var nro_of_isograf = 'PRODUCTO_PROCESO_'+i;
        var tipo = $(this).parents("tr").find('td:eq(7)').text();
        // var estado = $(this).parents("tr").find('td:eq(7)').text();
        var cod_prodc = $(this).parents("tr").find('td:eq(9)').text();
        var primeros_ocho_digitos = cod_prodc.substring(0, 8);
        //console.log(primeros_ocho_digitos);
        var ultimos_cinco_digitos = primeros_ocho_digitos.slice(-5);
        //console.log(ultimos_cinco_digitos);

        var estado = "PP";  //Producto Proceso

        var nro_producto2 = 'PRODUCTO_PROCESO_' + i; //
        var unidad_medida = $(this).parents("tr").find('td:eq(10)').text();
        var descripcion2 = $(this).parents("tr").find('td:eq(11)').text();
        var almacen = $(this).parents("tr").find('td:eq(12)').text();
        var fecha_op = $(this).parents("tr").find('td:eq(13)').text();
        var fecha_inicio = $(this).parents("tr").find('td:eq(14)').text();
        var fecha_fin = $(this).parents("tr").find('td:eq(15)').text();
        var cant_merma = $(this).parents("tr").find('td:eq(16)').text();
        var proce_inicial = $(this).parents("tr").find('td:eq(19)').text();
        var elemento = $(this).parents("tr").find('td:eq(20)').text();
        nueva_cantidad = 0;

        // if (nro_producto === '') {
        //     nro_producto = cod_prodc + proceso
        // }

        if (nro_producto === '') {
            nro_producto = '104' + ultimos_cinco_digitos + '000' + i
        }

        if (primeras_tres_letras === 'ELE') {
            estado = "EL";
        } else {
            estado = "MO";
        }

        if (descripcion === '') {
            descripcion = 'PP' + proceso + '_' + descripcion2
        }
        //var ingresarcantidad2 = parseFloat(ingresarcantidad);

        $.ajax({
            beforeSend: function () { },
            url: 'procesa_of_cab.php',
            type: 'POST',
            data: {
                tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion,
                cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin,
                nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial, of_padre: docentry_of, proceso: 0, elemento
            },
            success: function (data) {
                liberar(docentry, 0);

                global = parseInt(data);
                console.log(global);
                migrar_sap(global, 1)
                if (global == 0) {
                    alertify.error("No Inserto");
                } else {
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'procesa_of_det_new.php',
                        type: 'POST',
                        data: { docentry: global, docentry_of: docentry_of, proceso: proceso, cant_planificada: cant_planificada },
                        success: function (data) {
                            var n = noty({
                                text: "Procesando venta...  articulo actual: " + codigo,
                                theme: 'relax',
                                layout: 'topLeft',
                                type: 'success',
                                timeout: 2000,
                            });

                            $("#tabla_articulos > tbody:last").children().remove();


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_apt_det.php',
                        type: 'POST',
                        data: '&doc_of=' + docentry_of + '&proceso=' + proceso + '&items=' + nro_producto + '&cantidad=' + cant_planificada + '&global=' + global,
                        success: function (data) {


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_ofs.php',
                        type: 'POST',
                        data: '&docentry_of=' + docentry_of + '&proceso=' + proceso + '&ingresarcantidad=' + nro_producto + '&cantidad=' + cant_planificada,
                        success: function (data) {




                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $("#modal_transformer").modal("hide");
                    $("#modal_transformarOP").modal("hide");
                    lista_of_reg()

                }


            },

            error: function (jqXHR, estado, error) {

            },
        });
        i++;
    });
}


function registrar_OFS_demacrado() {
    console.log("hola")
    i = '0001';

    $("[name='procesos_docito[]']:checked").each(function (key) {
        var docentry_of = $(this).parents("tr").find('td:eq(1)').text();
        var docentry = docentry_of;
        var of_padre = $("#of_padre_segda_2").val();
        var proceso = $(this).parents("tr").find('td:eq(19)').text();
        var nro_producto = $(this).parents("tr").find('input[id="codigoItem_2dita"]').val();
        var descripcion = $(this).parents("tr").find('input[id="descItem_2dita"]').val();
        var cant_planificada = $(this).parents("tr").find('td:eq(5)').text();

        var nro_of_isograf = $(this).parents("tr").find('td:eq(6)').text();
        //var nro_of_isograf = 'PRODUCTO_PROCESO_'+i;
        var tipo = $(this).parents("tr").find('td:eq(7)').text();
        // var estado = $(this).parents("tr").find('td:eq(7)').text();
        var cod_prodc = $(this).parents("tr").find('td:eq(9)').text();
        var primeros_ocho_digitos = cod_prodc.substring(0, 8);
        //console.log(primeros_ocho_digitos);
        var ultimos_cinco_digitos = primeros_ocho_digitos.slice(-5);
        //console.log(ultimos_cinco_digitos);

        var estado = "PP";  //Producto Proceso

        var nro_producto2 = 'PRODUCTO_PROCESO_' + i; //
        var unidad_medida = $(this).parents("tr").find('td:eq(10)').text();
        var descripcion2 = $(this).parents("tr").find('td:eq(11)').text();
        var almacen = $(this).parents("tr").find('td:eq(12)').text();
        var fecha_op = $(this).parents("tr").find('td:eq(13)').text();
        var fecha_inicio = $(this).parents("tr").find('td:eq(14)').text();
        var fecha_fin = $(this).parents("tr").find('td:eq(15)').text();
        var cant_merma = $(this).parents("tr").find('td:eq(16)').text();
        var proce_inicial = $(this).parents("tr").find('td:eq(20)').text();
        var elemento = $(this).parents("tr").find('td:eq(21)').text();
        nueva_cantidad = 0;

        // if (nro_producto === '') {
        //     nro_producto = cod_prodc + proceso
        // }

        if (nro_producto === '') {
            nro_producto = '104' + ultimos_cinco_digitos + '000' + i
        }

        if (descripcion === '') {
            descripcion = 'PP_' + proceso + '_' + descripcion2
        }
        //var ingresarcantidad2 = parseFloat(ingresarcantidad);

        $.ajax({
            beforeSend: function () { },
            url: 'procesa_of_cab.php',
            type: 'POST',
            data: {
                tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion,
                cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin,
                nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial, of_padre: of_padre, proceso: proceso, elemento
            },
            success: function (data) {
                //liberar(docentry, 0);

                global = parseInt(data);
                console.log(global);
                migrar_sap(global, 1)
                if (global == 0) {
                    alertify.error("No Inserto");
                } else {
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'procesa_of_det_new.php',
                        type: 'POST',
                        data: { docentry: global, docentry_of: docentry_of, proceso: proceso, cant_planificada: cant_planificada },
                        success: function (data) {
                            var n = noty({
                                text: "Procesando OF...   ",
                                theme: 'relax',
                                layout: 'topLeft',
                                type: 'success',
                                timeout: 2000,
                            });

                            $("#tabla_articulos > tbody:last").children().remove();


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_apt_det.php',
                        type: 'POST',
                        data: '&doc_of=' + docentry_of + '&proceso=' + proceso + '&items=' + nro_producto + '&cantidad=' + cant_planificada + '&global=' + global,
                        success: function (data) {


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_ofs.php',
                        type: 'POST',
                        data: '&docentry_of=' + docentry_of + '&proceso=' + proceso + '&ingresarcantidad=' + nro_producto + '&cantidad=' + cant_planificada,
                        success: function (data) {




                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $("#modal_ver_datos_explo2").modal("hide");
                    $("#modalcito_xd").modal("hide");
                    lista_of_reg()

                }


            },

            error: function (jqXHR, estado, error) {

            },
        });
        i++;
    });
}



function registrar_OFS_2da() {
    i = 1;

    $("[name='procesos2[]']:checked").each(function (key) {
        var docentry_of = $(this).parents("tr").find('td:eq(1)').text();
        var docentry = docentry_of;
        var proceso = $(this).parents("tr").find('td:eq(19)').text();
        var nro_producto = $(this).parents("tr").find('input[id="codigoItem2"]').val();
        var descripcion = $(this).parents("tr").find('input[id="descItem2"]').val();
        var cant_planificada = $(this).parents("tr").find('td:eq(5)').text();

        var nro_of_isograf = $(this).parents("tr").find('td:eq(6)').text();
        //var nro_of_isograf = 'PRODUCTO_PROCESO_'+i;
        var tipo = $(this).parents("tr").find('td:eq(7)').text();
        // var estado = $(this).parents("tr").find('td:eq(7)').text();
        var cod_prodc = $(this).parents("tr").find('td:eq(9)').text();
        var estado = "PP";  //Producto Proceso

        var nro_producto2 = 'PRODUCTO_PROCESO_' + i; //
        var unidad_medida = $(this).parents("tr").find('td:eq(10)').text();
        var descripcion2 = $(this).parents("tr").find('td:eq(11)').text();
        var almacen = $(this).parents("tr").find('td:eq(12)').text();
        var fecha_op = $(this).parents("tr").find('td:eq(13)').text();
        var fecha_inicio = $(this).parents("tr").find('td:eq(14)').text();
        var fecha_fin = $(this).parents("tr").find('td:eq(15)').text();
        var cant_merma = $(this).parents("tr").find('td:eq(16)').text();
        var proce_inicial = $(this).parents("tr").find('td:eq(19)').text();
        nueva_cantidad = 0;

        if (nro_producto === '') {
            nro_producto = cod_prodc + proceso
        }
        if (descripcion === '') {
            descripcion = 'PRODUCTO_PROCESO_' + proceso
        }
        //var ingresarcantidad2 = parseFloat(ingresarcantidad);

        $.ajax({
            beforeSend: function () { },
            url: 'procesa_of_cab.php',
            type: 'POST',
            data: { tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion, cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial },
            success: function (data) {
                liberar(docentry, 0);

                global = parseInt(data);
                //console.log(global);
                migrar_sap(global, 1)
                if (global == 0) {
                    alertify.error("No Inserto");
                } else {
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'procesa_of_det_new.php',
                        type: 'POST',
                        data: { docentry: global, docentry_of: docentry_of, proceso: proceso, cant_planificada: cant_planificada },
                        success: function (data) {
                            var n = noty({
                                text: "Procesando venta...  articulo actual: " + codigo,
                                theme: 'relax',
                                layout: 'topLeft',
                                type: 'success',
                                timeout: 2000,
                            });

                            $("#tabla_articulos > tbody:last").children().remove();


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });




                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_apt_det.php',
                        type: 'POST',
                        data: '&doc_of=' + docentry_of + '&proceso=' + proceso + '&items=' + nro_producto + '&cantidad=' + cant_planificada + '&global=' + global,
                        success: function (data) {


                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $.ajax({
                        beforeSend: function () {
                        },
                        url: 'inserta_ofs.php',
                        type: 'POST',
                        data: '&docentry_of=' + docentry_of + '&proceso=' + proceso + '&ingresarcantidad=' + nro_producto + '&cantidad=' + cant_planificada,
                        success: function (data) {




                        },
                        error: function (jqXHR, estado, error) {
                            $("#errores").html('Error... ' + estado + '  ' + error);
                        }
                    });
                    $("#modal_transformer_2da").modal("hide");
                    $("#modal_transformarOP2").modal("hide");
                    lista_of_reg()

                }


            },

            error: function (jqXHR, estado, error) {

            },
        });
        i++;
    });



}




function transformar_apt(docentry, tipo, nro_iso, of_padre, elemento) {
    $("#modal_apt").modal("toggle");

    $("#apt_element").val(elemento)
    console.log(elemento);
    $.ajax({
        url: "lista_procesos_apt.php",

        type: "POST",
        data: {
            docentry
        },
        success: function (x) {
            cargar_cab_apts(docentry, tipo, of_padre);
            $("#tabla_apt_modal").html(x);
            $("#tablaapt").DataTable({
                order: [[0, 'asc']]
            });


        },
        error: function (jqXHR, estado, error) { },
    });
}

function transformar_apt_pt(nro_iso, tipo) {
    $("#modal_apt").modal("toggle");

    $.ajax({
        url: "lista_procesos_apt_pt.php",

        type: "POST",
        data: {
            nro_iso
        },
        success: function (x) {
            cargar_cab_apts_pt(nro_iso, tipo);
            $("#tabla_apt_modal").html(x);
            $("#tablaapt").DataTable({
                order: [[0, 'asc']]
            });


        },
        error: function (jqXHR, estado, error) { },
    });
}
function cargar_cab_apts_pt(nro_iso, tipo) {
    $.ajax({
        url: "buscar_data_of_pt.php",

        type: "POST",
        data: {
            nro_iso, tipo
        },
        success: function (x) {
            console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#apt_docentry").val(idcl[0]);
            $("#apt_isograf").val(idcl[8]);
            $("#apt_producto").val(idcl[5]);

            $("#apt_tipo").val(idcl[1]);
            $("#apt_estado").val(idcl[2]);
            $("#apt_nroproducto").val(idcl[3]);
            $("#apt_UM").val(idcl[4]);
            // $("#apt_cantPlanificada").val(idcl[6]);
            $("#apt_almacen").val(idcl[7]);
            $("#apt_fechaOp").val(idcl[9]);
            $("#apt_fechaInicio").val(idcl[10]);
            $("#apt_fechafin").val(idcl[11]);
            $("#apt_merma").val(idcl[12]);
            $("#apt_cantPlanificada").val(idcl[13]);
        },
        error: function (jqXHR, estado, error) { },
    });
}
function cargar_cab_apts(docentry, tipo, of_padre) {
    $.ajax({
        url: "buscar_data_of.php",

        type: "POST",
        data: {
            docentry, tipo
        },
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#doc_of_padre").val(of_padre);
            $("#apt_docentry").val(docentry);
            $("#apt_isograf").val(idcl[8]);
            $("#apt_producto").val(idcl[5]);

            $("#apt_tipo").val(idcl[1]);
            $("#apt_estado").val(idcl[2]);
            $("#apt_nroproducto").val(idcl[3]);
            $("#apt_UM").val(idcl[4]);
            // $("#apt_cantPlanificada").val(idcl[6]);
            $("#apt_almacen").val(idcl[7]);
            $("#apt_fechaOp").val(idcl[9]);
            $("#apt_fechaInicio").val(idcl[10]);
            $("#apt_fechafin").val(idcl[11]);
            $("#apt_merma").val(idcl[12]);
            $("#apt_cantPlanificada").val(idcl[13]);
        },
        error: function (jqXHR, estado, error) { },
    });
}


function reg_apts() {

    nro_of_isograf = $("#apt_isograf").val();
    // docentry_of = $("#apt_docentry").val();
    tipo = $("#apt_tipo").val();
    estado = "PT";
    nro_producto = $("#apt_nroproducto").val();
    unidad_medida = $("#apt_UM").val();
    descripcion = $("#apt_producto").val();
    cant_planificada = $("#apt_cantPlanificada").val();
    almacen = $("#apt_almacen").val();
    fecha_op = $("#apt_fechaOp").val();
    fecha_inicio = $("#apt_fechaInicio").val();
    fecha_fin = $("#apt_fechafin").val();
    cant_merma = $("#apt_merma").val();
    nueva_cantidad = 0;
    band = true;
    proce_inicial = '';
    elemento = $("#apt_element").val();
    if (band === true) {
        $.ajax({
            beforeSend: function () {
            },
            // url: 'inserta_apt_cab.php',
            url: 'procesa_of_cab.php',
            type: 'POST',
            data: { tipo: tipo, estado: estado, nro_producto: nro_producto, unidad_medida: unidad_medida, descripcion: descripcion, cant_planificada: cant_planificada, almacen: almacen, fecha_op: fecha_op, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, nro_of_isograf: nro_of_isograf, cant_merma: cant_merma, nueva_cantidad: nueva_cantidad, proce_inicial: proce_inicial, of_padre: 1, proceso: 0, elemento },

            success: function (x) {
                global = parseInt(x);
                console.log(global);
                //$("#num_tick_act").val(global);
                $("#apt_nombre").val("");

                $("#modal_apt").modal("hide");


                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso',
                    text: 'La OF fue registrada.',
                    showConfirmButton: false, // Oculta el botón "Aceptar"
                    timer: 2000
                }).then(function () {
                    // Actualizar la página
                    // location.reload();

                });


                if (global == 0) {
                    alertify.error("No Inserto");

                } else {
                    $('#tablaapt > tbody > tr').each(function () {
                        // linea = $(this).find('td').eq(0).html()
                        // lina2 = linea;
                        // var line = parseInt(linea);

                        var doc_of = $(this).find('td').eq(0).html();
                        var proceso = $(this).find('td').eq(4).html();
                        var items = $(this).find('td').eq(2).html();
                        var cantidad = $(this).find('td').eq(3).html();


                        $.ajax({
                            beforeSend: function () {
                            },
                            url: 'inserta_apt_det.php',
                            type: 'POST',
                            data: '&doc_of=' + doc_of + '&proceso=' + proceso + '&items=' + items + '&cantidad=' + cantidad + '&global=' + global,
                            success: function (data) {
                                var n = noty({
                                    text: "Procesando venta...  articulo actual: " + codigo,
                                    theme: 'relax',
                                    layout: 'topLeft',
                                    type: 'success',
                                    timeout: 2000,
                                });



                            },
                            error: function (jqXHR, estado, error) {
                                $("#errores").html('Error... ' + estado + '  ' + error);
                            }
                        });
                    });
                    //aca puedo poner para que liste
                    lista_of_reg();
                    migrar_sap(global, 1)

                }
            },
            error: function (jqXHR, estado, error) {
                $("#errores").html('Error... ' + estado + '  ' + error);
            }
        });
    }
}




function liberar(docentry, sapdocentry) {
    //console.log(docentry)
    $.ajax({
        url: "update_estados.php",

        type: "POST",
        data: {
            docentry,
        },
        success: function (x) {
            lista_of_reg();
            if (sapdocentry > 0) {
                migrar_sap(sapdocentry, 2)
            }

        },
        error: function (jqXHR, estado, error) { },
    });
}



function cargar_prod_cod(i2) {
    $("#modal_busqueda_artsItems").modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    $("#doc_prod").val(i2)
    $('#modal_busqueda_artsItems').on('shown.bs.modal', function () {
        $("#lista_articulosItem").html("");
        $("#articulo_buscarItem").val("");
        $("#articulo_buscarItem").focus();
    });

    /*  $('#tablaofs > tbody > tr').parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true) */

}


function buscaItem() {

    data_buscar = $("#articulo_buscarItem").val();
    var data = data_buscar.split("//");

    if (data_buscar === '') {
        datasupcatname = ''
        data_descripcion = ''
    }

    if (data.length == 1) {
        datasupcatname = data[0]
        data_descripcion = ''
    }
    if (data.length == 2) {
        datasupcatname = data[0]
        data_descripcion = data[1]
    }

    //console.log(data);
    $.ajax({
        beforeSend: function () {
            $("#lista_articulosItem").html("");
        },
        url: "prueba_item.php",
        type: "POST",
        data: {
            descripcion: data_descripcion,
            supcatname: datasupcatname,
        },
        success: function (x) {
            $("#lista_articulosItem").html(x);
            $("#tabla_art_item").DataTable();
        },
        error: function (jqXHR, estado, error) {
            $("#lista_articulosItem").html(
                "Error en la peticion AJAX..." + estado + "      " + error
            );
        },
    });

}


$(document).on("click", "#tabla_art_item tbody tr", function () {

    var checkbox = $(this).find("#item_check");

    checkbox.prop("checked", !checkbox.prop("checked"));

    actualizarFilaItem(checkbox);

});



function actualizarFilaItem(checkbox) {
    // Desactivar todos los otros checkboxes en la misma tabla
    $('#tabla_art_item tbody tr').find("#item_check").not(checkbox).prop('checked', false).closest("tr").css("background-color", "white");

    // Obtener la fila asociada al checkbox
    var $row = checkbox.closest("tr");

    // Realizar la acción deseada al activar el checkbox
    if (checkbox.is(":checked")) {
        $row.css("background-color", "LightGreen");

    } else {
        $row.css("background-color", "white");

    }

    // Obtener la cantidad de checkboxes activados
    var cant = $('#tabla_art_item tbody tr').find("#item_check:checked").length;

    if (cant > 0) {
        $("#enviar_item").removeClass("disabledTab").addClass("activeTab");
    } else {
        $("#enviar_item").removeClass("activeTab").addClass("disabledTab");
    }
}



// $(document).on('click', '#item_check', function () {
//     // Obtener la fila asociada al checkbox
//     var $row = $(this).closest("tr");

//     // Desactivar todos los otros checkboxes y cambiar el color de sus filas a blanco
//     $('input[type="checkbox"]').not(this).prop('checked', false).closest("tr").css("background-color", "white");

//     // Realizar la acción deseada al activar el checkbox
//     if ($(this).is(':checked')) {
//         $row.css("background-color", "LightGreen");
//         $('#enviar_item').prop('disabled', false);
//     } else {
//         $row.css("background-color", "white");
//         $('#enviar_item').prop('disabled', true);
//     }
// });




function add_art_add_items() {
    $("#modal_busqueda_artsItems").modal("toggle");
    let line = [];

    $('#tabla_art_item input[type="checkbox"]:checked').each(function (e) {
        codigo = $(this).closest("tr").children("td:eq(1)").text();
        line.push(codigo)
    });
    codigo = line.toString();

    $('#codigo_item').val(codigo);
    // console.log(codigo);
    busca_articulo_add_Item();

}


function busca_articulo_add_Item() {
    var codigo = $("#codigo_item").val().toString()

    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#data_articulo").html("Buscando informacion del articulo...");
            },
            url: 'prueba_item_datos.php',
            type: 'POST',
            data:
            {
                codigo: codigo
            },
            success: function (data) {
                $("#enviar_item").removeClass("activeTab");
                $("#enviar_item").addClass("disabledTab");

                // console.log(data);

                if (data == 0) {
                    var n = noty({
                        text: "No existe el articulo...!",
                        theme: 'relax',
                        layout: 'center',
                        type: 'error',
                        timeout: 2000,
                    });
                } else {

                    var client = data;

                    var idcl = client.split("|");
                    var itemCode = idcl[0];
                    var itemName = idcl[1];
                    xd = $("#doc_prod").val();

                    $($("#tablaofs").find("tbody > tr")[xd]).children("td")[3].children[0].value = itemCode;
                    $($("#tablaofs").find("tbody > tr")[xd]).children("td")[4].children[0].value = itemName;

                    $($("#tablaofs").find("tbody > tr")[xd]).css("background-color", "LightGreen");
                    document.getElementById('btn_ofs').disabled = false
                    $($('#tablaofs > tbody > tr').eq(xd).find('td:eq(0) input[type="checkbox"]')).prop("checked", true);



                    /*  $('#tablaofs > tbody > tr').find("td").find('input[id="codigoItem"]').val(itemCode);
 
                     $('#tablaofs > tbody > tr').find("td").find('input[id="descItem"]').val(itemName); */



                    // if (itemCode.length > 0) {

                    //     $('#tablaofs > tbody > tr').parents("tr").find("td").css("background-color", "LightGreen");
                    //     document.getElementById('btn_ofs').disabled = false
                    //     $('#tablaofs > tbody > tr').parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", true)

                    // } else {
                    //     $('#tablaofs > tbody > tr').closest("tr").find("td").css("background-color", "");
                    //     document.getElementById('btn_ofs').disabled = true;
                    //     $('#tablaofs > tbody > tr').parents("tr").find('td:eq(0) input[type="checkbox"]').prop("checked", false)

                    // }


                }
            },

            error: function (jqXHR, estado, error) {
                // GERSON: AGREGANDO VALIDACION VISUAL - Plugins=>Noty
                var n = noty({
                    text: "Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!",
                    theme: 'relax',
                    layout: 'center',
                    type: 'error',
                    timeout: 2000,
                });
                //            alert("Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!");
            }
        });
    });

}

function mostrar_modal_error(error) {
    console.log(error[0]);

    swal({
        title: "Errores Migracion ",
        content: {
            element: "div",
            attributes: {
                innerHTML: "<strong>Error:</strong> " + error[0].error_factura
            },
        }
    });
}
function mostrar_modal_error_1(error) {
    //console.log(error[0]);

    swal({
        title: "Errores Migracion ",
        content: {
            element: "div",
            attributes: {
                innerHTML: "<strong>Error:</strong> " + error[0].error_factura
            },
        }
    });
}

function mapa_relaciones(docentry, docentry_cab) {
    $("#modalmapa").modal("show");
    $.ajax({
        url: "mapa_relaciones.php",
        type: "POST",
        dataType: "json",
        data: {
            docentry: docentry,
        },
        success: function (x) {
            $("#drawflow").html(x);

            var id = document.getElementById("drawflow");
            var editor = new Drawflow(id);
            editor.reroute = true;

            let cotizaciones = [];
            let posX = 300;
            // El primer elemento es el principal
            let cotizacionPrincipal = {
                id: 1,
                name: "Cotizacion1",
                data: {},
                class: "welcome",
                html:
                    '\n<div>\n' +
                    '  <div class="title-box">📝 Elemento</div>\n' +
                    '  <div class="box">\n' +
                    '    🔑<b>ISOGRAF: ' + x[0].isograf + '</b><br>\n' +
                    '    🔑<b>SAP: ' + x[0].doc_sap + '</b><br>\n' +
                    '    <br>\n' +
                    '    📝 ' + x[0].descri + '<br>\n' +
                    '    <br>\n' +
                    '    📅 ' + x[0].fecha_coti + '<br>\n' +
                    '    📥 ' + x[0].total_coti + ' -<br>\n' +
                    '    <br>\n' +
                    '  </div>\n' +
                    '</div>\n',
                typenode: false,
                inputs: {},
                outputs: {
                    output_1: {
                        connections: [] // Sin conexiones salientes al inicio
                    },
                },
                pos_x: 50,
                pos_y: 50
            };
            cotizaciones.push(cotizacionPrincipal);

            for (let i = 1; i < x.length; i++) {
                let cotizacion = {
                    id: i + 1,
                    name: "Cotizacion" + (i + 1),
                    data: {},
                    class: "welcome",
                    html:
                        '\n<div>\n' +
                        '  <div class="title-box">📝 Elemento</div>\n' +
                        '  <div class="box">\n' +
                        '    🔑<b>ISOGRAF: ' + x[i].isograf + '</b><br>\n' +
                        '    🔑<b>SAP: ' + x[i].doc_sap + '</b><br>\n' +
                        '    <br>\n' +
                        '    📝 ' + x[i].descri + '<br>\n' +
                        '    <br>\n' +
                        '    📅 ' + x[i].fecha_coti + '<br>\n' +
                        '    📥 ' + x[i].total_coti + ' -<br>\n' +
                        '    <br>\n' +
                        '  </div>\n' +
                        '</div>\n',
                    typenode: false,
                    inputs: {
                        input_1: { connections: [{ node: 1, input: "output_1" }] } // Conexión al primer elemento
                    },
                    outputs: {
                        output_1: {
                            connections: []
                        },
                    },
                    pos_x: 300,
                    pos_y: 50 * i // Ajustar la posición y para evitar superposición
                };
                cotizaciones.push(cotizacion);
            }

            $.ajax({
                url: "mapa_relaciones2.php",
                type: "POST",
                dataType: "json",
                data: {
                    docentry: docentry,
                },
                success: function (y) {
                    for (let j = 0; j < y.length; j++) {
                        if (y[j].tipo === 'EL-PT') {
                            let pedido = {

                                id: cotizaciones.length + 1, // Ajusta el id para evitar duplicados
                                name: "Pedido" + (j + 1),
                                data: {},
                                class: "welcome",
                                html:
                                    '\n<div>\n' +
                                    '  <div class="title-box">📝 Elemento PT</div>\n' +
                                    '  <div class="box">\n' +
                                    '    🔑<b>ISOGRAF: ' + y[j].isograf + '</b><br>\n' +
                                    '    🔑<b>SAP: ' + y[j].doc_sap + '</b><br>\n' +
                                    '    <br>\n' +
                                    '    📝 ' + y[j].descri + '<br>\n' +
                                    '    <br>\n' +
                                    '    📅 ' + y[j].fecha_coti + '<br>\n' +
                                    '    📥 ' + y[j].total_coti + ' -<br>\n' +
                                    '    <br>\n' +
                                    '  </div>\n' +
                                    '</div>\n',
                                typenode: false,
                                inputs: {
                                    input_1: { connections: [{ node: 1, input: "output_1" }] } // Conexión al primer elemento
                                },
                                outputs: {
                                    output_1: { connections: [] }, // Sin conexiones salientes
                                },
                                pos_x: 600,
                                pos_y: 50 * j // Ajustar la posición y para evitar superposición

                            };
                            cotizaciones.push(pedido);
                            // elementosPT(currentId, y[j].doc_coti, y[j].tipo, posX + 300, localPosY);



                        }
                        if (y[j].tipo === 'EL') {
                            let pedido = {

                                id: cotizaciones.length + 1, // Ajusta el id para evitar duplicados
                                name: "Pedido" + (j + 1),
                                data: {},
                                class: "welcome",
                                html:
                                    '\n<div>\n' +
                                    '  <div class="title-box">📝 Elemento</div>\n' +
                                    '  <div class="box">\n' +
                                    '    🔑<b>ISOGRAF: ' + y[j].isograf + '</b><br>\n' +
                                    '    🔑<b>SAP: ' + y[j].doc_sap + '</b><br>\n' +
                                    '    <br>\n' +
                                    '    📝 ' + y[j].descri + '<br>\n' +
                                    '    <br>\n' +
                                    '    📅 ' + y[j].fecha_coti + '<br>\n' +
                                    '    📥 ' + y[j].total_coti + ' -<br>\n' +
                                    '    <br>\n' +
                                    '  </div>\n' +
                                    '</div>\n',
                                typenode: false,
                                inputs: {
                                    input_1: { connections: [{ node: 1, input: "output_1" }] } // Conexión al primer elemento
                                },
                                outputs: {
                                    output_1: { connections: [] }, // Sin conexiones salientes
                                },
                                pos_x: 600,
                                pos_y: 50 * j // Ajustar la posición y para evitar superposición
                            };

                            cotizaciones.push(pedido);
                            $.ajax({
                                url: "mapa_relaciones3.php",
                                type: "POST",
                                dataType: "json",
                                data: {
                                    docentry: docentry,
                                },
                                success: function (z) {
                                    // console.log(z);

                                    for (let k = 0; k < z.length; k++) {
                                        doc_of = z[k].doc_coti;

                                        let pp = {

                                            id: cotizaciones.length + k + 1, // Ajusta el id para evitar duplicados
                                            name: "Pedido" + (k + 1),
                                            data: {},
                                            class: "welcome",
                                            html:
                                                '\n<div>\n' +
                                                '  <div class="title-box">📝 Elemento</div>\n' +
                                                '  <div class="box">\n' +
                                                '    🔑<b>ISOGRAF: ' + z[k].isograf + '</b><br>\n' +
                                                '    🔑<b>SAP: ' + z[k].doc_sap + '</b><br>\n' +
                                                '    <br>\n' +
                                                '    📝 ' + z[k].descri + '<br>\n' +
                                                '    <br>\n' +
                                                '    📅 ' + z[k].fecha_coti + '<br>\n' +
                                                '    📥 ' + z[k].total_coti + ' -<br>\n' +
                                                '    <br>\n' +
                                                '  </div>\n' +
                                                '</div>\n',
                                            typenode: false,
                                            inputs: {
                                                input_1: { connections: [{ node: pedido.id, input: "output_1" }] } // Conexión al nodo pedido
                                            },
                                            outputs: {
                                                output_1: { connections: [] }, // Sin conexiones salientes
                                            },
                                            pos_x: 900,
                                            pos_y: 75 * k // Ajustar la posición y para evitar superposición

                                        };
                                        cotizaciones.push(pp);
                                        // console.log(z[k].isograf);
                                        $.ajax({

                                            url: "mapa_relaciones4.php",
                                            type: "POST",
                                            dataType: "json",
                                            data: {
                                                doc_of: doc_of,
                                            },
                                            success: function (a) {
                                                //   console.log(a);
                                                xz = 1;
                                                // if (z[0].doc_sap ==null) {

                                                // }else{
                                                for (let l = 0; l < a.length; l++) {
                                                    if (a[l].doc_coti === null) {

                                                    } else {
                                                        let entrega = {
                                                            id: cotizaciones.length + 60, // Ajusta el id para evitar duplicados
                                                            name: "Entrega" + (l + 1),
                                                            data: {},
                                                            class: "welcome",
                                                            html:
                                                            '\n<div>\n' +
                                                            '  <div class="title-box">📝 Entrega</div>\n' +
                                                            '  <div class="box">\n' +
                                                            '    🔑<b>ISOGRAF: ' + a[l].isograf + '</b><br>\n' +
                                                            '    🔑<b>SAP: ' + a[l].doc_sap + '</b><br>\n' +
                                                            '    <br>\n' +
                                                            '    📝 ' + a[l].descri + '<br>\n' +
                                                            '    <br>\n' +
                                                            '    📅 ' + a[l].fecha_coti + '<br>\n' +
                                                            '    📥 ' + a[l].total_coti + ' -<br>\n' +
                                                            '    <br>\n' +
                                                            '  </div>\n' +
                                                            '</div>\n',
                                                            typenode: false,
                                                            inputs: {
                                                                input_1: { connections: [{ node: pp.id, input: "output_1" }] },

                                                            },
                                                            outputs: {
                                                                // output_1: { connections: [{ node:  a.length, output: "input_1" }] },

                                                                // connections: []

                                                            },
                                                            pos_x: 1200,
                                                            pos_y: 75 * l
                                                        };
                                                        cotizaciones.push(entrega);
                                                        xz++;
                                                    }

                                                    // }
                                                }


                                            },
                                            error: function (jqXHR, estado, error) { },
                                        });

                                        $.ajax({

                                            url: "mapa_relaciones5.php",
                                            type: "POST",
                                            dataType: "json",
                                            data: {
                                                doc_of: doc_of,
                                            },
                                            success: function (b) {
                                                //   console.log(b);
                                                xz = 1;
                                                // if (z[0].doc_sap ==null) {

                                                // }else{
                                                for (let m = 0; m < b.length; m++) {
                                                    if (b[m].doc_coti === null) {

                                                    } else {
                                                        let recibo = {
                                                            id: cotizaciones.length + 60, // Ajusta el id para evitar duplicados
                                                            name: "Recibo" + (m + 1),
                                                            data: {},
                                                            class: "welcome",
                                                            html:
                                                            '\n<div>\n' +
                                                            '  <div class="title-box">📝 Recibo</div>\n' +
                                                            '  <div class="box">\n' +
                                                            '    🔑<b>ISOGRAF: ' + b[m].isograf + '</b><br>\n' +
                                                            '    🔑<b>SAP: ' + b[m].doc_sap + '</b><br>\n' +
                                                            '    <br>\n' +
                                                            '    📝 ' + b[m].descri + '<br>\n' +
                                                            '    <br>\n' +
                                                            '    📅 ' + b[m].fecha_coti + '<br>\n' +
                                                            '    📥 ' + b[m].total_coti + ' -<br>\n' +
                                                            '    <br>\n' +
                                                            '  </div>\n' +
                                                            '</div>\n',
                                                            typenode: false,
                                                            inputs: {
                                                                input_1: { connections: [{ node: pp.id, input: "output_1" }] },

                                                            },
                                                            outputs: {
                                                                // output_1: { connections: [{ node:  a.length, output: "input_1" }] },

                                                                connections: []

                                                            },
                                                            pos_x: 1200,
                                                            pos_y: 75 * m
                                                        };
                                                        cotizaciones.push(recibo);
                                                        xz++;
                                                    }

                                                    // }
                                                }


                                            },
                                            error: function (jqXHR, estado, error) { },
                                        });
                                    }
                                },
                                error: function (jqXHR, estado, error) {
                                    // Maneja los errores aquí
                                },
                            });

                        }


                    }

                    // // Actualizar las conexiones del primer elemento
                    // cotizaciones[0].outputs.output_1.connections = cotizaciones.slice(1).map((_, index) => ({
                    //     node: index + 2, // Id del nodo conectado
                    //     output: "input_1"
                    // }));

                    // // Renderizar los nodos en el editor
                    // editor.drawflow.drawflow.Home.data = cotizaciones.reduce((acc, node) => {
                    //     acc[node.id] = node;
                    //     // return acc;
                    // }, {});

                    editor.start();
                    editor.drawflow.drawflow.Home.data = cotizaciones;
                    // console.log(cotizaciones);



                    setTimeout(() => {
                        editor.start();
                    }, 500);


                },
                error: function (jqXHR, estado, error) {
                    // Maneja los errores aquí
                },
            });
        },
        error: function (jqXHR, estado, error) {
            // Maneja los errores aquí
        },
    });
}

function reportetutnoPDF () {
    $("#modal_eventos_pdf").modal("toggle");
      

}
