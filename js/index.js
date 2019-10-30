var EventUtil = null;//兼容事件处理

(function eventUtilFn() {
    EventUtil = {
        addHandler: (element, type, handler) => {  //添加事件
            if (element.addEventListener) {
                element.addEventListener(type, handler, false) //事件，方法，捕抓/冒泡（"click",function(){},false）
            }
            else if (element.attachEvent) {
                element.attachEvent("on" + type, handler)   //事件，方法，（IE只有冒泡）
            }
            else {
                element["on" + type] = handler //DOM0级的
            }
        },

        removeHandler: (element, type, handler) => {  //添加事件
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false) //事件，方法，捕抓/冒泡（"click",function(){},false）
            }
            else if (element.detachEvent) {
                element.detachEvent("on" + type, handler)   //事件，方法，（IE只有冒泡）
            }
            else {
                element["on" + type] = null //DOM0级的
            }
        },

        getEvent: (event) => {    //获取event对象
            return event ? event : window.event;
        },

        getTarget: (event) => {   //返回事件的目标
            return event.target || event.srcElement;
        },

        preventDefault: (event) => {  //取消事件的默认行为
            if (event.preventDefault) {
                event.preventDefault()
            }
            else {
                event.returnValue = false;
            }
        },

        stopPropagation: (event) => { //阻止事件流
            if (event.stopPropagation) {
                event.stopPropagation()
            }
            else {
                event.cancelBubble = true;
            }
        }

    }

}())



function headerEven() {
    const header = document.getElementById("header");
    EventUtil.addHandler(header, "click", (event) => {
        let e = EventUtil.getEvent(event);
        let target = EventUtil.getTarget(e);
        menuEvent(target, "slideToggle", "showToggle", "100px")
    })
}

function mainEven() {
    const main = document.getElementById("main");
    EventUtil.addHandler(main, "click", (event) => {
        let e = EventUtil.getEvent(event);
        let target = EventUtil.getTarget(e);
        switch (target.id) {
            case "proMenuTitle":
                menuEvent(target, "proMenuTitle", "proMenu", "588px");
                break;
            case "proMenuTitle2":
                menuEvent(target.parentNode, "proMenuTitle", "proMenu", "588px");
                break;
            case "menuReveal":
                menuEvent(target, "menuReveal", "navId", "500px");
                break;
            default:
                null;
        }
    })
}



// 封装下拉菜单事件
function menuEvent(target, targetId, updateElemenId, maxHeight) {
    let i = 0;
    if (target.getAttribute("data-status") == "open") {
        i = 1;
    }
    switch (target.id) {
        case targetId:
            let ElemenId = document.getElementById(updateElemenId);
            if (i % 2 == 1) {
                ElemenId.style.maxHeight = "0px";
                target.setAttribute("data-status", "close")
            }
            if (i % 2 == 0) {
                ElemenId.style.maxHeight = maxHeight;
                target.setAttribute("data-status", "open")
            }
            i++;
            break;
    }
}


// 幻灯片
function benner(parent, controller, mod, arrow) {

    function getElem(name) {
        if (name[0] == '#') {
            return document.getElementById(name.substr(1));
        } else if (name[0] == '.') {
            return document.getElementsByClassName(name.substr(1));
        } else {
            return document.getElementsByTagName(name);
        }
    }

    var num = 0;
    var controller = getElem(controller);
    var mod = getElem(mod);
    var benner = getElem(parent);
    var autoPlayTime = 1500;
    var imgNum = mod.length - 1;
    var auto;
    var arrow = getElem(arrow)

    //根据传进来的名字获取这个名字所对应的对象

    //实现鼠标划过圆点,变化图片的效果
    //function change(controller, mod){
    //遍历控制器,绑定鼠标划过事件
    for (var i = 0; i < controller.length; i++) {
        //给控制器加个索引,并把i值赋值给索引
        controller[i].index = i;
        //给所有的控制器都加划过事件
        controller[i].onmouseover = function () {
            for (var j = 0; j < controller.length; j++) {
                //将所有控制器改为默认样式
                controller[j].className = 'nr';
            }
            //改变所选的控制器样式
            this.className = 'nr active';
            //将模型改为默认样式
            for (var x = 0; x < mod.length; x++) {
                mod[x].className = 'imga';
            }
            //改变所选控制器对应的模型的样式
            num = this.index;
            mod[this.index].className = 'imga active';
        }
    }

    arrow[0].onclick = function () {
        for (var x = mod.length - 1; x >= 0; x--) {
            mod[x].className = 'imga';
            controller[x].className = 'nr';
        }
        if (num == 0) {
            num = mod.length;
        }
        mod[num - 1].className = 'imga active';
        controller[num - 1].className = 'nr active';
        num--;
    }

    arrow[1].onclick = function () {
        for (var x = mod.length - 1; x >= 0; x--) {
            mod[x].className = 'imga';
            controller[x].className = 'nr';
        }
        if (num == mod.length - 1) {
            num = -1;
        }
        mod[num + 1].className = 'imga active';
        controller[num + 1].className = 'nr active';
        num++;
    }



    //}
    //绑定鼠标移入,暂停播放图片
    benner.onmouseover = function () {
        clearInterval(auto);
    }
    //绑定鼠标离开,继续播放
    benner.onmouseleave = function () {
        autoPlay();
    }
    //指定播放那个图片
    function play(num) {
        for (var j = 0; j < controller.length; j++) {
            controller[j].className = 'nr';
        }
        controller[num].className = 'nr active';
        for (var x = 0; x < mod.length; x++) {
            mod[x].className = 'imga';
        }
        mod[num].className = 'imga active';
    }
    //自动播放
    function autoPlay() {
        auto = setInterval(function () {
            if (num > imgNum) {
                num = 0;
            }
            play(num);
            num++;
        }, autoPlayTime)
    }

    autoPlay();
}

// 受absolute定位的影响，计算子元素的高度
function sonHight() {
    const area = document.getElementsByClassName("area");
    const container = document.getElementById("mainContainer")
    let h1;


    if (window.matchMedia) {
        var mq = window.matchMedia("(min-width: 768px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    function WidthChange(mq) {
        console.log(mq.matches)
        if (mq.matches) {
            h1 = area[0].offsetHeight
            container.style.height = h1 + "px";
            //此时window的宽度大于500px
        } else {
            h1 = area[0].offsetHeight + area[1].offsetHeight + 50;
            container.style.height = h1 + "px";
        }
    }

}

(function init() {
    headerEven();
    mainEven();
    benner('#benner', '.nr', '.imga', '.arrow');//幻灯片
    sonHight();
    $('img.lazy').lazyload();//对图片进行懒加载
}())

