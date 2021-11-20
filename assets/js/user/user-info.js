$(function() {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '用户昵称必须在6位以内！'
        }
    })
    getUserInfo();


    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        getUserInfo();
    });
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('更新用户信息成功');
                window.parent.getUserInfo();
            }
        })
    })

    function getUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                form.val('user-info-form', res.data)
            }
        })
    }

})