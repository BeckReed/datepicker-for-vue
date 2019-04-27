<template>
    <div class="zx_mask fe-datetimepikcer-wrapper" v-show="selfShow">
        <div class="zx_select showPicker picker-columns">
            <header>
                <button class="nav_left picker-cancel" @click="cancel">取消</button>                
                <slot></slot><!-- 这里插入标题的内容 -->
                <button class="nav_right picker-ok" @click="confirm">确定</button>
            </header>
            <div class="ub" id="wrapper-parent">
                <div class="ub-f1 picker-wrapper" 
                        id="yearId"
                        :ref="yearId"                        
                        v-on:touchstart.stop.prevent="touchStartItem($event,containerOptions.yearContainer,1)" 
                        v-on:touchmove.stop.prevent="touchMoveItem($event,containerOptions.yearContainer,1)" 
                        v-on:touchend.stop.prevent="touchEndItem($event,containerOptions.yearContainer,1)">
                    <ul v-bind:style="{
                        transition:yearTransition,
                        transform:yearTransform}" >
                        <li></li>
                        <li></li>
                        <li v-for="item in years" :key="item">
                            {{item}}
                        </li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="ub-f1 picker-wrapper" 
                        id="monthId" 
                        :ref="monthId"
                        v-on:touchstart.stop.prevent="touchStartItem($event,containerOptions.monthContainer,2)" 
                        v-on:touchmove.stop.prevent="touchMoveItem($event,containerOptions.monthContainer,2)" 
                        v-on:touchend.stop.prevent="touchEndItem($event,containerOptions.monthContainer,2)">
                    <ul v-bind:style="{
                        transition:monthTransition,
                        transform:monthTransform}" >
                        <li></li>
                        <li></li>
                        <li v-for="item in months" :key="item">
                            {{item}}
                        </li>
                        <!-- <li data-value="01">01月</li>                         
                        <li data-value="01">02月</li>
                        <li data-value="01">03月</li> -->
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="ub-f1 picker-wrapper"  v-if="type.toString() == 1"
                        id="dateId" 
                        :ref="dateId"
                         v-on:touchstart.stop.prevent="touchStartItem($event,containerOptions.dateContainer,3)" 
                        v-on:touchmove.stop.prevent="touchMoveItem($event,containerOptions.dateContainer,3)" 
                        v-on:touchend.stop.prevent="touchEndItem($event,containerOptions.dateContainer,3)">
                    <ul v-bind:style="{
                        transition:dateTransition,
                        transform:dateTransform}"> 
                        <li></li>
                        <li></li>
                        <li v-for="item in dates" :key="item">
                            {{item}}
                        </li>
                        <!-- <li data-value="01">01日</li>                        
                        <li data-value="01">02日</li>  
                        <li data-value="01">03日</li>   -->
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="sel_top"></div>
                <div class="sel_bottom"></div>
                <div class="sel_middle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    let currentDate = new Date();
    let currentDateDetail = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, date: currentDate.getDate() };
    currentDateDetail.month = currentDateDetail.month < 10 ? '0' + currentDateDetail.month : currentDateDetail.month;
    currentDateDetail.date = currentDateDetail.date < 10 ? '0' + currentDateDetail.date : currentDateDetail.date;
    export default {
        name: "v-date-picker",
        props: {
            type: {
                type: Number,
                required: true,
                default: 1 //1 年月日  2 年月
            },
            title: {
                type: String,
                default: "请选择日期"
            },
            isShow: {
                type: Boolean,
                required: true,
                default: false
            },
            maxYear: {
                type: Number,
                default: currentDateDetail.year + 100 //默认最长年份当前年份向后100年
            },
            minYear: {
                type: Number,
                default: currentDateDetail.year - 100 //默认最前年份当前年份向前100年
            },
            separator: {
                type: String,
                default: "-" //默认日期的分隔符
            },
            value: {
                type: String,
                default: function() {
                    let separatorFlag = this.separator;
                    let defaultValue = currentDateDetail.year + separatorFlag + currentDateDetail.month + separatorFlag + currentDateDetail.date;
                    return defaultValue; //插件默认日期为当前日期
                }
            },
            yearId: {
                type: String,
                default: function() {
                    return 'fe-picker-year-id-' + this._uid;
                }
            },
            monthId: {
                type: String,
                default: function() {
                    return 'fe-picker-month-id-' + this._uid;
                }
            },
            dateId: {
                type: String,
                default: function() {
                    return 'fe-picker-date-id-' + this._uid;
                }
            }
        },
        data() {
            let years = this.getRangeArray(this.minYear, this.maxYear);
            let months = this.getRangeArray(1, 12, true);
            let seletedDateDetail = this.getDateDetail();
            let dates = this.getRangeArray(1, this.getMonthMaxDay(seletedDateDetail.year, seletedDateDetail.month), true);
            let containerOptions = {
                yearContainer: this.getContainerOptions(),
                monthContainer: this.getContainerOptions(),
                dateContainer: this.type.toString() === '1' ? this.getContainerOptions() : {}
            };
            // containerOptions = this.getHeights(containerOptions);
            return {
                years: years,
                months: months,
                dates: dates,
                year: seletedDateDetail.year,
                month: seletedDateDetail.month,
                date: seletedDateDetail.date,
                yearTransition: 'none',
                yearTransform: 'none',
                monthTransition: 'none',
                monthTransform: 'none',
                dateTransition: 'none',
                dateTransform: 'none',
                containerOptions: containerOptions,
                childShow: this.isShow
            };
        },
        beforeCreate() {},
        mounted() {},
        computed: {
            selfShow: {
                get() {
                    this.childShow = this.isShow;
                    return this.childShow;
                },
                set(val) {
                    this.childShow = val;
                }
            }
        },
        watch: {
            childShow(currentVal, oldVal) {
                if (currentVal) {
                    if (this.childShow) {
                        this.containerOptions = this.getHeights(this.containerOptions);
                        let beforeSelected = this.getDateDetail();
                        let yearDefaultLen = this.containerOptions.yearContainer.stepLen * (this.years.indexOf(beforeSelected.year));
                        let monthDefaultLen = this.containerOptions.monthContainer.stepLen * (this.months.indexOf(beforeSelected.month));
                        this.setScrollTo(1, this.containerOptions.yearContainer, yearDefaultLen);
                        this.setScrollTo(2, this.containerOptions.monthContainer, monthDefaultLen);
                        if (this.type.toString() === '1') {
                            let dateDefaultLen = this.containerOptions.dateContainer.stepLen * (this.dates.indexOf(beforeSelected.date));
                            this.setScrollTo(3, this.containerOptions.dateContainer, dateDefaultLen);
                        }
                    }
                }
            }
        },
        methods: {
            touchStartItem(e, containerOption, containerTransition, columnsType) {
                if (containerOption) {
                    containerOption.startTime = parseInt(new Date().getTime());
                    let touches = e.touches ? e.touches[0] : e;
                    containerOption.startPageY = touches.pageY; //起始触摸点
                    let transitionStyle = 'none';
                    this.setTransition(columnsType, true, transitionStyle);
                }
            },
            touchMoveItem(e, containerOption, columnsType) {
                if (containerOption) {
                    let timestamp = parseInt(new Date().getTime());
                    let touches = e.touches ? e.touches[0] : e;
                    // 滚动高度
                    let diffPageY = touches.pageY - containerOption.startPageY;
                    let movePageY = diffPageY + containerOption.offsetTop;

                    // 最少移动10px
                    if (timestamp - containerOption.endTime > 300 && Math.abs(diffPageY) < 10) {
                        return;
                    }

                    // 超过边缘滚动有阻力
                    if (movePageY > 0) {
                        movePageY /= 3;
                    } else if (Math.abs(movePageY) > Math.abs(containerOption.scrollHeight)) {
                        movePageY = Math.abs(containerOption.scrollHeight) - Math.abs(movePageY);
                        movePageY = movePageY / 3 - containerOption.scrollHeight;
                    }
                    let transformStyle = 'translate(0, ' + movePageY + 'px)';
                    this.setTransition(columnsType, false, transformStyle);
                }
            },
            touchEndItem(e, containerOption, columnsType) {
                if (containerOption) {
                    containerOption.endTime = parseInt(new Date().getTime());
                    let duration = containerOption.endTime - containerOption.startTime;
                    let touches = e.changedTouches ? e.changedTouches[0] : e;
                    let offsetHeight = touches.pageY - containerOption.startPageY; //本次滚动偏移位置
                    containerOption.offsetTop += offsetHeight; //记录总偏移位置
                    if ((containerOption.offsetTop > 0) || (Math.abs(containerOption.offsetTop) > Math.abs(containerOption.scrollHeight))) {
                        //上边缘&下边缘
                        let transitionStyle = 'all 500ms';
                        this.setTransition(columnsType, true, transitionStyle);
                    } else if (duration < 300) { // 惯性滚动
                        let speed = Math.abs(offsetHeight) / duration; // 惯性移动速度
                        let moveTime = duration * speed * 20; // 惯性滚动时间(动画)
                        moveTime = moveTime > 2000 ? 2000 : moveTime;
                        containerOption.offsetTop += offsetHeight * speed * 10; // 惯性移动距离
                        let transitionStyle = "all " + moveTime + "ms " + "cubic-bezier(0.1, 0.57, 0.1, 1)";
                        this.setTransition(columnsType, true, transitionStyle);
                    } else {
                        // columnControl.transition = 'all 500ms';
                        let transitionStyle = 'all 500ms';
                        this.setTransition(columnsType, true, transitionStyle);
                    }
                    if (containerOption.offsetTop > 0) {
                        containerOption.offsetTop = 0;
                    } else if (Math.abs(containerOption.offsetTop) > Math.abs(containerOption.scrollHeight)) {
                        containerOption.offsetTop = -containerOption.scrollHeight;
                    }

                    // 步长模式
                    if (containerOption.options.step && containerOption.stepLen > 0) {
                        let nowEndY = containerOption.offsetTop;
                        let h = Math.abs(nowEndY % containerOption.stepLen); //滚动多余不足step的高度
                        let halfHeight = containerOption.stepLen / 2; //step一半的高度

                        //超过行一半的高度，则滚动一行
                        let moveY = (h >= halfHeight) ? (nowEndY - containerOption.stepLen + h) : (nowEndY + h);

                        let index = parseInt(Math.abs(moveY) / containerOption.stepLen);
                        this.setSeletedValue(columnsType, index); //设置选中的item值

                        containerOption.offsetTop = moveY;
                    }
                    let transformStyle = 'translate(0, ' + containerOption.offsetTop + 'px)';
                    this.setTransition(columnsType, false, transformStyle);
                    if (this.type.toString() === '1') {
                        let monthMaxDay = this.getMonthMaxDay(this.year, this.month);
                        if (parseInt(this.date) > monthMaxDay) {
                            //超过一个月最长的日期
                            this.date = monthMaxDay;
                            let moveLen = (monthMaxDay - 1) * this.containerOptions.dateContainer.stepLen;
                            this.setScrollTo(3, this.containerOptions.dateContainer, moveLen, 500);
                        }
                    }
                }
            },
            getRangeArray(from, to, formateTwo) {
                let result = [];
                for (let i = from; i <= to; i++) {
                    if (formateTwo) {
                        i = i < 10 ? '0' + i : i.toString(); //小于10的 添加0格式化成两位
                    } else {
                        i = i.toString();
                    }
                    result.push(i);
                }
                return result;
            },
            getDateDetail() {
                let result = { year: '', month: '', date: '' };
                if (this.value) {
                    let dateDetail = this.value.split(this.separator);
                    result.year = dateDetail[0];
                    result.month = dateDetail[1];
                    result.date = dateDetail[2];
                }
                return result;
            },
            getContainerOptions() {
                return {
                    options: {
                        step: true, // 是否开启步长模式
                        defaultPlace: 0 // 默认列表位置
                    },
                    startPageY: 0,
                    startTime: 0,
                    endTime: 0,
                    offsetTop: 0, //上一次滚动位置
                    stepLen: 0, //步长
                    scrollerHeight: 0,
                    scrollHeight: 0,
                    childNodeHeight: 0,
                    itemHeight: 0,
                    transition: '',
                    transform: ''
                }
            },
            getHeights(containerOptions) {
                if (containerOptions) {
                    containerOptions = this.getYearHeight(containerOptions);
                    containerOptions = this.getMonthHeight(containerOptions);
                    if (this.type.toString() === '1') {
                        containerOptions = this.getDateHeight(containerOptions);
                    }
                }
                return containerOptions;
            },
            getYearHeight(containerOptions) {
                if (!containerOptions) {
                    return containerOptions;
                }
                containerOptions.yearContainer.scrollerHeight = this.$refs[this.yearId].clientHeight;
                let yearsNode = this.$refs[this.yearId].childNodes[0];
                let yearNodeHeight = yearsNode.clientHeight;
                let childNodes = yearsNode.childNodes;
                containerOptions.yearContainer.itemHeight = yearNodeHeight;
                containerOptions.yearContainer.scrollHeight = yearNodeHeight - containerOptions.yearContainer.scrollerHeight;
                containerOptions.yearContainer.transition = this.yearTransition;
                containerOptions.yearContainer.transform = this.yearTransform;
                containerOptions.yearContainer.stepLen = childNodes.length > 0 ? childNodes[0].clientHeight : 0;
                return containerOptions;
            },
            getMonthHeight(containerOptions) {
                if (!containerOptions) {
                    return containerOptions;
                }
                containerOptions.monthContainer.scrollerHeight = this.$refs[this.monthId].clientHeight;
                let monthsNode = this.$refs[this.monthId].childNodes[0];
                let monthNodeHeight = monthsNode.clientHeight;
                let childNodes = monthsNode.childNodes;
                containerOptions.monthContainer.itemHeight = monthNodeHeight;
                containerOptions.monthContainer.scrollHeight = monthNodeHeight - containerOptions.monthContainer.scrollerHeight;
                containerOptions.monthContainer.transition = this.yearTransition;
                containerOptions.monthContainer.transform = this.yearTransform;
                containerOptions.monthContainer.stepLen = childNodes.length > 0 ? childNodes[0].clientHeight : 0;
                return containerOptions;
            },
            getDateHeight(containerOptions) {
                if (!containerOptions) {
                    return containerOptions;
                }
                containerOptions.dateContainer.scrollerHeight = this.$refs[this.dateId].clientHeight;
                let datesNode = this.$refs[this.dateId].childNodes[0];
                let dateNodeHeight = datesNode.clientHeight;
                let childNodes = datesNode.childNodes;
                containerOptions.dateContainer.itemHeight = dateNodeHeight;
                containerOptions.dateContainer.scrollHeight = dateNodeHeight - containerOptions.dateContainer.scrollerHeight;
                containerOptions.dateContainer.transition = this.yearTransition;
                containerOptions.dateContainer.transform = this.yearTransform;
                containerOptions.dateContainer.stepLen = childNodes.length > 0 ? childNodes[0].clientHeight : 0;
                return containerOptions;
            },
            setSeletedValue(columnsType, index) {
                switch (columnsType) {
                    case 1:
                        this.year = this.years[index];
                        break;
                    case 2:
                        this.month = this.months[index];
                        break;
                    case 3:
                        this.date = this.dates[index];
                        break;
                }
            },
            setScrollTo(columnsType, containerOption, y, moveTime) {
                if (moveTime && moveTime > 0) {
                    let transitionStyle = "all " + moveTime + "ms " + "cubic-bezier(0.1, 0.57, 0.1, 1)";
                    this.setTransition(columnsType, true, transitionStyle);
                } else {
                    this.setTransition(columnsType, true, 'none');
                }
                y = -y;
                containerOption.offsetTop = y;
                let transformStyle = 'translate(0, ' + y + 'px)';
                this.setTransition(columnsType, false, transformStyle);
            },
            checkLeapYear(year) {
                //校验是否闰年
                if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                    return 1;
                }
                return 0;
            },
            getMonthMaxDay(nowYear, nowMonth) {
                //根据选中年份、月份计算当月最长多少天
                if (this.type.toString() === '1') {
                    let leap = this.checkLeapYear(nowYear);
                    let maxMonths = ["01", "03", "05", "07", "08", "10", "12"];

                    let monthMaxDays = 30;
                    if (nowMonth === "02") {
                        monthMaxDays = 28 + leap;
                    } else if (maxMonths.indexOf(nowMonth) > -1) {
                        monthMaxDays = 31;
                    }
                    return monthMaxDays;
                }
            },
            setTransition(columnsType, isTransiton, styleText) {
                switch (columnsType) {
                    case 1:
                        if (isTransiton) {
                            this.yearTransition = styleText;
                        } else {
                            this.yearTransform = styleText;
                        }
                        break;
                    case 2:
                        if (isTransiton) {
                            this.monthTransition = styleText;
                        } else {
                            this.monthTransform = styleText;
                        }
                        break;
                    case 3:
                        if (isTransiton) {
                            this.dateTransition = styleText;
                        } else {
                            this.dateTransform = styleText;
                        }
                        break;
                }
            },
            confirm() {
                let result;
                if (this.type.toString() === '1') {
                    result = [this.year, this.month, this.date].join(this.separator);
                } else {
                    result = [this.year, this.month].join(this.separator);
                }
                this.$emit('confirm', result);
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    };
</script>

<style >
 body {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}

* {
    margin: 0;
    padding: 0;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    /*-webkit-touch-callout: none;*/
}

ul {
    list-style: none outside none;
}

.fe-datetimepikcer-wrapper{
    .picker-wrapper{
        font-size: 16px;
    }
    .picker-columns{
        height: 245px;
    }
}




.ub
{
    display: -webkit-box !important;
    display: box !important;
    position:relative;
}
.ub-f1
{
    position:relative;
    -webkit-box-flex: 1;
    box-flex: 1;
}

/*select*/
.zx_mask {
    overflow: hidden;
    font-size: 15px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0);
    z-index: 9998;
}

.zx_select {
    font-size: 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    /*height: 4.4rem;*/
    /* height: 0; */
    width: 100%;
    color: #333;
    background: #D1D5D8;
    z-index: 9999;
    -webkit-transition: 300ms all;
    transition: 300ms all;
}

.zx_select > header {
    overflow: hidden;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background: #F0F1F2;
    -webkit-box-shadow: 0 0 8px #333;
    -moz-box-shadow: 0 0 8px #333;
    box-shadow: 0 0 8px #333;
}
.zx_select > header > h1 {
    display: inline-block;
    font-size: 15px;
    font-weight: normal;
}
.zx_select > header > button {
    font-size: 15px;
    height: 45px;
    padding: 0 10px;
    border: none;
    outline: none;
    color: #007AFF;
    background: #F0F1F2;
}
.zx_select button.nav_left {
    float: left;
}
.zx_select button.nav_right {
    float: right;
}

.zx_select > p {
    width: 100%;
    line-height: 30px;
    text-align: center;
    font-size: 14px !important;
}
.zx_select > p > span {
    display: block;
}

/*列表*/
.zx_select > div {
    overflow: hidden;
    position: relative;
    height: 200px;
    text-align: center;
}
.zx_select > div > div.ub-f1 {
    max-width: 100%;
    min-width: 100%;
}
.zx_select ul {
    line-height: 40px;
}
.zx_select ul > li {
    height: 40px;
    color: #2A2B2C;
    padding: 0 10px !important;
    margin: 0 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
/*.zx_select ul > li:first-child {*/
    /*padding-top: 80px;*/
/*}*/
/*.zx_select ul > li:last-child {*/
    /*padding-bottom: 80px;*/
/*}*/

.zx_select .sel_middle {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 40px;
    margin-top: -20px;
    pointer-events: none;
    border-top: 1px solid #aaa;
    border-bottom: 1px solid #aaa;
}

.zx_select .sel_top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    pointer-events: none;
    background: rgba(209,213,216,0.7);
}
.zx_select .sel_bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 80px;
    pointer-events: none;
    background: rgba(209,213,216,0.7);
}


</style>