function lista_of_primera() {
    var fechai = $("#fecha_inicio").val();
    var fechaf = $("#fecha_fin").val();
    var isograf = $("#almacen").val();
    // var tipo = $("#filtro_tipo").val();
    var proceso = $("#proceso").val();
    var name_xd = $("#nombre_op").text()


    $.ajax({
        beforeSend: function () {
        },
        url: 'verificar_maquina_ope.php',
        type: 'POST',
        data: { name_xd },
        success: function (x) {
            //console.log(x);
            maquina = x.trim()


        },
        error: function (jqXHR, estado, error) {
        }
    });

    setTimeout(() => {
        $.ajax({
            beforeSend: function () {
                $("#lista_primera_tabla").html("Recuperando Lista ...");
            },
            url: "consulta_of_almacen.php",
            type: "POST",
            data: { fechai: fechai, fechaf: fechaf, isograf: isograf, proceso: proceso, maquina },
            success: function (x) {
                $("#lista_primera_tabla").html(x);
                // $("#tabla_primer").DataTable({
                //     order: [[0, 'asc']]
                // });
                $.ajax({
                    beforeSend: function () {
                    },
                    url: 'verificar_turno.php',
                    type: 'POST',
                    data: { fechai, name_xd },
                    success: function (x) {
                        console.log(x);
                        veri = x.trim()

                        if (veri === 'NO INICIADO') {
                            $("#bt_eventos_tur").show();
                            $("#bt_eventos_t").hide();
                            $("#bt_eventos_finali").hide();
                            $("#bt_reporte").hide();


                        } else if (veri === 'ABIERTO') {
                            $("#bt_eventos_finali").show();
                            $("#bt_eventos_tur").hide();
                            $("#bt_eventos_t").show();
                            $("#bt_reporte").show();



                        } else if (veri === 'CERRADO') {
                            $("#bt_eventos_t").show();
                            $("#bt_eventos_finali").hide();
                            $("#bt_eventos_t").hide();
                            $("#bt_reporte").hide();


                        }

                    },
                    error: function (jqXHR, estado, error) {
                    }
                });


                // setTimeout(() => {
                //     $("#bt_eventos_t").show();
                //     $("#bt_eventos_tur").show();
                // }, 500);

            },
            error: function (jqXHR, estado, error) { },
        });
    }, 1000);



}
function recibo_produccion_nroisograf(nro_of_isograf) {
    var idcl = nro_of_isograf.split("|");

    docentry = idcl[0];
    iso = idcl[1];
    almacen_nom = idcl[2];
    almacen_cod = idcl[3];
    cantidad_plani = idcl[4];
    nro_pros = idcl[5]; -


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
                        //list_maquineddd() 
                        listar_defectos();
                        ver_maquina_produccion();
                    },
                    error: function (jqXHR, estado, error) { },
                });
            },
            error: function (jqXHR, estado, error) { },
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
            lista_proceso()

        },
        error: function (jqXHR, estado, error) {
        }
    });

}



function lista_proceso() {

    $.ajax({
        beforeSend: function () {
        },
        url: 'listado_proceso.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#pone_proceso").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
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
            $("#modal_elemento").val(idcl[18]);
            $("#modal_proceso").val(idcl[19]);

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
function listar_almacen2() {
    var name_xd = $("#nombre_op").text()


    $(document).ready(function () {
        $.ajax({
            beforeSend: function () {
                $("#almacen_detalle").html("Recuperando Lista ...");
            },
            url: 'lista_almacen_ordenF_new.php',
            type: 'POST',
            data: {name_xd},
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
            "<td class='center cantidad'>" + cantidad + "</td>" +

            "<td style='text-align:center'><button class='btn  btn-danger btn-xs delete rounded-circle'><i class='fa fa-trash'></i></button></td>"
        );
        recalcularSuma();

    }


}

function recalcularSuma() {
    var suma = 0;
    $("#tabla_defectos > tbody > tr").each(function () {
        var cantidad = parseFloat($(this).find(".cantidad").text());
        if (!isNaN(cantidad)) {
            suma += cantidad;
        }
    });
    console.log("Suma de cantidades: " + suma);
    $("#uni_malas").val(suma);
}
$(document).on('click', '.delete', function () {
    $(this).closest('tr').remove();
    recalcularSuma();
});

function registrar_reciboP() {
    modal_op_iso = $("#modal_op_iso").val();
    modal_pro = $("#modal_pro").val();
    modal_des = $("#modal_des").val();
    modal_docentry = $("#modal_docentry").val();
    modal_fi = $("#modal_fi").val();
    modal_ff = $("#modal_ff").val();

    modal_elemento = $("#modal_elemento").val();
    modal_proceso = $("#modal_proceso").val();
    modal_maqui = $("#modal_maqui").val();

    unidad_buena = $("#uni_buenas").val();
    unidad_mala = $("#uni_malas").val();
    almacen = $("#almacen_detalle option:selected").val();
    observaciones = $("#uni_observaciones").val();
    codi_operadorS = $("#codi_nombre_op").text();
    codigo_turno = $("#turno_op").text()


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
                    var tipo_proceso = '1';


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
                            //lista_recibo_prod();
                            


                           
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


                                        

                                    

                                        //INSERTAR A SQL 

                                        $.ajax({
                                            beforeSend: function () {
                                            },
                                            url: 'insertar_datos_pro.php',
                                            type: 'POST',
                                            data: '&modal_op_iso=' + modal_op_iso + '&modal_elemento=' + modal_elemento + '&modal_proceso=' + modal_proceso + '&modal_maqui=' + modal_maqui + '&modal_fi=' + modal_fi + '&modal_ff=' + modal_ff + '&observaciones=' + observaciones+ '&codi_operadorS=' + codi_operadorS+ '&unidad_buena=' + unidad_buena+ '&tipo_proceso=' + tipo_proceso+ '&codigo_turno=' + codigo_turno+ '&unidad_mala=' + unidad_mala,
                                            success: function (data) {
                                               
        
        
                                                
                                            },
                                            error: function (jqXHR, estado, error) {
                                                $("#errores").html('Error... ' + estado + '  ' + error);
                                            }
                                        });



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


function seleccionar_eventos(docentry, nro_isograf) {

    var name_xd = $("#nombre_op").text()

    $.ajax({
        url: "consulta_maquina_evento_turno.php",
        type: "POST",
        data: { name_xd },
        success: function (x) {
            console.log(x);
            var valores = x.split('|');
            var maq = valores[1];
            var name_maq = valores[0];

            $("#nombre_maquinita").val(name_maq);
            $("#codigo_maquinita").val(maq);

            $("#modal_maqui").val(maq);

            // $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
    $("#modal_eventosOF").modal("toggle");
    //listar_nomEventos();
    listar_eventos_preTurn();

    $("#iso_evento").val(nro_isograf);
    $("#doc_evento").val(docentry);

    listar_eventos(docentry, nro_isograf);

}




function ver_maquina_produccion(){
    var name_xd = $("#nombre_op").text()

    $.ajax({
        url: "consulta_maquina_evento_turno.php",
        type: "POST",
        data: { name_xd },
        success: function (x) {
            console.log(x);
            var valores = x.split('|');
            var maq = valores[1];
            //var name_maq = valores[0];

            $("#modal_maqui").val(maq);


        },
        error: function (jqXHR, estado, error) { },
    });
}


function list_maquineddd() {

    var name_xd = $("#nombre_op").text()

    $.ajax({
        url: "consulta_maquina_almacen_turno.php",
        type: "POST",
        data: { name_xd },
        success: function (x) {
            console.log(x);
            var valores = x.split('|');
            var almita = valores[0];
         
            $("#nombre_maquinita").val(almita);
      

        },
        error: function (jqXHR, estado, error) { },
    });
 

}




function listar_eventos_preTurn() {
    $.ajax({
        url: "list_eventos_turno_pre.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#list_eventos").html(x);
            $(".select2").select2();

        },
        erroconsulta_maquina_evento_turnor: function (jqXHR, estado, error) { },
    });
}





function listar_eventos_tur() {
    $.ajax({
        url: "listar_eventos_turno.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#list_eventos_turno").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });
}



function selec_eventos_turno() {
    var name_xd = $("#nombre_op").text()

    $.ajax({
        url: "consulta_maquina_evento_turno.php",
        type: "POST",
        data: { name_xd },
        success: function (x) {
            console.log(x);
            var valores = x.split('|');
            var maq = valores[1];
            var name_maq = valores[0];

            $("#nombre_maquinita_turno").val(name_maq);
            $("#codigo_maquinita_turno").val(maq);

            // $(".select2").select2();

        },
        error: function (jqXHR, estado, error) { },
    });


    $("#modal_eventosturno").modal("toggle");

    listar_eventos_tur();
    listar_eventos_general();


    //listar_eventos(docentry, nro_isograf)

}


function consult_maq_turno(name_xd) {
    // var name_xd = $("#nombre_op").text()

    $.ajax({
        url: "consulta_maquina_evento_turno_1.php",
        type: "POST",
        data: { name_xd },
        success: function (x) {
            console.log(x);
            var valores = x.split('|');
            var maq = valores[1];
            var name_maq = valores[0];
            var turno = valores[2];
            $("#maquina_op").text(name_maq);
            $("#turno_op").text(turno);

            // $(".select2").select2();

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


function colocarMaquina(valor) {
    $("#modal_material").modal('hide')

    var client = valor;
    var idcl = client.split("|");
    $("#codigo_maquinita_turno").val(idcl[0]);
    $("#nombre_maquinita_turno").val(idcl[1]);

}



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


function registrarEventos_turno() {

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
                registrarEventosxd_turn();

            } else {
                swal("No se Registro Evento");
            }
        });
}




function registrarEventosxd_turn() {

    console.log('go');
    eventos = $("#list_eventos_turno option:selected").val();
    fecha = $("#event_fecha_ahora_turno").val();
    hora_inicio = 0
    hora_fin = 0
    observaciones = $("#even_observaciones_turno").val();
    nro_isograf = 0
    docentry = 0;
    maquina = $("#codigo_maquinita_turno").val();
    bandera = true;

    if (maquina === '') {
        bandera = false;
        alertify.error("No hay maquina");
    }
    if (eventos === 'Seleccione') {
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


                $("#even_observaciones_turno").val("");
                $("#nombre_maquinita_turno").val("");
                $("#codigo_maquinita_turno").val("");
                listar_eventos_general(docentry, nro_isograf);

            },
            error: function (jqXHR, estado, error) { },
        });
    }



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



function finalizar_evento_general(id) {

    swal({
        title: "Finalizar",
        text: "Desea finalizar Evento?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                finalizar_evento2_gene(id)
            } else {
                swal("Cancelado");
            }
        });
}



function finalizar_evento2_gene(id) {


    $.ajax({
        url: "finalizar_eventos.php",
        type: "POST",
        data: {
            id
        },
        success: function (x) {
            listar_eventos_general();
        },
        error: function (jqXHR, estado, error) { },
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


function listar_eventos_general() {

    $.ajax({
        url: "consulta_eventos_registrados.php",
        type: "POST",
        data: null,
        success: function (x) {
            $("#tabla_eventos_turno").html(x);
            $("#tabla_eventos_gener").DataTable({
                order: [[0, 'asc']]
            });

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

function listar_eventos_turno(docentry, nro_isograf) {

    $.ajax({
        url: "consulta_eventos_registrados.php",
        type: "POST",
        data: {

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




function detalle_of(docentry) {
    $("#modal_procesar").modal("toggle");
    consulta_datos_of_cab(docentry);

    lista_maquinaria_user();


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
};





function lista_maquinaria_user() {

    $.ajax({
        beforeSend: function () {
            //$("#list_maquinaria").html("Recuperando Lista ...");
        },
        url: 'lista_maquina_user.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);
            var data = x;
            var idcl = data.split("|");
            $("#list_maquinaria").val(idcl[0]);
            $("#list_turno").val(idcl[1]);


        },
        error: function (jqXHR, estado, error) {
        }
    });
};

function obtenerFila3(elemento) {
    var index = $(elemento).closest("tr").index();
    //console.log(index);
    return index;
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

$(document).on('click', '#tabla_detpr tbody tr' , function (event) {
    console.log('GO');
    var checkbox = $(this).find("#salida_2");
    if (!$(event.target).is('#salida_2')) {
        // Alterna el estado del checkbox
        checkbox.prop('checked', !checkbox.prop('checked'));
    }
  
   if (checkbox.is(':checked')) {
        $(this).find("td").css("background-color", "LightGreen");
        document.getElementById('regist_sal').disabled = false;
        let num = $(this).find("td:eq(8)").text();

        num = parseFloat(num);
        num = isNaN(num) ? 0 : Math.abs(num);
        $(this).find('input[id="ingresarCant"]').val(num);
    } else {
        $(this).find("td").css("background-color", "white");
        document.getElementById('regist_sal').disabled = true;
        let num = "";
        $(this).find('input[id="ingresarCant"]').val(num);
    }
});


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

    maquinaria_modal = $("#list_maquinaria").val();
    turno_modal = $("#list_turno").val();
    operario_modal = $("#operario_modal").val();


    bandera = true;
    bandera2 = true;



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
                    // lista_of_reg();
                    // lista_of_entrega();
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
function consulta_info(docentry) {
    $("#modal_info").modal("toggle");
    $.ajax({
        beforeSend: function () {
            // $("#lista_primera_tabla").html("Recuperando Lista ...");
        },
        url: "consulta_of_almacen_informacion.php",
        type: "POST",
        data: { docentry },
        success: function (x) {
            $("#lista_of_informacion").html(x);
            // $("#tabla_primer").DataTable({
            //     order: [[0, 'asc']]
            // });
        },
        error: function (jqXHR, estado, error) { },
    });
}
function exportarpdf() {

    // var docentry = '5'
    var docentry =$("#docentry_mod").val();
    var turno= document.querySelector("#turno_op").innerText; 
    var id_operador= document.querySelector("#codi_nombre_op").innerText; 

     javascript: window.open("pdf_parte_produccion.php?id_operador=" + id_operador + "&turno=" + turno);


    //     var ruta = "pdf_parte_produccion.php?";

    //     $('#modal_data_pdf').modal('show');
    //     $('#modal_data_pdf').on('shown.bs.modal', function () {
    //         $(this).find('iframe').attr('src', ruta);
    //     }).on('hidden.bs.modal', function () {
    //         $(this).find('iframe').attr('src', '');
    //     });

    //     $("#navegador").off('click').on('click', function () {
    //         window.open(ruta, '_blank');
    //     });

    //     $("#imprimir").off('click').on('click', function () {
    //         $('#modal_data_pdf').find('iframe')[0].contentWindow.print();
    //     })
}


function abrir_of_almacen(id, isograf) {

    swal({
        title: "Iniciar OF",
        text: "Desea Iniciar OF?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                abrir_of_almacen2(id, isograf)
            } else {
                swal("Cancelado");
            }
        });
}


function abrir_of_almacen2(id, isograf) {
    $.ajax({
        url: "iniciar_of_almacen.php",
        type: "POST",
        data: {
            id, isograf
        },
        success: function (x) {
            lista_of_primera();
            // inicio(id)
        },
        error: function (jqXHR, estado, error) { },
    });
}


function cerrar_of_almacen(id, isograf) {

    swal({
        title: "Finalizar",
        text: "Desea finalizar OF?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                cerrar_of_almacen2(id, isograf)
            } else {
                swal("Cancelado");
            }
        });
}


function cerrar_of_almacen2(id, isograf) {


    $.ajax({
        url: "cerrar_of_almacen.php",
        type: "POST",
        data: {
            id, isograf
        },
        success: function (x) {
            lista_of_primera();
        },
        error: function (jqXHR, estado, error) { },
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

function inciar_turno() {
    $("#modal_incioturno").modal("toggle");
    // lista_maquinaria_1();
    lista_turno_1();
    // lista_nam_operador();
    lista_nam_maquina()
    $.ajax({
        beforeSend: function () {
            //$("#list_maquinaria").html("Recuperando Lista ...");
        },
        url: 'consulta_usuario_turno.php',
        type: 'POST',
        data: null,
        success: function (x) {
            name = x.trim();
            //console.log(x);
            $("#name_operador").val(name);



        },
        error: function (jqXHR, estado, error) {
        }
    });

}




function finalizar_turno_principal() {

    swal({
        title: "Finalizar Turno",
        text: "Desea Finalizar Turno?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                finalizar_turno();
            } else {
                swal("Cancelado");
            }
        });
}




function finalizar_turno() {
    var name_xd = $("#nombre_op").text()

    $.ajax({
        beforeSend: function () {
            //$("#list_maquinaria").html("Recuperando Lista ...");
        },
        url: 'finalizar_turno.php',
        type: 'POST',
        data: { name_xd },
        success: function (x) {

            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'El turno fue finalizado.',
                showConfirmButton: false, // Oculta el botón "Aceptar"
                timer: 2000
            }).then(function () {
                // Actualizar la página
                location.reload();
            });
        },
        error: function (jqXHR, estado, error) {
        }
    });

}


function lista_turno_1() {

    $.ajax({
        beforeSend: function () {
            //$("#list_turno").html("Recuperando Lista ...");
        },
        url: 'consulta_sql_datos_turnos.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#list_turno_1").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}


// function lista_maquinaria_1(value) {
//     var valores = value.split(',');
//     var name_ope = valores[0];
//     var code_operadpr = valores[1];
//     // console.log("COD_OPERADOR 1:", name_ope);
//     // console.log("COD_OPERADOR 2:", code_operadpr);

//     $.ajax({
//         beforeSend: function () {
//             //$("#list_turno").html("Recuperando Lista ...");
//         },
//         url: 'consulta_sql_datos_maquinaria.php',
//         type: 'POST',
//         data: { name_ope },
//         success: function (x) {
//             //console.log(x);

//             $("#list_maquinaria_1").html(x);
//             $(".select2").select2();

//         },
//         error: function (jqXHR, estado, error) {
//         }
//     });

// }



// function lista_nam_operador() {

//     $.ajax({
//         beforeSend: function () {
//             //$("#list_maquinaria").html("Recuperando Lista ...");
//         },
//         url: 'consulta_name_operador.php',
//         type: 'POST',
//         data: null,
//         success: function (x) {
//             //console.log(x);

//             $("#name_operador").html(x);
//             $(".select2").select2();

//         },
//         error: function (jqXHR, estado, error) {
//         }
//     });

// };



function lista_nam_maquina() {

    $.ajax({
        beforeSend: function () {
            //$("#list_maquinaria").html("Recuperando Lista ...");
        },
        url: 'consulta_name_maquina.php',
        type: 'POST',
        data: null,
        success: function (x) {
            //console.log(x);

            $("#list_maquinaria_1").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

};



function lista_operador_1(value) {

    console.log(value);
    
    var valores = value.split(',');
    var name_ope = valores[0];
    var code_operadpr = valores[1];
    // console.log("COD_OPERADOR 1:", name_ope);
    // console.log("COD_OPERADOR 2:", code_operadpr);

    $.ajax({
        beforeSend: function () {
            //$("#list_turno").html("Recuperando Lista ...");
        },
        url: 'consulta_sql_datos_operador.php',
        type: 'POST',
        data: { name_ope },
        success: function (x) {
            //console.log(x);

            $("#name_operador").html(x);
            $(".select2").select2();

        },
        error: function (jqXHR, estado, error) {
        }
    });

}





function registrar_turno() {
    // var name = $("#nombre_operador").val();
    var name = $("#nombre_operador").val();

    // Separar los valores usando split
    var valores = name.split('|');
    var name_codi_ope = valores[0];
    var name_ope = valores[1];

    console.log("Segundo valor:", name_ope);

    var turno = $("#list_turno_1 select").val();
    var maquinaria_lis = $("#list_maquinaria_1 select").val();

    var idcl_maqui = maquinaria_lis.split(",");

    maquinaria = idcl_maqui[0];
    almacen_maquinita = idcl_maqui[1];

    if (almacen_maquinita === 0){
        almacen_maquinita = 'ALM11';
    }




    swal({
        title: "Quiere registrar Turno?",
        text: "Registre Turno",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal({
                    text: "Ingrese su contraseña:",
                    content: {
                        element: "input",
                        attributes: {
                            type: "password",
                            placeholder: "Contraseña",
                        },
                    },
                    button: {
                        text: "Registrar",
                        closeModal: false,
                    },
                })
                    .then(password => {
                        if (!password) {
                            swal("Falta Contraseña");
                            return;
                        }
                        valida_usuario(password, name_codi_ope)
                            .then(isValid => {
                                if (isValid) {
                                    //registrar_inicio_turno.php
                                    $.ajax({
                                        beforeSend: function () {
                                            //
                                        },
                                        url: 'registrar_inicio_turno.php',
                                        type: 'POST',
                                        data: { password, turno, maquinaria, name_ope, almacen_maquinita },
                                        success: function (x) {
                                            var global = x.trim();

                                            if (global === '0') {
                                                swal("Se Registró Turno", {
                                                    icon: "success",
                                                    timer: 3000,
                                                });

                                                $("#bt_eventos_finali").show();
                                                $("#bt_eventos_reini").show();
                                                $("#bt_eventos_actua").show();
                                                $("#pdf_turno").show();


                                                $("#bt_eventos_tur").hide();
                                                $("#btn_consultar").show();
                                                $("#nombre_op").text(name_ope);
                                                $("#modal_incioturno").modal("hide");

                                                setTimeout(() => {
                                                    lista_of_primera();
                                                }, "4000");
                                            } else {
                                                swal({
                                                    title: "Turno abierto",
                                                    text: "Tiene un turno abierto, ¿desea continuar?",
                                                    icon: "warning",
                                                    buttons: {
                                                        cancel: {
                                                            text: "No",
                                                            value: false,
                                                            visible: true,
                                                            className: "",
                                                            closeModal: true,
                                                        },
                                                        confirm: {
                                                            text: "Sí",
                                                            value: true,
                                                            visible: true,
                                                            className: "",
                                                            closeModal: true
                                                        }
                                                    },
                                                    dangerMode: true,
                                                }).then((willContinue) => {
                                                    if (willContinue) {
                                                        swal("Sigue en Turno", {
                                                            icon: "success",
                                                            timer: 3000,
                                                        });

                                                        $("#bt_eventos_finali").show();
                                                        $("#bt_eventos_reini").show();
                                                        $("#bt_eventos_actua").show();
                                                        $("#pdf_turno").show();

                                                        $("#bt_eventos_tur").hide();
                                                        $("#btn_consultar").show();
                                                        $("#nombre_op").text(name_ope);
                                                        $("#codi_nombre_op").text(name_codi_ope);
                                                        consult_maq_turno(name_ope);
                                                        $("#modal_incioturno").modal("hide");
                                                        setTimeout(() => {
                                                            lista_of_primera();
                                                        }, "4000");

                                                    } else {
                                                        $("#modal_incioturno").modal("hide");
                                                        swal("Turno no continuado", {
                                                            icon: "error",
                                                            timer: 3000,
                                                        });
                                                    }
                                                });
                                            }



                                        },
                                        error: function (jqXHR, estado, error) {
                                        }
                                    });

                                    // Aquí puedes llamar a otra función si es necesario.
                                } else {
                                    swal("Contraseña Incorrecta");
                                }
                            })
                            .catch(error => {
                                console.error("Error al validar usuario:", error);
                                swal("Ocurrió un error al validar el usuario");
                            });
                    });
            } else {
                swal("No se Registro Turno");
            }
        });
}

function valida_usuario(password, name) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'consulta_pin_usuario.php',
            type: 'POST',
            data: {
                password: password,
                name: name
            },
            success: function (response) {
                console.log(response);
                const result = response.trim();
                if (result === 'SI') {
                    resolve(true); // Usuario válido
                } else {
                    resolve(false); // Usuario inválido
                }
            },
            error: function (error) {
                reject(error); // Error en la llamada AJAX
            }
        });
    });
}

function eventos_generales() {
    $("#modal_eventos_grales").modal("toggle");
    var fechai = $("#fecha_inicio").val();


    $.ajax({
        beforeSend: function () {
        },
        url: 'reporte_x_turno_operario.php',
        type: 'POST',
        data: { fechai },
        success: function (x) {
            $("#reporte_turno").html(x);
            $("#tabla_reporte").DataTable({
                order: [[0, 'asc']]
            });

        },
        error: function (jqXHR, estado, error) {
        }
    });

}

function refrescar() {
    location.reload();
}
