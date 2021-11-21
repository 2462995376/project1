$(function() {
    const layer = layui.layer;
    const form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                let html = template('tpl-table', res);
                $('.layui-table tbody').html(html)
            }
        })
    }
    var layerAddIndex = null;
    $('#btnAddcate').on('click', function() {
        layerAddIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#layer-add').html()
        });
    })


    $('body').on('submit', '#form-add', function(e) {

        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('添加文章列表成功');
                layer.close(layerAddIndex);
            }
        })
    })

    var layerEditIndex = null;
    $('tbody').on('click', '.btn-edit', function() {
        layerEditIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#layer-edit').html()
        });



        let id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('layer-edit', res.data)
            }
        })
    })


    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('更改成功！');
                initArtCateList();
                layer.close(layerEditIndex);
            }
        })
    })


    var layerDeleteIndex = null;
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layerDeleteIndex = layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(layerDeleteIndex) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg('删除成功');
                    initArtCateList();
                    layer.close(layerDeleteIndex);
                }
            })

        });
    })
})