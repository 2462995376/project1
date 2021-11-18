$(function() {
    $('#link-reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link-login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 验证表单
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repsd: function(value) {
            let psd = $('.reg-box [name=password]').val();
            if (psd !== value) {
                return '两次输入密码不一致'
            }
        }
    })

    // 监听表单提交事件
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        let username = $('#form-reg [name=username]').val();
        let password = $('#form-reg [name=password]').val();
        $.post('/api/reguser', { username, password },
            function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功！请登录');
                $('#form-login')[0].reset();
                $('#link-login').click();
            })
    })

    $('#form-login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('登录成功');
                $('#form-login')[0].reset();
                localStorage.setItem('token', res.token)
                location.href = './index.html'
            }
        })
    })
})