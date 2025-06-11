<template>
    <div class="empty-msg-wrapper">
        <span class="welcome-msg">Welcome</span>
    </div>
</template>
  
<script setup lang="ts">
</script>

<style lang="scss" scoped>
.empty-msg-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .welcome-msg{
        font-size: 40px;
        margin: auto;
        color: gray;
    }
}
</style>