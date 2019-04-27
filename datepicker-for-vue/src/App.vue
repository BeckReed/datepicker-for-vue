<template>
    <div id="app">
        <img src="./assets/logo.png">
        <router-view class="child-view"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .child-view {
        transition: all .2s cubic-bezier(.55, 0, .1, 1);
        position: absolute;
        width: 100%;
    }

    html {
        height: 100%;
    }

    body {
        height: 100%;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei";
        font-size: 14px;
        color: #484848;
        ;
        background-color: #f9f9f9;
    }

    * {
        box-sizing: border-box;
    }

    button,
    [type="button"],
    [type="reset"],
    [type="submit"] {
        -webkit-appearance: button;
    }

    .blue-btn {
        width: 60%;
        height: 49px;
        line-height: 49px;
        color: #ffffff;
        background: #6d86ff;
        font-size: 18px;
        outline: none;
        border: none;
    }
</style>
