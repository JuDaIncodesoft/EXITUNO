function lista_datos_ma() {
    fechai = $("#fechai").val();
    fechaf = $("#fechaf").val();
      $.ajax({
        beforeSend: function () {
          $("#lista_datos_maestros").html("Recuperando Lista ...");
        },
        url: "consulta_listado_maestros.php",
        type: "POST",
        data: { fechai:fechai,fechaf:fechaf  },
        success: function (x) {
          $("#lista_datos_maestros").html(x);
          $("#tabla_cot").DataTable({
            order: [[0, 'desc']],
            columnDefs: [{
              width: "120px",
              targets: 1
            }
            ]
          });
        },
        error: function (jqXHR, estado, error) { },
      });
    }
    
    function lista_grupoA() {
      $(document).ready(function () {
    
        $.ajax({
          beforeSend: function () {
            $("#grupo_articulo").html("Cargando...");
          },
          url: 'pone_grupo_articulos.php',
          type: 'POST',
          data: null,
          success: function (x) {
            $("#grupo_articulo").html(x);
            $(".select2").select2();
            $("#grupo_articulo select").val("105").trigger("change.select2");
            $.ajax({
                beforeSend: function () {
                  $("#familia_articulo").html("Cargando...");
                },
                url: 'lista_familia_grupo_oitm.php',
                type: 'POST',
                data: {docentry:105},
                success: function (x) {
                  $("#familia_articulo").html(x);
                  $(".select2").select2();
                },
                error: function (jqXHR, estado, error) {
                }
              }); 
          },
          error: function (jqXHR, estado, error) {
          }
        });
      });
    }
    
    
    function lista_grupoUnidad() {
      $(document).ready(function () {
    
        $.ajax({
          beforeSend: function () {
            $("#grupo_medida").html("Cargando...");
          },
          url: 'pone_grupo_unidad.php',
          type: 'POST',
          data: null,
          success: function (x) {
            $("#grupo_medida").html(x);
            $(".select2").select2();
          },
          error: function (jqXHR, estado, error) {
          }
        });
      });
    }
    
    
    function lista_igv_compras() {
      $(document).ready(function () {
    
        $.ajax({
          beforeSend: function () {
            $("#igv_compras").html("Cargando...");
          },
          url: 'pone_igv_compras.php',
          type: 'POST',
          data: null,
          success: function (x) {
            $("#igv_compras").html(x);
            $(".select2").select2();
            $("#igv_compras select").val("IGV").trigger("change.select2");
          },
          error: function (jqXHR, estado, error) {
          }
        });
      });
    }
    
    
    function lista_igv_ventas() {
      $(document).ready(function () {
    
        $.ajax({
          beforeSend: function () {
            $("#igv_ventas").html("Cargando...");
          },
          url: 'pone_igv_ventas.php',
          type: 'POST',
          data: null,
          success: function (x) {
            $("#igv_ventas").html(x);
            $(".select2").select2();
            $("#igv_ventas select").val("IGV").trigger("change.select2");
          },
          error: function (jqXHR, estado, error) {
          }
        });
      });
    }
    
    function registrar_datos_modal() {
        swal({
            title: "Quiere Regsitrar Articulo?",
            text: "Reguistre Articulo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    
                    registrar_datos();
    
                } else {
                    swal("No se Registro Articulo");
                }
            });
    }
    
    function registrar_datos(){
      numero_articulo = $("#num_articulo").val();
      descripcion_articulo = $("#descripcion_articulo").val().toUpperCase();  
      clase_articulo = $("#clase_articulo option:selected").val();
      grupo_articulo = $("#grupo_articulo option:selected").val();
      grupo_medida = $("#grupo_medida option:selected").val();
      num_catalogo = $("#num_catalogo").val();
      codigo_um_compras = $("#codigo_um_compras").val();
      igv_compras = $("#igv_compras option:selected").val();
      igv_ventas = $("#igv_ventas option:selected").val();
      cod_um_recuento = $("#cod_um_recuento").val();
      nom_um_recuento = $("#nom_um_recuento").val();
      peso_articulo = $("#peso_articulo").val();
      if ($('#check_articulo_Inven').prop('checked')) {
        check_inventario = 'YES';
      } else {
         check_inventario = 'NO';
      }
      if ($('#check_articulo_Compra').prop('checked')) {
        check_compra= 'YES';
      } else {
         check_compra = 'NO';
      }
      if ($('#check_articulo_Venta').prop('checked')) {
        check_venta = 'YES';
      } else {
         check_venta = 'NO';
      }
      sub_familia = $("#subfamilia_articulo select").val();
      familia = $("#familia_articulo select").val();
      bandera = true;
      if (grupo_articulo === ''){
        bandera = false;
        alertify.error("Ingresar Grupo de Articulo");
      }
      if (descripcion_articulo === ''){
        bandera = false;
        alertify.error("Ingresar Descripcion");
      }
      if (sub_familia === 'Seleccione un Item'){
        bandera = false;
        alertify.error("Seleccione Sub-Familia");
      }
       if (familia === 'Seleccione un Item'){
        bandera = false;
        alertify.error("Seleccione Familia");
      }
      // if (num_catalogo === ''){
      //   bandera = false;
      //   alertify.error("Ingresar # de Catalogo");
      // }
      if (codigo_um_compras === ''){
        bandera = false;
        alertify.error("Ingresar codigo UM de Compras");
      }
      if (igv_compras === ''){
        bandera = false;
        alertify.error("Seleccione IGV de Compras");
      }
      if (igv_ventas === ''){
        bandera = false;
        alertify.error("Seleccione IGV de Ventas");
      }
      if (peso_articulo === '' || parseFloat(peso_articulo) <=0){
        bandera = false;
        alertify.error("Peso de Articulo  Invalido");
      }
      if (bandera === true){
        $.ajax({
            beforeSend: function () {
            },
            url: 'registra_datos_articulos.php',
            type: 'POST',
            data: {numero_articulo:numero_articulo, descripcion_articulo:descripcion_articulo, clase_articulo:clase_articulo, grupo_articulo:grupo_articulo,grupo_medida:grupo_medida,
                  num_catalogo:num_catalogo, codigo_um_compras:codigo_um_compras, igv_compras:igv_compras, igv_ventas:igv_ventas, cod_um_recuento:cod_um_recuento,  nom_um_recuento:nom_um_recuento,
                  check_inventario:check_inventario,check_compra:check_compra,check_venta:check_venta,sub_familia:sub_familia,familia:familia,peso_articulo:peso_articulo},
            success: function (data) {
                global = parseInt(data);
              if (global == 0) {
                  alertify.error("No inserto");
              } else {
                migrar_sap(global, 6);
                $("#num_articulo").val("");
                $("#descripcion_articulo").val("");
                $("#num_catalogo").val("");
                $("#codigo_um_compras").val("");
                $("#cod_um_recuento").val("");
                $("#nom_um_recuento").val("");
                swal("Se registro correctamente ", {
                    icon: "success",
                });
              }
              lista_datos_ma();
      
            },
            error: function (jqXHR, estado, error) {
             $("#errores").html('Error... ' + estado + '  ' + error);
            }
        });
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
    function handleSelectChange(selector, nextElement, url, updateValueFunction, resetElements = []) {
        $(document).on("change", selector, function () {
            let originalValue = this.value;
            
            // Llamamos a la función que actualizará el valor de num_articulo
            let updatedValue = updateValueFunction(originalValue);
            $("#num_articulo").val(updatedValue);
    
            // Reiniciar los elementos dependientes si hay alguno
            resetElements.forEach(function (element) {
                $(element).html("").trigger("change");  // Reinicia el valor y desencadena el evento change para limpiar select2
            });
    
            $.ajax({
                beforeSend: function () {
                    $(nextElement).html("Cargando...");
                },
                url: url,
                type: 'POST',
                data: { docentry: originalValue },
                success: function (response) {
                    $(nextElement).html(response);
                    $(".select2").select2();
    
                    // Solo en el último select hacemos la lógica adicional
                    if (nextElement === "#codigo_sap_articulo") {
                        let numericValue = parseInt(response, 10);
                        let newValue = (numericValue + 1).toString().padStart(response.length, '0');
                        let finalValue = updatedValue + newValue;
                        $("#num_articulo").val(finalValue);
                    }
                },
                error: function (jqXHR, estado, error) {
                    console.error('Error en la solicitud AJAX', error);
                }
            });
        });
    }
    
    // Función para actualizar el valor de #num_articulo
    function updateNumArticuloForGroup(value) {
        return value;
    }
    
    function updateNumArticuloForFamily(value) {
        let groupValue = $("#grupo_articulo select").val();
        return groupValue + value;
    }
    
    function updateNumArticuloForSubFamily(value) {
        let groupValue = $("#grupo_articulo select").val();
        let familyValue = $("#familia_articulo select").val();
        return groupValue + familyValue + value;
    }
    
    // Configuraciones específicas
    // handleSelectChange("#grupo_articulo select", "#familia_articulo", 'lista_familia_grupo_oitm.php', updateNumArticuloForGroup, ["#familia_articulo", "#subfamilia_articulo"]);
    // handleSelectChange("#familia_articulo select", "#subfamilia_articulo", 'lista_subfamilia_grupo_oitm.php', updateNumArticuloForFamily, ["#subfamilia_articulo"]);
    // handleSelectChange("#subfamilia_articulo select", "#codigo_sap_articulo", 'lista_codigo_sap_oitm.php', updateNumArticuloForSubFamily);
    
    
    
    
    $(document).on("change", "#grupo_articulo select", function () {
      var id = this.value
      $("#num_articulo").val(id);
    
      $.ajax({
          beforeSend: function () {
            $("#familia_articulo").html("Cargando...");
          },
          url: 'lista_familia_grupo_oitm.php',
          type: 'POST',
          data: {docentry:id},
          success: function (x) {
            $("#familia_articulo").html(x);
            $(".select2").select2();
          },
          error: function (jqXHR, estado, error) {
          }
        });  
    })
    $(document).on("change", "#familia_articulo select", function () {
        $("#num_articulo").val('');
      id = $("#grupo_articulo select").val();
      id2= id + this.value
      $("#num_articulo").val(id2);
    
       $.ajax({
          beforeSend: function () {
            $("#subfamilia_articulo").html("Cargando...");
          },
          url: 'lista_subfamilia_grupo_oitm.php',
          type: 'POST',
          data: {docentry:this.value},
          success: function (x) {
            $("#subfamilia_articulo").html(x);
            $(".select2").select2();
          },
          error: function (jqXHR, estado, error) {
          }
        }); 
    }) 
    $(document).on("change", "#subfamilia_articulo select", function () {
        $("#num_articulo").val('');
      id =$("#grupo_articulo select").val();
      id2 =$("#familia_articulo select").val();
      id3= id +id2+ this.value
      $("#num_articulo").val(id3);
    
        $.ajax({
          beforeSend: function () {
           // $("#subfamilia_articulo").html("Cargando...");
          },
          url: 'lista_codigo_sap_oitm.php',
          type: 'POST',
          data: {docentry:id3},
          success: function (x) {
            console.log(x);
            
            id = $("#num_articulo").val();
            value= x;
            let numericValue = parseInt(value, 10);
            let newValue = (numericValue + 1).toString();
            
            // Añadir ceros a la izquierda si es necesario (4 dígitos)
            while (newValue.length < value.length) {
                newValue = '0' + newValue;
            }
            let resultText = `${newValue}`;
            console.log(resultText)
             id2= id + resultText
            
              $("#num_articulo").val(id2);
          },
          error: function (jqXHR, estado, error) {
          }
        });  
    }) 
    $(document).on("change", "#grupo_medida select", function () {
      id = this.value;
    
      $('#codigo_um_compras').val(id);
      $('#cod_um_recuento').val(id);
    })
    
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
    
