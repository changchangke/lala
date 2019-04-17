(function () {
    var data = localStorage.getItem('mList') ?
        JSON.parse(localStorage.getItem('mList')) : [];
    var serchData = [];
    var start = document.querySelector('.left_w');
    var audio = document.querySelector('audio');
    var nowSong = document.querySelector('.center_w p');
    var playListUl = document.querySelector('.list_body ul');
    var logoImg = document.querySelector('.center_q img');
    var prev = document.querySelector('.left_q');
    var next = document.querySelector('.left_e');
    var playTimeNow = document.querySelector('.playTimeNow');
    var playTimeTotal = document.querySelector('.playTimeTotal');
    var ctrlBar = document.querySelector('.center_w');
    var nowTimeBar = document.querySelector('.w_red');
    var ctrlBtn = document.querySelector('.spanya');
    var playMode = document.querySelector('.right_e');
    var info = document.querySelector('.model_info');
    var list = document.querySelector('.right_r');
    var playlist = document.querySelector('.list');
    var search = document.querySelector('.in_in input');
    var sousou = document.querySelector('.in_in a');
    var index = 0;
    var timer = null;//保存定时器
    var rotateDeg = 0;//封面小图旋转度数
    var modeIndex = 0;//播放模式0列表循环1单曲2随机
    var infoTimer = null;//控股之提示康的定时器
    var flag = false;//表示列表是否弹出



    function updatePlayList() {
        var str = '';//拼接播放项
        for (var i = 0; i < data.length; i++) {
            str += '<li>';
            str += '<i>×</i>';
            str += '<span>' + data[i].name + '</span>';
            str += '<span>';
            for (var j = 0; j < data[i].ar.length; j++) {
                str += data[i].ar[j].name + '  ';
            }
            str += '</span>';
            str += '</li>';
        }
        playListUl.innerHTML = str;
    }



    $(playListUl).on('click', 'li', function () {
        index = $(this).index();
        init();

        play();
    });

    logoImg.addEventListener('click',function () {
        window.open(data[index].al.picUrl);
    });

    sousou.addEventListener('click', function () {
        $.ajax({
            url: 'https://api.imjad.cn/cloudmusic/',
            data: {
                type: 'search',
                s: search.value
            },
            type: 'get',
            //请求成功后触发
            success: function (result) {
                // console.log(result);
                serchData = result.result.songs;
                var str = '';
                //将搜索成功的数据添加到列表

                for (var i = 0; i < serchData.length; i++) {
                    str += '<li>';
                    str += '<span>' + serchData[i].name + '</span>';
                    str += '<span>';
                    for (var j = 0; j < serchData[i].ar.length; j++) {
                        str += serchData[i].ar[j].name + ' ';
                    }
                    str += '</span>';
                    str += '</li>';
                }
                $('.searchList').html(str);
            },
            error: function (err) {
                console.log(err);
            }

        });
        search.value = '';

    });

    search.addEventListener('keydown', function (e) {
        // console.log(e.keyCode);
        if (e.keyCode === 13) {
            $.ajax({
                url: 'https://api.imjad.cn/cloudmusic/',
                data: {
                    type: 'search',
                    s: search.value
                },
                type: 'get',
                //请求成功后触发
                success: function (result) {
                    // console.log(result);
                    serchData = result.result.songs;
                    var str = '';
                    //将搜索成功的数据添加到列表
                    for (var i = 0; i < serchData.length; i++) {
                        str += '<li>';
                        str += '<span>' + serchData[i].name + '</span>';
                        str += '<span>';
                        for (var j = 0; j < serchData[i].ar.length; j++) {
                            str += serchData[i].ar[j].name + ' ';
                        }
                        str += '</span>';
                        str += '</li>';
                    }
                    $('.searchList').html(str);
                },
                error: function (err) {
                    console.log(err);
                }
            });
            this.value = '';
        }

    });


    $('.searchList').on('click', 'li', function () {
        var searchIndaex = $(this).index();
        data.push(serchData[searchIndaex]);
        localStorage.setItem('mList', JSON.stringify(data));

        data = localStorage.getItem('mList') ?
            JSON.parse(localStorage.getItem('mList')) : [];
        updatePlayList();
        index = data.length-1;
        init();
        play();
        loadlistNum();
    });


    function checkPlayList() {
        updatePlayList();
        var lis = document.querySelectorAll('.list_body ul li');
        for (var i = 0; i < lis.length; i++) {
            lis[i].className = ' ';
        }
        lis[index].className = 'active';
    }

    //格式化音乐格式
    function formatTime(time) {
        return time > 9 ? time : '0' + time;
    }

    function init() {
        rotateDeg = 0;//封面小图旋转度数
        checkPlayList();
        audio.src = 'http://music.163.com/song/media/outer/url?id=' + data[index].id + '.mp3';
        logoImg.src = data[index].al.picUrl;
        var str = '';
        str += data[index].name + ' -- ';
        for (var i = 0; i < data[index].ar.length; i++) {
            str += data[index].ar[i].name + '  ';
        }
        nowSong.innerHTML = str;
    }

    function modeInfo(str) {
        $(info).fadeIn();
        info.innerHTML = str;
        clearTimeout(infoTimer);
        infoTimer = setTimeout(function () {
            $(info).fadeOut();
        }, 1000)

    }

    //记载播放歌曲数量
    function loadlistNum() {
        list.innerHTML = data.length;
    }

    loadlistNum();

    //播放
    function play() {
        audio.play();
        start.style.backgroundPositionY = '449px';
        clearInterval(timer);
        timer = setInterval(function () {
            rotateDeg++;
            logoImg.style.transform = 'rotate(' + rotateDeg + 'deg)';
        }, 30);
    }

    init();


    //播放列表显示
    list.addEventListener('click', function () {
        if (flag) {
            playlist.style.display = 'none';
        } else {
            playlist.style.display = 'block';
        }
        flag = !flag;
    });

    start.addEventListener('click', function () {
        // audio.play();
        // console.log(audio.paused);
        //运行起来市true
        if (audio.paused) {
            play();
        } else {
            audio.pause();
            clearInterval(timer);
            start.style.backgroundPositionY = '410px';
        }
    });

    //下一曲
    next.addEventListener('click', function () {
        index++;
        index = index > data.length - 1 ? 0 : index;
        init();
        play();
    });
    //上一曲
    prev.addEventListener('click', function () {
        index--;
        index = index < 0 ? data.length - 1 : index;
        init();
        play();
    });


    //删除
    $(playListUl).on('click','i',function (e) {
        console.log(1111);
        data.splice($(this).parent().index(),1);
        localStorage.setItem('mList',JSON.stringify(data));
        e.stopPropagation();
        updatePlayList();
        list.innerHTML = data.length;
    });



// $(del).on('click',function () {
    //     var inde = $(this).index();
    //     if(e.target.localName === 'a'){
    //         iter.splice(inde,1);
    //         localStorage.setItem(
    //             'mList', JSON.stringify(iter)
    //         );
    //         index-=index> 0 ? index : 0 ;
    //     }else{
    //         index=inde;
    //     }
    // });


    audio.addEventListener('canplay', function () {
        var totalTime = audio.duration;
        var totalBarWidth = ctrlBar.clientWidth;
        var totalM = parseInt(totalTime / 60);
        var totalS = parseInt(totalTime % 60);
        playTimeTotal.innerHTML = formatTime(totalM) + ':' + formatTime(totalS);

        audio.addEventListener('timeupdate', function () {
            var totalBarWidth = ctrlBar.clientWidth;
            var currentTime = audio.currentTime;
            var currentM = parseInt(currentTime / 60);
            var currentS = parseInt(currentTime % 60);
            playTimeNow.innerHTML = formatTime(currentM) + ':' + formatTime(currentS);

            var nowBar = currentTime / totalTime * totalBarWidth;
            // alert(nowBar);
            nowTimeBar.style.width = nowBar + 'px';
            ctrlBtn.style.left = nowBar + 454 + 'px';

            if (audio.ended) {
                switch (modeIndex) {
                    case 0:
                        var e = document.createEvent("MouseEvents");
                        e.initEvent("click", true, true);
                        next.dispatchEvent(e);
                        break;
                    case 1:
                        init();
                        play();
                        break;
                    case 2:
                        // 取随机数
                        index = getRandomNum(index, data);
                        init();
                        play();
                        break;
                }
            }

        });

        ctrlBar.addEventListener('click', function (e) {
            // alert(1);
            var mouseX = e.offsetX;
            audio.currentTime = mouseX / totalBarWidth * totalTime;
        });

    });



    // 取不重复的数
    function getRandomNum(num, arr) {
        var randomNum = Math.floor(Math.random() * arr.length);
        if (randomNum === num) {
            randomNum = getRandomNum();
        }
        return randomNum;
    }
    playMode.addEventListener('click', function () {
        modeIndex++;
        modeIndex = modeIndex > 2 ? 0 : modeIndex;
        switch (modeIndex) {
            case 0:
                playMode.style.backgroundPositionX = 0 + 'px';
                playMode.style.backgroundPositionY = 273 + 'px';
                modeInfo('顺序播放');
                break;
            case 1:
                playMode.style.backgroundPositionX = -63 + 'px';
                playMode.style.backgroundPositionY = 273 + 'px';
                modeInfo('单曲循环');
                break;
            case 2:
                playMode.style.backgroundPositionX = -63 + 'px';
                playMode.style.backgroundPositionY = 369 + 'px';
                modeInfo('随机播放');
                break;
        }

    });


})();