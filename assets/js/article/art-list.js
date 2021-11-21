$(function() {
    const layer = layui.layer;
    const form = layui.form;

    template.defualt.imports.dateFormat = function(date) {
        let dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let h = padZero(dt.getHours())
        let m = padZero(dt.getMinutes())
        let s = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initartList();
    initCate();

    function initartList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                let htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                layer.msg('更新文章成功！')
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
                renderPage(res.total)
            }
        })
    }

    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }
})