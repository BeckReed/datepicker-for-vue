<template>
    <div class="time-demo-wrapper">
        <h3>timepicker demo</h3>
        <div>
            <h3>三列(年月日)日期弹窗示例(不带标题)</h3>
            <button class="blue-btn" @click="togglePicker1">显示三列(年月日)日期弹窗Demo1</button>
            <v-date-picker :type="1" :isShow="isShow1" @confirm="confirmDemo1" @cancel="cancelDemo1" v-model="selectedValue1"></v-date-picker>
        </div>

        <div>
            <h3>三列(年月日)日期弹窗示例--带标题)</h3>
            <button class="blue-btn" @click="togglePicker2">显示三列带标题日期弹框Demo2</button>
            <v-date-picker :type="1" :isShow="isShow2" @confirm="confirmDemo2" @cancel="cancelDemo2" v-model="selectedValue2">请选择日期</v-date-picker>
        </div>

        <div>
            <h3>两列(年月)日期弹窗示例--带标题)</h3>
            <button class="blue-btn" @click="togglePicker3">显示两列(年月)日期弹窗Demo3</button>
            <v-date-picker :type="2" :isShow="isShow3" @confirm="confirmDemo3" @cancel="cancelDemo3" v-model="selectedValue3">请选择日期</v-date-picker>
        </div>

        <div>
            <h3>三列(年月日)--设置最长、最小年份(默认当前年份向前向后一百年)</h3>
            <button class="blue-btn" @click="togglePicker4">显示三列日期弹框Demo4</button>
            <v-date-picker :type="1" :isShow="isShow4" @confirm="confirmDemo4" @cancel="cancelDemo4" v-model="selectedValue4" :max-year="2019" :min-year="1999">测试最长最小年份</v-date-picker>
        </div>
    </div>


</template>

<script>
    import VDatePicker from "../components/datetimepicker/datetimepicker";
    export default {
        name: "timepickerDemo",
        data() {
            return {
                isShow1: false,
                selectedValue1: "2018-01-01",
                isShow2: false,
                selectedValue2: "2017-08-02",
                isShow3: false,
                selectedValue3: "2016-12",
                isShow4: false,
                selectedValue4: "2017-08-04"
            };
        },
        components: {
            VDatePicker
        },
        methods: {
            togglePicker1() {
                this.isShow1 = true;
            },
            togglePicker2() {
                this.isShow2 = true;
            },
            togglePicker3() {
                this.isShow3 = true;
            },
            togglePicker4() {
                this.isShow4 = true;
            },
            confirmDemo1(result) {
                console.log(result);
                this.isShow1 = false; //关闭时间选择框
                this.selectedValue1 = result;
            },
            cancelDemo1() {
                this.isShow1 = false; //关闭时间选择框
            },
            confirmDemo2(result) {
                console.log(result);
                this.isShow2 = false; //关闭时间选择框
                this.selectedValue2 = result;
            },
            cancelDemo2() {
                this.isShow2 = false; //关闭时间选择框
            },
            confirmDemo3(result) {
                console.log(result);
                this.isShow3 = false; //关闭时间选择框
                this.selectedValue3 = result;
            },
            cancelDemo3() {
                this.isShow3 = false; //关闭时间选择框
            },
            confirmDemo4(result) {
                console.log(result);
                this.isShow4 = false; //关闭时间选择框
                this.selectedValue4 = result;
            },
            cancelDemo4() {
                this.isShow4 = false; //关闭时间选择框
            }
        }
    };
</script>
<style>
    .time-demo-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
