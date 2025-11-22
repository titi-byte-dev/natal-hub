---
title: "Natal do Village"
body_classes: "absolute"
forms:
    -
        name: confirm_email
        inline_errors: true
        attributes:
            "x-on:submit.prevent": "confirmEmail"
        classes: w-full
        fields:
            -
                name: email
                label: false
                placeholder: ''
                type: text
                outerclasses: search-wrapper border-b-2 w-full flex justify-end items-center
                classes: form-input border-none focus:ring-0 text-right w-full
                attributes:
                    "x-model": "email"
                validate:
                    required: true
        buttons:
            -
                type: submit
                value: Votar
                classes: 'btn w-full mt-2'
        process:
            magic_link: true
            message: 'teste'

    -
        name: vote
        inline_errors: true
        attributes:
            "x-on:submit.prevent": "confirmVote"
        classes: w-full
        fields:
            -
                name: text
                label: false
                placeholder: '*****'
                type: text
                outerclasses: search-wrapper border-b-2 w-full flex justify-end items-center
                classes: form-input border-none focus:ring-0 text-right w-full
                minlength: 5
                maxlength: 5
                attributes:
                    "x-model": "code"
                validate:
                    type: number
                    pattern: "[0-9]+"
                    required: true
        buttons:
            -
                type: submit
                value: Confirmar Voto
                classes: 'btn w-full mt-2'
        process:
            magic_link: true
            message: 'teste'
---
