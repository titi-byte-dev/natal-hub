---
title: Login
expires: 0

login_redirect_here: false

body_classes: login_page h-screen flex flex-col
forms:
  login:
    action:
    method: post

    fields:
        section_login:
            type: section
            title: 'Insere a senha para continuar:'
            markdown: true
            fields:
                password:
                  type: password
                  id: password
                  display_label: false
                  classes: border-none ring-0 text-center w-full lg:w-auto font-fb
                  outerclasses: 'mt-4 border-b-2 mb-4'
                  placeholder: '* * * * * *'
                  label: 'Password'
                  autofocus: true
        username:
          type: hidden
          id: username
          placeholder: PLUGIN_LOGIN.USERNAME_EMAIL
          label: PLUGIN_LOGIN.USERNAME_EMAIL
          default: login

---
