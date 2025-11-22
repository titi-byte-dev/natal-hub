---
title: Upload
expires: 0
cache_enabled: false
form:
    name: profile-form
    inline_errors: true
    action: '/#form'
    classes: w-full lg:w-auto
    fields:
        nome:
            type: text
            label: 'Nome Completo'
            display_label: false
            classes: border-none ring-0 w-full bg-transparent
            outerclasses: 'mt-4 mb-4 md:mb-0 md:mt-4 border-b-2 '
            title: 'Campo Obrigatório'
            placeholder: Nome
            validate:
                required: true
                message: 'Campo Obrigatório'
        email:
            type: text
            label: 'Email'
            display_label: false
            placeholder: Email (user@globalservs.com)
            classes: border-none ring-0 w-full bg-transparent
            outerclasses: 'border-b-2 mb-4 md:mb-0'
            title: 'Usa o teu email user@globalservs.com'
            validate:
                required: true
                pattern: '[a-zA-Z0-9._%+-]+@globalservs.com'
                message: 'Usa o teu email user@globalservs.com'
        team:
            type: select
            label: Região
            display_label: false
            classes: border-none ring-0 w-full pl-2 pr-2 bg-transparent
            labelclasses: bold
            outerclasses: 'border-b-2 mb-4 md:mb-0'
            placeholder: 'Empresa'
            data-options@: '\Grav\Theme\HavasVillageNatal::getTeams'
            title: 'Em que empresa do Village trabalhas?'
            oninvalid: 'Em que empresa do Village trabalhas?'
            validate:
                required: true
                message: 'Em que empresa do Village trabalhas?'
        image:
            type: file
            multiple: false
            label: 'A tua árvore de Natal (máximo 2MB)'
            outerclasses: 'form-group mt-4 md:mt-0'
            labelclasses: mt-2 pl-2 mb-3
            filesize: 2
            accept:
                - image/*
    buttons:
        -
            type: submit
            classes: 'w-1/2 mx-auto text-white'
            value: Participar
    process:
        havas_process: true
        message: 'Árvore enviada com sucesso. Obrigado pela tua participação.'
        display: '/'
        reset: true
---
