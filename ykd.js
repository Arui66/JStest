const $ = new Env('悦看点');
let status;

status = (status = ($.getval("ykdstatus") || "1")) > 1 ? `${status}` : "";
const ykdurlArr = [], ykdhdArr = [], ykdcount = ''
let ykdurl = $.getdata('ykdurl')
let ykdhd = $.getdata('ykdhd')
let b = Math.round(new Date().getTime() / 1000).toString();
let DD = RT(28000, 35000)
let tz = ($.getval('tz') || '1');
let tx = ($.getval('tx') || '1');
let id = '', txid = ''
let y = -1
let tck ='', tck1 = '', tck2 = ''
$.message = ''


!(async () => {
    if (typeof $request !== "undefined") {
        await ykdck()
    } else {
        ykdurlArr.push($.getdata('ykdurl'))
        ykdhdArr.push($.getdata('ykdhd'))

        let ykdcount = ($.getval('ykdcount') || '1');
        for (let i = 2; i <= ykdcount; i++) {
            ykdurlArr.push($.getdata(`ykdurl${i}`))
            ykdhdArr.push($.getdata(`ykdhd${i}`))
        }
        console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`);
        for (let i = 0; i < ykdhdArr.length; i++) {
            if (ykdhdArr[i]) {
                ykdurl = ykdurlArr[i];
                ykdhd = ykdhdArr[i];
                $.index = i + 1;
                console.log(`\n\n开始【悦看点${$.index}】`)

                for (let x = 0; x < 2; x++) {
                    if (y < 4) {
                        y++
                    }
                    $.index = x + 1
                    console.log(`\n【开始第${x + 1}个气泡任务!】\n等待2秒开始气泡任务`)
                    await ykdqp(y)
                    await $.wait(2000)
                }


                for (let k = 0; k < 6; k++) {
                    $.index = k + 1
                    console.log(`\n【开始第${k + 1}个看资讯任务!】\n等待2秒开始看资讯任务`)
                    await ykdzb()
                     await $.wait(2000)
                }
                await $.wait(3000)
                await ykdzxhb()
                await $.wait(3000)
                for (let m = 0; m < 6; m++) {
                    $.index = m + 1
                    console.log(`\n【开始第${m + 1}个看视频任务!】\n等待2秒开始看视频任务`)
                    await ykdsphq()
                    await $.wait(3000)
                }
                await ykdsphb()
                await $.wait(3000)
                await ykdgghq()
                await ykdprofile()
                await $.wait(5000)
                await ykdtx()
                await $.wait(2000)
                //await grxx()
                //await $.wait(3000)
                message()
            }
        }
    }
})()

    .catch((e) => $.logErr(e))
    .finally(() => $.done())



function ykdck() {
    if ($request.url.indexOf("profile") > -1) {
        const ykdurl = $request.url
        if (ykdurl) $.setdata(ykdurl, `ykdurl${status}`)
        $.log(ykdurl)

        const ykdhd = JSON.stringify($request.headers)
        if (ykdhd) $.setdata(ykdhd, `ykdhd${status}`)
        $.log(ykdhd)


        $.msg($.name, "", `悦看点${status}获取headers成功`)

    }
}
//个人信息
function ykdprofile(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/member/profile?debug=0&`,
            headers: JSON.parse(ykdhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log(`【用户名】：${result.result.nickname}\n`)
                    console.log(`【当前金币余额】：${result.result.point}\n`)
                    console.log(`【当前红包余额】：${result.result.balance}\n`)
                    console.log(`【今日获得金币】：${result.result.today_point}\n`)
                    $.message += `【用户名】：${result.result.nickname}\n`
                    $.message += `【当前金币余额】：${result.result.point}\n`
                    $.message += `【当前红包余额】：${result.result.balance}\n`
                    $.message += `【今日获得金币】：${result.result.today_point}\n`
                    // //判定boxjs是否打开了自动提现    当前时间是否在21~22点之间   
                    // if (tx == 1 && (nowTimes.getHours() === 21 || nowTimes.getHours() === 22) && (nowTimes.getMinutes() >= 30 && nowTimes.getMinutes() <= Minutes)) {

                    //条件满足则运行以下内容 
                    // await $.wait(3000)
                    // await sqtx()
                } else {
                    console.log(`【查询信息失败】\n`)
                    $.message += `【查询信息失败】\n`
                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//申请提现
function ykdtx(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/cash/exchange?`,
            headers: JSON.parse(ykdhd),
            body: `amount=0.3
            &
            gate=wechat
            &
            =`,
        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【申请提现】：${result.result.title}\n`)
                    console.log(`【通知】：${result.result.message}\n`)
                    $.message += `【申请提现】：${result.result.title}\n`
                    $.message += `【通知】：${result.result.message}\n`

                } else {

                    console.log(`【申请提现失败】：${result.message}\n`)
                    $.message += `【申请提现失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}



//气泡
function ykdqp(y) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/coin?`,
            headers: JSON.parse(ykdhd),
            body: `id=${y}
            &
            =`,
        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【开始领取气泡金币】：${result.result.coin}\n`)
                    console.log(`【领取成功】：${result.result.message}\n`)
                    $.message += `【开始领取气泡金币】：${result.result.coin}\n`
                    $.message += `【开始领取气泡金币】：${result.result.message}\n`

                } else {

                    console.log(`【开始领取气泡金币失败】：${result.message}\n`)
                    $.message += `【领取气泡金币失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}










//看新闻准备
function ykdzb(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/news/detail?`,
            headers: JSON.parse(ykdhd),

        }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【准备开始看资讯】\n`)
                    $.message += `【准备开始看资讯】：${result.result.title}\n`
                    tck = result.result.ticket
                    await $.wait(3000)
                    await ykdjg()
                    await $.wait(8000)
                    await ykdzx(tck)
                } else {

                    console.log(`【准备开始看资讯失败】：${result.message}\n`)
                    $.message += `【准备开始看资讯失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//看新闻间隔8秒
function ykdjg(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/news/interval?`,
            headers: JSON.parse(ykdhd),

        }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【看资讯间隔8秒】\n`)
                    $.message += `【看资讯间隔8秒】\n`

                } else {

                    console.log(`【看资讯间隔8秒失败】：${result.result.status}\n`)
                    $.message += `【看资讯间隔8秒失败】：${result.result.status}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}



//看新闻
function ykdzx(tck) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/news?`,
            headers: JSON.parse(ykdhd),
            body: `ticket=${tck}
            &
            =`,
        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【看资讯成功获得金币】：${result.result.reward}\n`)
                    $.message += `【看资讯成功获得金币】：${result.result.reward}\n`

                } else {

                    console.log(`【看资讯失败】：${result.message}\n`)
                    $.message += `【看资讯失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}

//看资讯开红包
function ykdzxhb(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/news/open?`,
            headers: JSON.parse(ykdhd),

        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【看资讯开红包获得金币】：${result.result.reward}\n`)
                    $.message += `【看资讯开红包获得金币】：${result.result.reward}\n`

                } else {

                    console.log(`【看资讯开红包失败】：${result.message}\n`)
                    $.message += `【看资讯开红包失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}



//刷视频获取
function ykdsphq(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/video?short=1&`,
            headers: JSON.parse(ykdhd),

        }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【刷视频任务获取成功等待8秒刷视频】\n`)
                    $.message += `【刷视频任务获取成功等待8秒刷视频】\n`
                    tck1 = result.result.ticket
                    await $.wait(8000)
                    await ykdsp(tck1)
                } else {

                    console.log(`【刷视频任务获取失败】：${result.message}\n`)
                    $.message += `【刷视频任务获取失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//刷视频
function ykdsp(tck1) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/video?`,
            headers: JSON.parse(ykdhd),
            body: `ticket=${tck1}
            &
            short=1
            &
            =`,
        }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【刷视频获得金币】：${result.result.reward}\n`)
                    $.message += `【刷视频获得金币】：${result.result.reward}\n`
                    tck1 = result.result.ticket
                    await $.wait(8000)
                    await ykdsp(tck1)
                } else {

                    console.log(`【刷视频失败】：${result.message}\n`)
                    $.message += `【刷视频失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}



//刷视频开红包
function ykdsphb(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/reward/video/open?`,
            headers: JSON.parse(ykdhd),
            body: `short=1
            &
            =`,
        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【刷视频开红包获得金币】：${result.result.reward}\n`)
                    $.message += `【刷视频开红包获得金币】：${result.result.reward}\n`

                } else {

                    console.log(`【刷视频开红包失败】：${result.message}\n`)
                    $.message += `【刷视频开红包失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

//看广告获取
function ykdgghq(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/zhuan/video?`,
            headers: JSON.parse(ykdhd),

        }
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【看广告获取id成功，等待5秒开始看广告】\n`)
                    $.message += `【看广告获取id成功，等待5秒开始看广告\n`
                    tck2 = result.result.ticket
                    await $.wait(5000)
                    await ykdgg(tck2)
                } else {

                    console.log(`【看广告获取id失败】：${result.message}\n`)
                    $.message += `【看广告获取id失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}


//看广告
function ykdgg(tck2) {
    return new Promise((resolve) => {

        let url = {
            url: `https://yuekandian.yichengw.cn/api/v1/ad/log?ticket=${tck2}&type=5&`,
            headers: JSON.parse(ykdhd),

        }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)

                if (result.code == 0) {

                    console.log(`【看广告成功】\n`)
                    $.message += `【看广告成功\n`
                    tck2 = result.result.ticket
                    await $.wait(5000)
                    await ykdgg(tck2)
                } else {

                    console.log(`【看广告获取id失败】：${result.message}\n`)
                    $.message += `【看广告获取id失败】：${result.message}\n`

                }
            } catch (e) {

            } finally {

                resolve()
            }
        }, 0)
    })
}





function message() {
    if (tz == 1) { $.msg($.name, "", $.message) }
}

function RT(X, Y) {
    do rt = Math.floor(Math.random() * Y);
    while (rt < X)
    return rt;
}


//console.log('\n'+getCurrentDate());
function getCurrentDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;


}











function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }
        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? {
                url: opts
            } : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }
            return new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(resp)
                })
            })
        }
        get(opts) {
            return this.send.call(this.env, opts)
        }
        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }
    return new (class {
        constructor(name, opts) {
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name
                }, 开始!`)
        }
        isNode() {
            return 'undefined' !== typeof module && !!module.exports
        }
        isQuanX() {
            return 'undefined' !== typeof $task
        }
        isSurge() {
            return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
        }
        isLoon() {
            return 'undefined' !== typeof $loon
        }
        isShadowrocket() {
            return 'undefined' !== typeof $rocket
        }
        toObj(str, defaultValue = null) {
            try {
                return JSON.parse(str)
            } catch {
                return defaultValue
            }
        }
        toStr(obj, defaultValue = null) {
            try {
                return JSON.stringify(obj)
            } catch {
                return defaultValue
            }
        }
        getjson(key, defaultValue) {
            let json = defaultValue
            const val = this.getdata(key)
            if (val) {
                try {
                    json = JSON.parse(this.getdata(key))
                } catch { }
            }
            return json
        }
        setjson(val, key) {
            try {
                return this.setdata(JSON.stringify(val), key)
            } catch {
                return false
            }
        }
        getScript(url) {
            return new Promise((resolve) => {
                this.get({
                    url
                }, (err, resp, body) => resolve(body))
            })
        }
        runScript(script, runOpts) {
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http: //${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: {
                        'X-Key': key,
                        'Accept': '*/*'
                    }
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }
        loaddata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }
        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/[(d+)]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }
        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[]]+/g) || []
            path
                .slice(0, -1)
                .reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
                path[path.length - 1]
            ] = value
            return obj
        }
        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?).(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }
        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?).(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }
        getval(key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.read(key)
            } else if (this.isQuanX()) {
                return $prefs.valueForKey(key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                return this.data[key]
            } else {
                return (this.data && this.data[key]) || null
            }
        }
        setval(val, key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.write(val, key)
            } else if (this.isQuanX()) {
                return $prefs.setValueForKey(val, key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                this.data[key] = val
                this.writedata()
                return true
            } else {
                return (this.data && this.data[key]) || null
            }
        }
        initGotEnv(opts) {
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if (opts) {
                opts.headers = opts.headers ? opts.headers : {}
                if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
                    opts.cookieJar = this.ckjar
                }
            }
        }
        get(opts, callback = () => { }) {
            if (opts.headers) {
                delete opts.headers['Content-Type']
                delete opts.headers['Content-Length']
            }
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.get(opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                this.got(opts)
                    .on('redirect', (resp, nextOpts) => {
                        try {
                            if (resp.headers['set-cookie']) {
                                const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                                if (ck) {
                                    this.ckjar.setCookieSync(ck, null)
                                }
                                nextOpts.cookieJar = this.ckjar
                            }
                        } catch (e) {
                            this.logErr(e)
                        }
                        // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                    })
                    .then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body
                            } = resp
                            callback(null, {
                                status,
                                statusCode,
                                headers,
                                body
                            }, body)
                        },
                        (err) => {
                            const {
                                message: error,
                                response: resp
                            } = err
                            callback(error, resp, resp && resp.body)
                        }
                    )
            }
        }
        post(opts, callback = () => { }) {
            const method = opts.method ? opts.method.toLocaleLowerCase() : 'post'
            // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
            if (opts.body && opts.headers && !opts.headers['Content-Type']) {
                opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            if (opts.headers) delete opts.headers['Content-Length']
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient[method](opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                opts.method = method
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                const {
                    url,
                    ..._opts
                } = opts
                this.got[method](url, _opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => {
                        const {
                            message: error,
                            response: resp
                        } = err
                        callback(error, resp, resp && resp.body)
                    }
                )
            }
        }
        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {string} fmt 格式化参数
         * @param {number} 可选: 根据指定时间戳返回格式化日期
         *
         */
        time(fmt, ts = null) {
            const date = ts ? new Date(ts) : new Date()
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            }
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            return fmt
        }
        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts) {
            const toEnvOpts = (rawopts) => {
                if (!rawopts) return rawopts
                if (typeof rawopts === 'string') {
                    if (this.isLoon()) return rawopts
                    else if (this.isQuanX()) return {
                        'open-url': rawopts
                    }
                    else if (this.isSurge()) return {
                        url: rawopts
                    }
                    else return undefined
                } else if (typeof rawopts === 'object') {
                    if (this.isLoon()) {
                        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                        return {
                            openUrl,
                            mediaUrl
                        }
                    } else if (this.isQuanX()) {
                        let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                        let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                        return {
                            'open-url': openUrl,
                            'media-url': mediaUrl
                        }
                    } else if (this.isSurge()) {
                        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                        return {
                            url: openUrl
                        }
                    }
                } else {
                    return undefined
                }
            }
            if (!this.isMute) {
                if (this.isSurge() || this.isLoon()) {
                    $notification.post(title, subt, desc, toEnvOpts(opts))
                } else if (this.isQuanX()) {
                    $notify(title, subt, desc, toEnvOpts(opts))
                }
            }
            if (!this.isMuteLog) {
                let logs = ['', '==============📣系统通知📣==============']
                logs.push(title)
                subt ? logs.push(subt) : ''
                desc ? logs.push(desc) : ''
                console.log(logs.join('\n'))
                this.logs = this.logs.concat(logs)
            }
        }
        log(...logs) {
            if (logs.length > 0) {
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.join(this.logSeparator))
        }
        logErr(err, msg) {
            const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
            if (!isPrintSack) {
                this.log('', `❗️${this.name
                    }, 错误!`, err)
            } else {
                this.log('', `❗️${this.name
                    }, 错误!`, err.stack)
            }
        }
        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }
        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name
                }, 结束!🕛${costTime}秒`)
            this.log()
            if (this.isSurge() || this.isQuanX() || this.isLoon()) {
                $done(val)
            }
        }
    })(name, opts)
}

