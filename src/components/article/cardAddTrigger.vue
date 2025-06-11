<template>
  <div class="frosted-glass-container">
    <MyCard :show-border="true" @click="handelClick">
      <template #content>
        <div class="frosted-glass-background"></div>
        <div class="frosted-glass-vibrancy"></div>
        <div class="frosted-glass-border"></div>
        <div class="plus-icon-container">
          <PlusOutlined class="plus-icon" />
        </div>
      </template>
    </MyCard>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import MyCard from '@/components/common/myCard.vue';

const emit = defineEmits(['click-event'])
const handelClick = () => {
  emit('click-event')
}
</script>

<style scoped lang="scss">
.frosted-glass-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  isolation: isolate;


  &:hover {
    cursor: pointer;
    
    .frosted-glass-background {
      backdrop-filter: blur(16px) saturate(180%);
    }
    
    .plus-icon {
      transform: scale(1.15);
      color: #007AFF;
    }
  }

  .frosted-glass-background {
    position: absolute;
    inset: 0;
    background: rgba(245, 245, 247, 0.6);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    z-index: 1;
    transition: backdrop-filter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .frosted-glass-vibrancy {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.15) 100%
    );
    z-index: 2;
    pointer-events: none;
    
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.04"/%3E%3C/svg%3E');
      mix-blend-mode: overlay;
    }
  }

  .frosted-glass-border {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 0.5px solid rgba(255, 255, 255, 0.4);
    z-index: 3;
    pointer-events: none;
    box-shadow: 
      inset 0 0 0.5px rgba(255, 255, 255, 0.7),
      0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .plus-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 15%;
    box-sizing: border-box;
    position: relative;
    z-index: 4;
  }
  
  .plus-icon {
    color: rgba(90, 90, 90, 0.8);
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
    
    &:hover {
      color: #007AFF;
      filter: drop-shadow(0 1px 2px rgba(0, 122, 255, 0.2));
    }
  }
}
</style>
