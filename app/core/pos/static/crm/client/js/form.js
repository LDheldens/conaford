var fv;
var input_birthdate;

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
                first_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                    }
                },
                last_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                    }
                },
                dni: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 8,
                            max:8
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: form.querySelector('[name="dni"]').value,
                                    type: 'dni',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El número de cedula ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 7
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: form.querySelector('[name="mobile"]').value,
                                    type: 'mobile',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El número de teléfono ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                address: {
                    validators: {
                        stringLength: {
                            min: 4,
                        }
                    }
                },
                // birthdate: {
                //     validators: {
                //         notEmpty: {
                //             message: 'La fecha es obligatoria'
                //         },
                //         date: {
                //             format: 'YYYY-MM-DD',
                //             message: 'La fecha no es válida'
                //         }
                //     },
                // },
                // image: {
                //     validators: {
                //         file: {
                //             extension: 'jpeg,jpg,png',
                //             type: 'image/jpeg,image/png',
                //             maxFiles: 1,
                //             message: 'Introduce una imagen válida'
                //         }
                //     }
                // },
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
            submit_formdata_with_ajax_form(fv);
        });
});

$(function () {


    input_birthdate.datetimepicker('date', input_birthdate.val());

    input_birthdate.on('change.datetimepicker', function (e) {
        fv.revalidateField('birthdate');
    });

    $('input[name="first_name"]').keypress(function (e) {
        return validate_form_text('letters', e, null);
    });

    $('input[name="last_name"]').keypress(function (e) {
        return validate_form_text('letters', e, null);
    });

    $('input[name="dni"]').keypress(function (e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="mobile"]').keypress(function (e) {
        return validate_form_text('numbers', e, null);
    });
});

