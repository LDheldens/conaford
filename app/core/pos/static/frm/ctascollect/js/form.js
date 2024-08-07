var fv;
var input_datejoined;
var select_ctascollect;

// variable que alert,macena la cantidad de cuantas cuotas ya se pagaron
let payment_count

// variable que almacena el numero de pago a relizar ahora
let paymentNumber

// variable que almacena el valor a pagar ahora
let paymentAmount;

document.addEventListener('DOMContentLoaded', function (e) {
    const form = document.getElementById('frmForm');
    fv = FormValidation.formValidation(form, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                ctascollect: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un cuenta por pagar'
                        }
                    }
                },
                date_joined: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
                valor: {
                    validators: {
                        numeric: {
                            message: 'El valor no es un número',
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        }
                    }
                },
                desc: {
                    validators: {}
                },
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fv.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(form.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            var parameters = {};
            $.each($(fv.form).serializeArray(), function (key, item) {
                parameters[item.name] = item.value;
            })
            parameters.paymentNumber = paymentNumber

            if (Number(parameters.valor) != paymentAmount) {
                alert(`El monto a pagar tiene que ser de S./ ${paymentAmount}`)
                return
            }

            submit_with_ajax('Notificación',
                '¿Estas seguro de realizar la siguiente acción?',
                pathname,
                parameters,
                function (request) {

                    window.open('/pos/frm/ctas/collect/print/voucher/' + request.id + '/', '_blank');
                    
                    setTimeout(function () {
                        location.href = fv.form.getAttribute('data-url');
                    }, 500);  
                }
            );

        });
});

$(function () {

    input_datejoined = $('input[name="date_joined"]');
    select_ctascollect = $('select[name="ctascollect"]');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es"
    });

    select_ctascollect.select2({
        theme: "bootstrap4",
        language: 'es',
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            url: pathname,
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    action: 'search_ctascollect'
                }
                return queryParameters;
            },
            processResults: function (data) {
                console.log(data)
                return {
                    results: data
                };
                
            },
        },
        placeholder: 'Ingrese una descripción',
        minimumInputLength: 1,
    })
        .on('select2:select', function (e) {
            fv.revalidateField('ctascollect');
            var data = e.params.data;
            $('.deuda').html('Saldo: $' + parseFloat(data.saldo).toFixed(2));
            $('input[name="valor"]').trigger("touchspin.updatesettings", {max: parseFloat(data.saldo)});

            const {saldo} = data

            payment_count = data.payment_count

            paymentAmount = (saldo / (3 - payment_count)).toFixed(2);

            paymentNumber = payment_count + 1; 

            $('input[name="valor"]').val(paymentAmount);
            $('textarea[name="desc"]').val(`Pago N.º ${paymentNumber}`);
            
        })
        .on('select2:clear', function (e) {
            fv.revalidateField('|');
            $('.deuda').html('');
        });

    $('input[name="valor"]').TouchSpin({
        min: 0.01,
        max: 1000000,
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
        prefix: 'S/.',
        verticalbuttons: true,
    }).on('change touchspin.on.min touchspin.on.max', function () {
        fv.revalidateField('valor');
    }).keypress(function (e) {
        return validate_decimals($(this), e);
    });

    input_datejoined.datetimepicker({
        format: 'YYYY-MM-DD',
        locale: 'es',
        keepOpen: false,
        // date: new moment().format("YYYY-MM-DD")
    });

    input_datejoined.on('change.datetimepicker', function () {
        fv.revalidateField('date_joined');
    });

    $('.deuda').html('');
});
