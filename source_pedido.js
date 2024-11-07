function busqueda_Producto() {
    //   var IdOri = $("#IdOri option:selected").val();
    //   var IdDest = $("#IdDest option:selected").val();
    //   var idTipo = $("#idTipo option:selected").val();

    //     $("#modal_busqueda_arts2").on("shown.bs.modal", function () {
    //       $("#lista_articulos").html("");
    //       // $("#cantidad").val("");
    //       $("#cantidad").focus();
    //     });
    //   // }
    //   lista_marca();
    //   $("#modal_busqueda_arts").modal({
    //     show: true,
    //     backdrop: "static",
    //     keyboard: false,
    //   });
    // }
    var idTipo = $("#idTipo option:selected").val();
    if (idTipo.trim() == "") {
        swal({
            title: "Error!",
            text: "Falta Elegir Tipo!",
            type: "error",
            showCancelButton: false,
        });

    } else {

        if (idTipo.trim() == "S") {
            $("#modal_busqueda_servcio").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
            $("#servicio_desc").focus();
            //  lista_ccosto2();

        } else {
            $("#modal_busqueda_arts").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
            $('#modal_busqueda_arts2').on('shown.bs.modal', function () {
                $("#lista_articulos").html("");
                // $("#cantidad").val("");
                $("#cantidad").focus();

            });
            listas_of_iso()
            //lista_ccosto();
            ver_disp_tabla()
            $("#lista_articulos").html();
            //$('#idTipo').prop('disabled', true);
        }
    }
}
function ver_disp_tabla() {
    tipo = $('#idTipo').val();
    if ($('#tabla_articulos tbody tr').length > 0) {
        $('#idTipo').prop('disabled', true);
        $('.data_servicio').show();
        // if (tipo==="S") {

        // }        
    } else {
        $('#idTipo').prop('disabled', false);
        $('.data_servicio').show();
        // if (tipo==="S") {
        //     $('.data_servicio').show();  
        // }
    }
}
/************************************************************************************/
function listar_solicitante() {

    $.ajax({
        beforeSend: function () {
            // $("#lista_articulos").html("<img src='dist/img/default.gif'></img>");
        },
        url: "listar_solicitante.php",
        type: "POST",
        data: {

        },
        success: function (x) {
            name = x.trim()
            $("#soli").val(name);
        },
        error: function (jqXHR, estado, error) {
        },
    });
}
/************************************************************************************/

function busquedamanual() {
    $("#modal_busqueda_arts").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
    });
}

function busquedaenlazada() {
    $("#modal_busqueda_enlazada").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
    });

    var doc = $("#lista_of option:selected").val();

    $.ajax({
        beforeSend: function () { },
        url: "articulos_soli_enlazado.php",
        type: "POST",
        data: { doc: doc },
        success: function (x) {
            $("#lista_enlazada").html(x);
        },
        error: function (jqXHR, estado, error) {
            $("#lista_enlazada").html(
                "Error en la peticion AJAX..." + estado + "      " + error
            );
        },
    });
}

$(document).on("click", "#procesar", function () {
    if ($(this).is(":checked")) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
    }
});

$(document).on("click", "#ingresarCant", function () {
    var valor = $(this).val();

    $(this).parents("tr").find("td").css("background-color", "LightGreen");

    $(this)
        .parents("tr")
        .find('td:eq(0) input[type="checkbox"]')
        .prop("checked", true);

    numx = $(this).parents("tr").find("td:eq(6)").text();
    numx = parseFloat(numx);
    numx = isNaN(numx) ? 0 : Math.abs(numx);
    num2 = $(this).parents("tr").find('input[type="number"]').val();

    if (parseFloat(valor) > numx) {
        alertify.error("El valor ingresado no puede ser mayor que " + numx);
    }
    $("#btn-pro").show();
});

$(document).on("keyup", "#ingresarCant", function () {
    var valor = $(this).val();

    if (valor.length > 0) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        $("#btn-pro").show();
        $(this)
            .parents("tr")
            .find('td:eq(0) input[type="checkbox"]')
            .prop("checked", true);
        num = $(this).parents("tr").find("td:eq(6)").text();
        num = parseFloat(num);
        num = isNaN(num) ? 0 : Math.abs(num);
        num2 = $(this).parents("tr").find('input[type="number"]').val();

        if (parseFloat(valor) > num) {
            alertify.error("El valor ingresado no puede ser mayor que " + num);
        }
    } else {
        $(this).closest("tr").find("td").css("background-color", "");
        $(this)
            .parents("tr")
            .find('td:eq(0) input[type="checkbox"]')
            .prop("checked", false);
        $("#btn-pro").hide();
    }
});

/************************************************************************************/
function buscaarticulocompras() {
    data_buscar = $("#articulo_buscar").val().toUpperCase();

    nro_iso = $("#id_iso select").val().toString();
    if (nro_iso !== "") {
        $.ajax({
            beforeSend: function () {
                // $("#lista_articulos").html("<img src='dist/img/default.gif'></img>");
            },
            url: "busca_data_articulo_trasla_iso.php",
            type: "POST",
            data: {
                nro_iso
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
    } else {
        var data = data_buscar.split("//");
        //   firname = $("#listar_marca_art select").val();

        if (data_buscar === '') {
            datasupcatname = ''
            data_descripcion = ''
            data_codigo = ''
        }

        if (data.length == 1) {
            data_descripcion = data[0]
            datasupcatname = ''
            data_codigo = ''
        }
        if (data.length == 2) {
            data_descripcion = data[0]
            datasupcatname = data[1]
            data_codigo = ''
        }
        if (data.length == 3) {
            data_descripcion = data[0]
            datasupcatname = data[1]

            data_codigo = data[2]
        }
        $.ajax({
            beforeSend: function () {
                // $("#lista_articulos").html("<img src='dist/img/default.gif'></img>");
            },
            url: "busca_data_articulo_trasla.php",
            type: "POST",
            data: {
                descripcion: data_descripcion,
                //   firname: firname,
                supcatname: datasupcatname,
                data_codigo: data_codigo
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

}
/************************************************************************************/
function buscaserviciocompras() {
    data_buscar = $("#servicio_buscar").val().toUpperCase();
    var data = data_buscar.split("//");
    //   firname = $("#listar_marca_art select").val();

    if (data_buscar === '') {
        datasupcatname = ''
        data_descripcion = ''
        data_codigo = ''
    }

    if (data.length == 1) {
        datasupcatname = data[0]
        data_descripcion = ''
        data_codigo = ''
    }
    if (data.length == 2) {
        datasupcatname = data[0]
        data_descripcion = data[1]
        data_codigo = ''
    }
    if (data.length == 3) {
        datasupcatname = data[0]
        data_descripcion = data[1]
        data_codigo = data[2]
    }
    $.ajax({
        beforeSend: function () {
            // $("#lista_articulos").html("<img src='dist/img/default.gif'></img>");
        },
        url: "busca_data_servicio_trasla.php",
        type: "POST",
        data: {
            descripcion: data_descripcion,
            //   firname: firname,
            supcatname: datasupcatname,
            data_codigo: data_codigo
        },
        success: function (x) {
            $("#lista_servi").html(x);
            $("#tabla_servi").DataTable();
        },
        error: function (jqXHR, estado, error) {
            $("#lista_articulos").html(
                "Error en la peticion AJAX..." + estado + "      " + error
            );
        },
    });
}
/************************************************************************************/
function add_art2(art) {
    //alert(art);
    $("#modal_busqueda_arts2").modal("toggle");
    $("#codigo").val(art.trim());
    $("#stock").val("");

    busca_articulo2();
    Lista_almacenOrigbe();
    Lista_almacenDestino();

    // busqueda_art2();
}
/************************************************************************************/
function busca_articulo2() {
    $(document).ready(function () {
        var cod = $("#codigo").val().trim();
        //  var descrip=$("#articulo_desc").val().trim();
        //  var UMCompra=$("#UMCompra").val().trim();
        // var tipcli=$("#tipocliente").val().trim();
        if (cod.trim() != "") {
            $(document).ready(function () {
                $.ajax({
                    beforeSend: function () {
                        $("#data_articulo").html("Buscando informacion del articulo...");
                    },
                    url: "busca_data_articulo_compras.php",
                    dataType: "json",
                    type: "POST",
                    data:
                    //PERMITE HACER MULTIPLE CONSULTA GC
                    {
                        codigo: $("#codigo").val(),
                        codigolp: $("#codigolp").val(),
                        idcliente_credito: $("#idcliente_credito").val(),
                    },
                    //              'codigo='+$("#codigo").val(),
                    success: function (data) {
                        console.log(data);
                        console.log("ffff");
                        if (data == 0) {
                            //            alert("No existe el articulo...!");
                            var n = noty({
                                text: "No existe el articulo...!",
                                theme: "relax",
                                layout: "center",
                                type: "error",
                                timeout: 2000,
                            });
                            $("#codigo").val("");
                            $("#codigo").focus();
                            $("#cantidad").attr("disabled", true);
                            $("#cantidad").val(0.0);
                            $("#dsctoline").attr("disabled", true);
                            $("#dsctoline").val(0.0);
                            $("#monedaitem").attr("disabled", true);
                            $("#monedaitem").val("");
                            //$("#preciou").attr("disabled", true);
                            $("#preciou").val(0.0);
                            $("#preciouigv").attr("disabled", true);
                            $("#preciouigv").val(0.0);
                            //  $("#articulo_desc").html("");
                            $("#articulo_desc").val("");
                            $("#UMCompras").val("");
                            $(".exis").html(0);
                            $(".preciol").html(0.0);
                            $("#imagen").attr("src", "dist/img/sin_foto.png");
                        } else {
                            $("#cantidad").val(0.0);
                            $("#dsctoline").val(0.0);
                            $("#monedaitem").val("");
                            $("#preciou").val(0.0);
                            $("#articulo_desc").val(data[0].descripcion);
                            $("#UMCompras").val(data[0].UMCompra);
                            //  $("articulo_desc").html(data[0].descripcion);
                            $(".exis").html(data[0].cantidad);
                            $(".preciol").html(data[0].precio);
                            $("#monedaitem").attr("disabled", true);
                            $("#monedaitem").val(data[0].moneda);
                            // $("#preciou").attr("disabled", true);
                            //$('#preciou').number(true, 2);
                            $("#preciou").val(data[0].precio);
                            // SI TIPO CLIENTE = 115 = EXTRANJERO
                            if (data[0].tipocliente == 115) {
                                $("#preciouigv").val(data[0].precio);
                            } else {
                                $("#preciouigv").val(data[0].precio * 1.18);
                            }
                            //$('#cantidad').number(true, 2);
                            $("#cantidad").attr("disabled", false);
                            $("#cantidad").val(0.0);
                            // $("#dsctoline").attr("disabled", false);
                            $("#dsctoline").val(0.0);
                            $("#preciou").select();
                            $("#cantidad").focus();
                            if (data[0].imagen != "") {
                                $("#imagen").attr("src", "img_articulos/" + data[0].imagen);
                            } else {
                                $("#imagen").attr("src", "dist/img/sin_foto.png");
                            }
                            if (data[0].cantidad <= 0) {
                                // GERSON: AGREGANDO VALIDACION VISUAL - Plugins=>Noty
                                var n = noty({
                                    text: "No hay suficiente existencia...!",
                                    theme: "relax",
                                    layout: "center",
                                    type: "information",
                                    timeout: 2000,
                                });

                                $("#cantidad").focus();
                            }
                        }
                    },

                    error: function (jqXHR, estado, error) {
                        // GERSON: AGREGANDO VALIDACION VISUAL - Plugins=>Noty
                        var n = noty({
                            text: "Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!",
                            theme: "relax",
                            layout: "center",
                            type: "error",
                            timeout: 2000,
                        });
                        //            alert("Parece ser que hay un error por favor, reportalo a Soporte inmediatamente...!");
                    },
                });
            });
        } else {
        }
    });
}
/************************************************************************************/
function Lista_almacenOrigbe() {
    idOri = $("#idOri option:selected").val();
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#Lista_Almacenes").html("Recuperando Lista ...");
            },
            url: "Lista_Almacenes.php",
            type: "POST",
            data: "id=" + idOri,
            success: function (x) {
                $("#AORIGI").html(x);
                //  $("#pone_ccosto2").html(x);
                $(".select2").select2();
                //console.log(x);
            },
            error: function (jqXHR, estado, error) { },
        });
    });
}
function lista_ordenes_fabricacion() {
    $.ajax({
        beforeSend: function () {
            $("#lista_of").html("Recuperando Lista ...");
        },
        url: "Lista_of.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#lista_of").html(x);
            //  $("#pone_ccosto2").html(x);
            $(".select2").select2();
            //console.log(x);
        },
        error: function (jqXHR, estado, error) { },
    });
}

function Lista_almacenDestino() {
    idDes = $("#idDest option:selected").val();
    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#Lista_Almacenes").html("Recuperando Lista ...");
            },
            url: "Lista_Almacenes.php",
            type: "POST",
            data: "id=" + idDes,
            success: function (x) {
                $("#ADES").html(x);
                //  $("#pone_ccosto2").html(x);
                $(".select2").select2();
            },
            error: function (jqXHR, estado, error) { },
        });
    });
}
///consultar_stockalmacen
$(document).ready(function () {
    $("#AORIGI").on("change", function () {
        $("#AORIGI option:selected").each(function () {
            elegido = $(this).val();
            cod = $("#codigo").val().trim();

            $.post(
                "consultar_stockalmacen.php",
                {
                    card: elegido,
                    cod: cod,
                },
                function (data2) {
                    var inputNombre = document.getElementById("stock");
                    inputNombre.value = data2.trim();

                    //   $("#stock").val(data2);
                }
            );
        });
    });
});
/*************************************************************************************/

function ultimo_valor_fila() {
    //let tableBody = document.getElementById('tabla_articulos_mod');
    let line = [];
    $("#tabla_articulos > tbody > tr").each(function () {
        articulos = parseFloat($(this).find("td").eq(0).html());
        line.push(articulos);
        //console.log(articulos);
    });

    line.sort(function (a, b) {
        return a - b;
    });
    cantidad = line.length;
    data = isNaN(line[cantidad - 1]) == true ? 0 : line[cantidad - 1];

    return data;
}

function insertar_enlazado() {
    $(document).ready(function () {
        bandera = true;

        if ($("#ingresarCant").val() > 0) {
            if (bandera === true) {
                $("[name='procesar[]']:checked").each(function (key) {
                    var codigo = $(this).parents("tr").find("td:eq(1)").text();
                    var producto = $(this).parents("tr").find("td:eq(2)").text();
                    var um = $(this).parents("tr").find("td:eq(3)").text();
                    var almorigen = $(this).parents("tr").find("td:eq(4) select").val();
                    var almdestino = $(this).parents("tr").find("td:eq(5) select").val();
                    var stock = $(this).parents("tr").find("td:eq(6)").text();

                    var ingresarcantidad = $(this)
                        .parents("tr")
                        .find('input[id="ingresarCant"]')
                        .val();

                    fil = ultimo_valor_fila();
                    console.log(fil);
                    if (fil === 0) {
                        // $("#tabla_articulos_mod > tbody > tr > td").remove();
                        $("#tabla_articulos > tbody > tr > td").remove();
                    }
                    var num = ultimo_valor_fila() + 1;

                    $("#tabla_articulos > tbody").append(
                        "<tr><td class='center'>" +
                        num +
                        "</td><td class='center'>" +
                        codigo +
                        "<td class='center'>" +
                        producto +
                        "</td><td class='center'>" +
                        almdestino +
                        "</td><td class='center' >" +
                        ingresarcantidad +
                        "</td><td class='center' >" +
                        um +
                        "</td><td class='center'><button class='btn btn-block btn-danger btn-xs delete'><i class='icon-trash bigger-120'></i> Eliminar</button></td></tr>"
                    );
                });
                $("#modal_busqueda_enlazada").modal("hide");
                $("#modal_opciones").modal("hide");
            }
        } else {
            var n = noty({
                text: "La cantidad es invalida...!",
                theme: "relax",
                layout: "center",
                type: "error",
                timeout: 2000,
            });
        }
    });
}

/*************************************************************************************/
// function Busca_Confirmacion() {
//     $("#btn_cancela").prop("disabled", true);

//     procesa_reqcompra();
// }
function Busca_Confirmacion() {
    let articulosMap = {};
    let hasValidationError = false;  // Bandera para detectar errores de validación



    // Recorre las filas de la tabla
    $('#tabla_articulos > tbody > tr').each(function (index, row) {
        var cod1 = $(row).find('td').eq(1).html();
        var dim_zona1 = $(row).find('td').find("#dim_zona option:selected").val().trim();
        var dim_area1 = $(row).find('td').find("#dim_area option:selected").val().trim();
        var CCosto1 = $(row).find('td').find("#dim_ccosto option:selected").val().trim();
        var dim_gestion1 = $(row).find('td').find("#dim_gestion option:selected").val().trim();

        // Compara esta fila con todas las siguientes filas
        $('#tabla_articulos > tbody > tr').slice(index + 1).each(function (_, nextRow) {
            var cod2 = $(nextRow).find('td').eq(1).html();
            var dim_zona2 = $(nextRow).find('td').find("#dim_zona option:selected").val().trim();
            var dim_area2 = $(nextRow).find('td').find("#dim_area option:selected").val().trim();
            var CCosto2 = $(nextRow).find('td').find("#dim_ccosto option:selected").val().trim();
            var dim_gestion2 = $(nextRow).find('td').find("#dim_gestion option:selected").val().trim();

            // Verifica si los códigos son iguales
            if (cod1 === cod2) {
                // Si los códigos son iguales, verifica si las dimensiones también lo son
                if (dim_zona1 === dim_zona2 || dim_area1 === dim_area2 || CCosto1 === CCosto2) {
                    alertify.error('Error: Las dimensiones no pueden ser iguales para el mismo código de artículo.');
                    hasValidationError = true;  // Marcamos la bandera como error
                    return false;  // Detiene la ejecución del bucle interno
                }
            } if (dim_zona1 === '' || dim_area1 === '' || CCosto1 === '' || CCosto2 === '') {
                alertify.error('Debe Completar las Dimensiones en el Detalle');
                hasValidationError = true;  // Marcamos la bandera como error
                return false;  // Detiene la ejecución del bucle interno
            }

        });

        // Si la validación detectó un error, detener el bucle principal
        if (hasValidationError) {
            return false;
        }
    });

    // Si hay un error de validación, no continúa con la ejecución del AJAX
    if (hasValidationError) {
        return;  // Detiene el proceso completo si hubo errores
    } else {

        if ($('#tabla_articulos tbody tr').length > 0) {
            swal({
                title: "Desea Registrar?",
                text: "Desea Registrar Requerimiento!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Si, Deseo!",
                cancelButtonText: "No, Deseo!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        procesa_reqcompra();

                    } else {
                        // Si se cancela la acción

                        swal("Cancelado", "No Registrado", "error");
                    }
                });

        } else {

            swal({
                title: "Error!",
                text: "No hay detalle Lista de Articulo!",
                type: "error",
                showCancelButton: false,
            });
        }
    }


    $("#btn_cancela").prop("disabled", true);


}
function procesa_reqcompra() {
    $(document).ready(function () {
        /*busca el numero de ticket*/
        var n_tic;
        $.ajax({
            beforeSend: function () {
                $("#nro_ticket").html("Buscando...");
            },
            async: false,
            url: 'busca_ticket_reqcompra.php',
            type: 'POST',
            // data: 'caja='+$("#ncaja").val(),

            success: function (x) {
                $("#nro_ticket").html(x);

                n_tic = x;
                //              alert(n_tic);
                //              return 
                return n_tic;

            },
            error: function (jqXHR, estado, error) {
                $("#nro_ticket").html('Hubo un error: ' + estado + ' ' + error);
            }
        });




        var credi = '0';
        var clients = '0';
        var dscto = '0';
        var comentarios = '0';
        var transportista = '';
        var idcliente_parent = '0';
        var cpago = '0';
        var fentrega = '0';
        var direntrega = '0';
        var subtotal_venta = '0';
        var total_venta = '0';
        var n_ticket = '0';
        var idlp = '1';
        //$("#btn-procesa").prop('disabled', true);

        credi = '1';
        tiporeq = $("#idTipo").val();
        comentarios = $("#comentarios").val();
        solicitante = $("#soli").val();

        //cpago=document.getElementById("#pone_cpago").selectedIndex;
        fentrega = $("#fecha").val();
        fecha_valida = $("#fecha_valida").val();
        n_ticket = n_tic;

        let articulosMap = {};
        let hasValidationError = false;  // Bandera para detectar errores de validación



        // Recorre las filas de la tabla
        $('#tabla_articulos > tbody > tr').each(function (index, row) {
            var cod1 = $(row).find('td').eq(1).html();
            var dim_zona1 = $(row).find('td').find("#dim_zona option:selected").val().trim();
            var dim_area1 = $(row).find('td').find("#dim_area option:selected").val().trim();
            var CCosto1 = $(row).find('td').find("#dim_ccosto option:selected").val().trim();
            var dim_gestion1 = $(row).find('td').find("#dim_gestion option:selected").val().trim();

            // Compara esta fila con todas las siguientes filas
            $('#tabla_articulos > tbody > tr').slice(index + 1).each(function (_, nextRow) {
                var cod2 = $(nextRow).find('td').eq(1).html();
                var dim_zona2 = $(nextRow).find('td').find("#dim_zona option:selected").val().trim();
                var dim_area2 = $(nextRow).find('td').find("#dim_area option:selected").val().trim();
                var CCosto2 = $(nextRow).find('td').find("#dim_ccosto option:selected").val().trim();
                var dim_gestion2 = $(nextRow).find('td').find("#dim_gestion option:selected").val().trim();

                // Verifica si los códigos son iguales
                if (cod1 === cod2) {
                    // Si los códigos son iguales, verifica si las dimensiones también lo son
                    if (dim_zona1 === dim_zona2 || dim_area1 === dim_area2 || CCosto1 === CCosto2) {
                        alertify.error('Error: Las dimensiones no pueden ser iguales para el mismo código de artículo.');
                        hasValidationError = true;  // Marcamos la bandera como error
                        return false;  // Detiene la ejecución del bucle interno
                    }
                } if (dim_zona1 === '' || dim_area1 === '' || CCosto1 === '' || CCosto2 === '') {
                    alertify.error('Debe Completar las Dimensiones en el Detalle');
                    hasValidationError = true;  // Marcamos la bandera como error
                    return false;  // Detiene la ejecución del bucle interno
                }

            });

            // Si la validación detectó un error, detener el bucle principal
            if (hasValidationError) {
                return false;
            }
        });

        // Si hay un error de validación, no continúa con la ejecución del AJAX
        if (hasValidationError) {
            return;  // Detiene el proceso completo si hubo errores
        }

        // CABECERA
        $.ajax({
            beforeSend: function () {
            },
            url: 'procesa_reqcompra.php',
            type: 'POST',
            data: 'tiporeq=' + tiporeq + '&comentarios=' + comentarios + '&fentrega=' + fentrega + '&n_ticket=' + n_ticket + '&fecha_valida=' + fecha_valida + '&solicitante=' + solicitante,
            success: function (x) {
                var n = noty({
                    text: "Procesando venta...  articulo actual: ",
                    theme: 'relax',
                    layout: 'topLeft',
                    type: 'success',
                    timeout: 2000,
                });

                $("#comentarios").val("");
                global = x.trim()
                if (global != 0 || !isNaN(global)) {
                    // swal("Registrado", "Registrado", "success");
                    swal({
                        title: "Registrado",
                        text: "Registrado",
                        icon: "success",
                        buttons: false,  // Esto desactiva el botón
                        timer: 1000      // Esto cierra el modal después de 1000 ms (1 segundo)
                    });

                    var yapuso = 0;
                   // migrar_sap(global, 12)
                    actualiza_doc_evidencia(global);
                    $('#tabla_articulos > tbody > tr').each(function () {
                        var linea = $(this).find('td').eq(0).html();
                        var cod = $(this).find('td').eq(1).html();

                        var descripcion_art = $(this).find('td').eq(2).html();
                        var can = $(this).find('td').find('input[id="cantidad_item"]').val();
                        var solicitante = $(this).find('td').find('input[id="solicitante"]').val();
                        var op = $(this).find('td').find('input[id="op"]').val();
                        var dim_zona = $(this).find('td').find("#dim_zona option:selected").val().trim();
                        var dim_area = $(this).find('td').find("#dim_area option:selected").val().trim();
                        var CCosto = $(this).find('td').find("#dim_ccosto option:selected").val().trim();
                        var dim_gestion = $(this).find('td').find("#dim_gestion option:selected").val().trim();

                        $.ajax({
                            beforeSend: function () {
                            },
                            url: 'procesa_reqcompraDetalle.php',
                            type: 'POST',
                            data: 'tiporeq=' + tiporeq + '&codigo=' + cod + '&cantidad=' + can + '&descripcion_art=' + descripcion_art + '&comentarios=' + '&fentrega=' + fentrega + '&n_ticket=' + n_ticket + '&CCosto=' + CCosto + '&linea=' + linea + '&dim_zona=' + dim_zona + '&dim_area=' + dim_area + '&dim_gestion=' + dim_gestion + '&solicitante=' + solicitante + '&op=' + op,
                            success: function (x) {
                                var n = noty({
                                    text: "Procesando venta...  articulo actual: " + cod,
                                    theme: 'relax',
                                    layout: 'topLeft',
                                    type: 'success',
                                    timeout: 2000,
                                });

                                $("#soli").val('');
                                $("#idCcosto select").val('');
                                $("#idArea select").val('');
                                $("#idZona select").val('');
                                $("#idTipo").val('').attr("disabled", false);;




                                $("#comentarios").val("");

                                $("#tabla_articulos > tbody:last").children().remove();
                                $("#Idtipoproducto").attr("disabled", false);
                            },
                            error: function (jqXHR, estado, error) {
                                $("#errores").html('Error... ' + estado + '  ' + error);
                            }
                        });
                    });
                }
            },
            error: function (jqXHR, estado, error) {
                $("#errores").html('Error... ' + estado + '  ' + error);
            }
        });





    })
}
/*******************************************************************************************/
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
/*******************************************************************************************/


function quitarAcentos(cadena) {
    const acentos = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        Á: "A",
        É: "E",
        Í: "I",
        Ó: "O",
        Ú: "U",
        Ñ: "N",
        ñ: "n",
        ç: "c",
        Ç: "C",
        à: "a",
        è: "e",
        ì: "i",
        ò: "o",
        ù: "u",
        À: "A",
        È: "E",
        Ì: "I",
        Ò: "O",
        Ù: "U",
        "&": ""

    };
    return cadena
        .split("")
        .map((letra) => acentos[letra] || letra)
        .join("")
        .toString().replace(/['"]+/g, '');
}

$(function () {
    // Evento que selecciona la fila y la elimina
    $(document).on("click", ".delete", function () {
        var parent = $(this).parents().parents().get(0);
        $(parent).remove();
        ver_disp_tabla()
    });
});

function migrar_sap_asiento(docentry) {
    $.ajax({
        beforeSend: function () { },
        url: "insertar_cola_service_factura.php",
        type: "POST",
        data: { docentry: docentry, tipo_doc: "24", objtype: "67" },
        success: function (x) { },
        error: function (jqXHR, estado, error) {
            $("#errores").html("Error... " + estado + "  " + error);
        },
    });
}
function lista_marca() {
    $.ajax({
        beforeSend: function () {
            $("#listar_marca_art").html("");
        },
        url: "busca_data_articulo_marca.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#listar_marca_art").html(x);
            $(".select2").select2();
        },
        error: function (jqXHR, estado, error) {
            $("#listar_marca_art").html(
                "Error en la peticion AJAX..." + estado + "      " + error
            );
        },
    });
}

$(document).on("click", ".fila", function (e) {
    // Evitar que el evento se propague si se hace clic directamente en el checkbox
    if (e.target.type === "checkbox") {
        return;
    }

    var checkbox = $(this).find('input[type="checkbox"]');
    checkbox.prop("checked", !checkbox.prop("checked"));

    if (checkbox.prop("checked")) {
        $(this).find("td").css("background-color", "LightGreen");
    } else {
        $(this).find("td").css("background-color", "white");
    }
    det = document.querySelectorAll("#cotizacion_seg:checked").length;
    if ($(this).is(":checked")) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        if (det > 0) {
            $("#enviar").removeClass("disabledTab");
            $("#enviar").addClass("activeTab");
        } else {
            $("#enviar").removeClass("activeTab");
            $("#enviar").addClass("disabledTab");
        }
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        if (det > 0) {
            $("#enviar").removeClass("disabledTab");
            $("#enviar").addClass("activeTab");
        } else {
            $("#enviar").removeClass("activeTab");
            $("#enviar").addClass("disabledTab");
        }
    }
});

$(document).on("click", ".fila_servi", function (e) {
    // Evitar que el evento se propague si se hace clic directamente en el checkbox
    if (e.target.type === "checkbox") {
        return;
    }

    var checkbox = $(this).find('input[type="checkbox"]');
    checkbox.prop("checked", !checkbox.prop("checked"));

    if (checkbox.prop("checked")) {
        $(this).find("td").css("background-color", "LightGreen");
    } else {
        $(this).find("td").css("background-color", "white");
    }
    det = document.querySelectorAll("#cotizacion_seg:checked").length;
    if ($(this).is(":checked")) {
        $(this).parents("tr").find("td").css("background-color", "LightGreen");
        if (det > 0) {
            $("#enviar_servi").removeClass("disabledTab");
            $("#enviar_servi").addClass("activeTab");
        } else {
            $("#enviar_servi").removeClass("activeTab");
            $("#enviar_servi").addClass("disabledTab");
        }
    } else {
        $(this).parents("tr").find("td").css("background-color", "white");
        if (det > 0) {
            $("#enviar_servi").removeClass("disabledTab");
            $("#enviar_servi").addClass("activeTab");
        } else {
            $("#enviar_servi").removeClass("activeTab");
            $("#enviar_servi").addClass("disabledTab");
        }
    }
});
function agrega_a_lista2() {
    $(document).ready(function () {

        // Elimina filas si no hay artículos seleccionados
        fil = ultimo_valor_fila();
        if (fil === 0) {
            $("#tabla_articulos > tbody > tr > td").remove();
        }

        // Definir arreglos para almacenar los valores de los artículos seleccionados
        var articulos = [];
        var descripciones = [];
        var stocks_1 = [];
        var cantidades = [];
        var odt_cods = [];
        var ums = [];

        $('#tabla_art input[type="checkbox"]:checked').each(function () {
            // Obtener los valores de la fila actual
            var articulo = $(this).closest("tr").children("td:eq(1)").text();
            var descripcion = $(this).closest("tr").children("td:eq(2)").text();
            var odt_cod = $(this).closest("tr").children("td:eq(7)").text();
            var cantidad = $(this).closest("tr").children("td:eq(3)").text()
            var um = $(this).closest("tr").children("td:eq(6)").text();


            // Agregar los valores a los arreglos
            articulos.push(articulo);
            descripciones.push(descripcion);
            odt_cods.push(odt_cod);
            // stocks_1.push(stock_bambas);
            // stocks_2.push(stock_sanjuan);
            ums.push(um);
            // cantidades.push(cantidad);
            var iso = $("#id_iso select").val();
            if (iso && iso.length > 0) {
                cantidades.push(cantidad);  // Si hay ISO, utilizar la cantidad actual
            } else {
                cantidades.push('1');  // Si no hay ISO, asignar '1'
            }

        });


        for (var i = 0; i < articulos.length; i++) {
            var num = ultimo_valor_fila() + 1;
            li = parseFloat(num - 1).toFixed(0);

            if (li == 0) {

                lista_zona_dimension(i)
                lista_area_dimension(i)
                lista_cccosto_dimension(i)
                lista_gestion_dimension(i)
            } else {
                lista_zona_dimension(num)
                lista_area_dimension(num)
                lista_cccosto_dimension(num)
                lista_gestion_dimension(num)
            }

            console.log(li);
            // Inicializa la variable donde construirás el HTML
            var htmlFila = "<tr><td class='center'>" +
                num +
                "</td><td class='center'>" +
                articulos[i] +
                "</td><td class='center'>" +
                descripciones[i] +
                "</td><td style='text-align:center'><input type='number' class='form-control pull-right' id='cantidad_item' value='" + cantidades[i] + "' autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' >" +
                "</td><td style='text-align:center;display:none'><input type='text' class='form-control pull-right' id='solicitante' autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' >" + "</td><td style='text-align:center'><input type='op' class='form-control pull-right' id='op' value='" + odt_cods[i] + "' onkeyup='validarInput(event)'autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' >" +
                "</td><td class='center' >" +
                ums[i] + "</td>";

            // Agrega las filas dependiendo de la condición
            if (li == 0) {
                htmlFila += "<td class='center'><div id='pone_dim_zona" + i + "'/></td>" +
                    "<td class='center'><div id='pone_dim_area" + i + "'/></td>" +
                    "<td class='center'><div id='pone_dim_costo" + i + "'/></td>" +
                    "<td class='center'style ='display:none'><div id='pone_dim_gestion" + i + "'/></td>";
            } else {
                htmlFila += "<td class='center'><div id='pone_dim_zona" + num + "'/></td>" +
                    "<td class='center'><div id='pone_dim_area" + num + "'/></td>" +
                    "<td class='center'><div id='pone_dim_costo" + num + "'/></td>" +
                    "<td class='center' style ='display:none'><div id='pone_dim_gestion" + num + "'/></td>";
            }

            // Continúa con el resto del HTML y lo agrega
            htmlFila += "<td class='center'><button class='btn btn-danger btn-sm delete rounded-circle'><i class='fa fa-trash'></i></button></td></tr>";

            // Finalmente, agrega la fila al DOM
            $("#tabla_articulos > tbody").append(htmlFila);

        }

        // Establecer los valores seleccionados en los selects dinámicos
        // $(".almacen").val(selectedValue);
        // $(".almacen_dest").val(selectedValue_1);

        // Ocultar los modales y deshabilitar selects
        $("#modal_busqueda_arts2").modal("hide");
        $("#modal_busqueda_arts").modal("hide");
        $("#modal_opciones").modal("hide");
        ver_disp_tabla();
        $(document).ready(function () {
            $("#tabla_art input[type='checkbox']:checked").prop("checked", false);
            $("#tabla_art tbody td").css("background-color", "white");
            $("#enviar").removeClass("activeTab");
            $("#enviar").addClass("disabledTab");
            $("#tabla_art > tbody > tr > td").remove();
            $("#articulo_buscar").val('');

            $("#tabla_servi input[type='checkbox']:checked").prop("checked", false);
            $("#tabla_servi tbody td").css("background-color", "white");
            $("#servicio_buscar").val('');
            $("#tabla_servi > tbody > tr > td").remove();
            $("#enviar_servi").removeClass("activeTab");
            $("#enviar_servi").addClass("disabledTab");

        });

    });
}
function validarInput(event) {
    var input = event.target;
    // Reemplazar todo lo que no sea números, comas o guiones
    input.value = input.value.replace(/[^0-9,-]/g, '');
}

function lista_zona_dimension(linea) {
    console.log(linea);

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_zona.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_dim_zona" + linea).html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_zona_dimension_titulo() {


    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_zona.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#idZona").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_area_dimension(linea) {
    //console.log('hola');

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_area.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_dim_area" + linea).html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_area_dimension_titulo() {
    //console.log('hola');

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_area.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#idArea").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_cccosto_dimension(linea) {
    //console.log('hola');

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_ccosto.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_dim_costo" + linea).html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_cccosto_dimension_titulo() {
    //console.log('hola');

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_ccosto.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#idCcosto").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}

function lista_gestion_dimension(linea) {
    //console.log('hola');

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_dim_gestion.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_dim_gestion" + linea).html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });
}


function agrega_a_listaservi() {
    $(document).ready(function () {

        // Elimina filas si no hay artículos seleccionados
        fil = ultimo_valor_fila();
        if (fil === 0) {
            $("#tabla_articulos > tbody > tr > td").remove();
        }

        // Definir arreglos para almacenar los valores de los artículos seleccionados
        var articulos = [];
        var descripciones = [];
        var stocks_1 = [];
        var stocks_2 = [];
        var ums = [];

        $('#tabla_servi input[type="checkbox"]:checked').each(function () {
            // Obtener los valores de la fila actual
            var articulo = $(this).closest("tr").children("td:eq(1)").text();
            var descripcion = $(this).closest("tr").children("td:eq(2)").text();
            var stock;
            var um;

            // stock_bambas = $(this).closest("tr").children("td:eq(6)").text();


            um = $(this).closest("tr").children("td:eq(8)").text();

            // Agregar los valores a los arreglos
            articulos.push(articulo);
            descripciones.push(descripcion);
            // stocks_1.push(stock_bambas);
            // stocks_2.push(stock_sanjuan);
            ums.push(um);
        });

        for (var i = 0; i < articulos.length; i++) {
            var num = ultimo_valor_fila() + 1;
            li = parseFloat(num - 1).toFixed(0);
            //console.log(li);
            if (li == 0) {

                lista_zona_dimension(i)
                lista_area_dimension(i)
                lista_cccosto_dimension(i)
                lista_gestion_dimension(i)
            } else {
                lista_zona_dimension(num)
                lista_area_dimension(num)
                lista_cccosto_dimension(num)
                lista_gestion_dimension(num)
            }

            var htmlFila = "<tr><td class='center'>" +
                num +
                "</td><td class='center'>" +
                articulos[i] +
                "</td><td class='center'>" +
                descripciones[i] +
                "</td><td style='text-align:center'><input type='number' class='form-control pull-right' id='cantidad_item' value ='1'autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' disabled>" +
                "</td><td style='text-align:center;display:none'><input type='text' class='form-control pull-right' id='solicitante' autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' >" + "</td><td style='text-align:center'><input type='op' class='form-control pull-right' id='op' onkeyup='validarInput(event)' autocomplete='off' style='font-size: 12px; text-align:center; color:black; font-weight: bold;' >" +
                "</td><td class='center' >" +
                ums[i] + "</td>";

            // Agrega las filas dependiendo de la condición
            if (li == 0) {
                htmlFila += "<td class='center'><div id='pone_dim_zona" + i + "'/></td>" +
                    "<td class='center'><div id='pone_dim_area" + i + "'/></td>" +
                    "<td class='center'><div id='pone_dim_costo" + i + "'/></td>" +
                    "<td class='center' style ='display:none;'><div id='pone_dim_gestion" + i + "'/></td>";
            } else {
                htmlFila += "<td class='center'><div id='pone_dim_zona" + num + "'/></td>" +
                    "<td class='center'><div id='pone_dim_area" + num + "'/></td>" +
                    "<td class='center'><div id='pone_dim_costo" + num + "'/></td>" +
                    "<td class='center' style ='display:none;'><div id='pone_dim_gestion" + num + "'/></td>";
            }

            // Continúa con el resto del HTML y lo agrega
            htmlFila += "<td class='center'><button class='btn btn-danger btn-sm delete rounded-circle'><i class='fa fa-trash'></i></button></td></tr>";

            // Finalmente, agrega la fila al DOM
            $("#tabla_articulos > tbody").append(htmlFila);
        }

        // Establecer los valores seleccionados en los selects dinámicos
        // $(".almacen").val(selectedValue);
        // $(".almacen_dest").val(selectedValue_1);

        // Ocultar los modales y deshabilitar selects
        $("#modal_busqueda_servcio").modal("hide");
        // $("#modal_busqueda_arts").modal("hide");
        // $("#modal_opciones").modal("hide");

        $(document).ready(function () {
            $("#tabla_art input[type='checkbox']:checked").prop("checked", false);
            $("#tabla_art tbody td").css("background-color", "white");
            $("#enviar").removeClass("activeTab");
            $("#enviar").addClass("disabledTab");
        });
        ver_disp_tabla()
    });
}

function listas_of_iso() {
    $.ajax({
        beforeSend: function () {
            $("#id_iso").html("Recuperando Lista ...");
        },
        url: 'lista_of_isograf.php',
        type: 'POST',
        data: null,
        success: function (x) {
            $("#id_iso").html(x);
            $(".select2").select2({

            });
        },
        error: function (jqXHR, estado, error) {
        }
    });
}

// $(document).on("change", "#idZona select", function () {
//     var valor = this.value

//     $("#tabla_articulos > tbody > tr").each(function () {
//         $(this).find("td").find('select[id="dim_zona"]').val(valor).trigger('change');
//     });
// })
// $(document).on("change", "#idArea select", function () {
//     var valor = this.value

//     $("#tabla_articulos > tbody > tr").each(function () {
//         $(this).find("td").find('select[id="dim_area"]').val(valor).trigger('change');
//     });
// })

// $(document).on("change", "#idCcosto select", function () {
//     var valor = this.value

//     $("#tabla_articulos > tbody > tr").each(function () {
//         $(this).find("td").find('select[id="dim_ccosto"]').val(valor).trigger('change');
//     });
// })

function abrir_modal_dimesion() {
    $("#modal_dimeciones").modal("show");
}

function Actualiza_tabla_datos() {
    var idZona = $("#idZona select").val();
    var idArea = $("#idArea select").val();
    var idCcosto = $("#idCcosto select").val();

    if (idZona == "" || idArea == "" || idCcosto == "") {
        alertify.error("Falta Elegir");
        return
    }

    $("#tabla_articulos > tbody > tr").each(function () {
        $(this).find("td").find('select[id="dim_zona"]').val(idZona).trigger('change');
        $(this).find("td").find('select[id="dim_area"]').val(idArea).trigger('change');
        $(this).find("td").find('select[id="dim_ccosto"]').val(idCcosto).trigger('change');
    });

    $("#modal_dimeciones").modal("hide");
}

function modal_evidencia() {
    $("#modal_registrar_evi").modal("show");
    doc_temporal= $("#doc_temporal").val();
    soli= $("#soli").val();

    $("#num_reg").val(doc_temporal);
    $("#cliente_reg").val(soli);
    listar_data_pdf(doc_temporal) 
    // setTimeout(() => {
    //     actualiza_doc_evidencia(doc_temporal)
    // }, 500);
    
}

$(document).ready(function () {
    $("form#data").submit(function (event) {
        var formData = new FormData($(this)[0]);
        var files = $("#fileToUpload")[0].files[0];
        var card_code = document.getElementById("cliente_reg").value;
        var titulo = document.getElementById("titulo_reg").value;
        var num = document.getElementById("num_reg").value;
        var movi = $("#tipor").val();


        if (files === undefined) {
            alertify.error("no existe documento ");
            return false;
        } else {
            //var num_fix = $('#num_fix').val();
            formData.append("file", files);

            formData.append("card_code", card_code);
            formData.append("titulo", titulo);
            formData.append("num", num);
            formData.append("movi", movi);

            $.ajax({
                url: "registrar_evidencia_pdf.php",
                type: "post",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {


                    $("#archivo_reg").val("");
                    $("#titulo_reg").val("");
                    // listar_data_pdf(va)
                    listar_data_pdf(num);
                },
            });
            return false;
        }
    });
});

function listar_data_pdf(id) {
    num = document.getElementById("num_reg").value;

    //estado = $("#IDestado option:selected").text().trim();
    $.ajax({
        beforeSend: function () {
            $("#data_pdf").html("Buscando las ventas, un momento...");
        },
        url: "listar_evidencia_pdf.php",
        type: "POST",
        data: "id=" + id ,
        success: function (res) {
            // console.log(res);
            $("#data_pdf").html(res);
            $(document).ready(function () {
                $("#tabla_pfd").DataTable();
            });
        },
        error: function (jqXHR, estado, error) {
            alert(
                "Hubor un error al buscar las ventas...por favor reporte a soporte...!"
            );
            $("#data_pdf").html(estado + "     " + error);
        },

    });
}

function trae_doc_temporal() {
    $.ajax({
        beforeSend: function () {
           // $("#nro_ticket").html("Buscando...");
        },
        async: false,
        url: 'busca_ticket_reqcompra.php',
        type: 'POST',
       
        success: function (x) {
         
            console.log(x);
            
            $("#doc_temporal").val(x);

           

        },
        error: function (jqXHR, estado, error) {
           
        }
    });

}

function ver_manual_pdf(id, ruta) {
    $global_id = id;
    $global_ruta = ruta;
    //console.log(id)
    $('#modal_data_pdf').modal('show');
    $('.modal_data_pdf').on('shown.bs.modal',
        function() { //correct here use 'shown.bs.modal' event which comes in bootstrap3
            $(this).find('iframe').attr('src', $global_ruta)
        })
    $("#navegador").on('click', function() {
        //window.location.href = $global_ruta
        window.open($global_ruta);

    })
    $("#imprimir").on('click', function() {
        $('#imprimir1')[0].contentWindow.print();
        //window.print();

    })
}

function actualiza_doc_evidencia(docentry) {
    $('#tabla_pfd > tbody > tr').each(function () {
        var id_evidencia = $(this).find('td').eq(0).html();       

        $.ajax({
            beforeSend: function () {
            },
            url: 'actualiza_doc_evidencia.php',
            type: 'POST',
            data: {
                id_evidencia,docentry
            },
            success: function (x) {
                
            },
            error: function (jqXHR, estado, error) {
                $("#errores").html('Error... ' + estado + '  ' + error);
            }
        }); 
    });
}

function eliminar_preficha_pdf(id) {

    swal({
        title: "Desea Eliminar?",
        text: "Desea Eliminar!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, Deseo!",
        cancelButtonText: "No, Deseo!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                eliminar_preficha_pdf2(id)
               // procesa_reqcompra();
               swal("Eliminado", "Registrado", "success");
            } else {
                // Si se cancela la acción

                swal("Cancelado", "No Registrado", "error");
            }
        });

    // alertify.confirm('Eliminar', 'Desea Eliminar?', function (E) {

    //     // eliminar_preficha_pdf2(id2, name2);
    //     // alertify.success('Eliminado');


    // }, function () {
    //     alertify.error('Cancelado')
    // });
    //  var bool=confirm("Seguro de eliminar el dato?");
}

function eliminar_preficha_pdf2(id) {
    var item = id;

    doc_temporal= $("#doc_temporal").val();

    $.post("eliminar_doc_evidencia.php", {
            item: item,
        },
        function (data) {
            listar_data_pdf(doc_temporal) 
        });
    
}
