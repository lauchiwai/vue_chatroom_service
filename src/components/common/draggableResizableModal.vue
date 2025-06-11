<template>
    <a-modal
        v-model:open="open"
        :style="mergedCssStyle"
        :wrapClassName="mergedWrapClassName"
        :maskClosable="maskClosable"
        :mask="mask"
        :footer="footer"
        :destroyOnClose="destroyOnClose"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <template #modalRender="{ originVNode }">
            <div :style="transformStyle">
                <slot name="modalRender" :originVNode="originVNode">
                    <component :is="remakeVNode(originVNode)" ref="contentEl"/>
                </slot>
            </div>
        </template>
    
        <template #title>
            <div ref="modalTitleRef" style="width: 100%; cursor: move">
                <slot name="movControler">
                    <span style="display: flex; justify-content: center" v-if="enableDraggable">
                        <HolderOutlined class="rotated cursor-move"/>
                    </span>
                </slot>
                <slot name="title"></slot>
            </div>
        </template>
    
        <slot name="contents"></slot>
    
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import type { CSSProperties, VNode, VNodeNormalizedChildren } from 'vue'
import { ref, computed, watch, watchEffect, defineExpose, h, cloneVNode, isVNode, normalizeClass } from 'vue'
import { HolderOutlined } from '@ant-design/icons-vue'
import { useDraggable } from '@vueuse/core'

const props = defineProps({
    maskClosable: { type: Boolean, default: true },
    mask: { type: Boolean, default: true },
    wrapStyle: { type: Object, default: () => ({}) },
    wrapClassName: { type: String, default: '' },
    cssStyle: { type: Object, default: () => ({}) },
    destroyOnClose: { type: Boolean, default: false },
    footer: { type: String },
    minHeight: { type: Number, default: 0 },
    minWidth: { type: Number, default: 200 },
    connersResizer: { type: Array as () => string[], default: () => ['top-left', 'top-right', 'bottom-right', 'bottom-left'] },
    sideResizer: { type: Array as () => string[], default: () => ['top', 'right', 'bottom', 'left'] },
    enableResize: { type: Boolean, default: true },
    enableDraggable: { type: Boolean, default: true }
})

const emit = defineEmits(['handleCancel'])
const open = defineModel('open', { type: Boolean, required: true })

const modalTitleRef = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)

const { x, y, isDragging } = useDraggable(modalTitleRef)
const startX = ref(0)
const startY = ref(0)
const startedDrag = ref(false)
const transformX = ref(0)
const transformY = ref(0)
const preTransformX = ref(0)
const preTransformY = ref(0)
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 })

const transformStyle = computed<CSSProperties>(() => ({
    transform: `translate(${transformX.value}px, ${transformY.value}px)`
}))

const mergedCssStyle = computed(() => ({
    ...props.cssStyle,
    padding: '5px 20px 10px 20px'
}))

const mergedWrapClassName = computed(() => 
    `draggable-resizeable-modal-container ${props.wrapClassName}`
)

const handleOk = (e: MouseEvent) => {
    open.value = false
}

const handleCancel = (e: MouseEvent) => {
    open.value = false
    emit('handleCancel')
}

const resetModal = () => {
    startX.value = 0
    startY.value = 0
    transformX.value = 0
    transformY.value = 0
    preTransformX.value = 0
    preTransformY.value = 0
    dragRect.value = { left: 0, right: 0, top: 0, bottom: 0 }
}

watch([x, y], () => {
    if (!startedDrag.value) {
        startX.value = x.value
        startY.value = y.value
        const bodyRect = document.body.getBoundingClientRect()
        if (modalTitleRef.value) {
            const titleRect = modalTitleRef.value.getBoundingClientRect()
            dragRect.value.right = bodyRect.width - titleRect.width
            dragRect.value.bottom = bodyRect.height - titleRect.height
        }
        preTransformX.value = transformX.value
        preTransformY.value = transformY.value
    }
    startedDrag.value = true
})

watchEffect(() => {
    if (startedDrag.value) {
        transformX.value = preTransformX.value +
        Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
        startX.value

        transformY.value = preTransformY.value +
        Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
        startY.value
    }
})

const remakeVNode = (vnode: VNode): VNode => {
    if (!isVNode(vnode)) return vnode;

    const classList = vnode.props?.class ?? [];
    const normalizedClass = normalizeClass(classList);

    if (normalizedClass.includes("ant-modal-content")) {
        const sideResizers = props.sideResizer.map((side) =>
            h("div", {
                class: `resizer ${side} side`,
                onMousedown: (event: MouseEvent) => {
                    onResizeStart(event, side);
                },
            })
        );

        const connersResizers = props.connersResizer.map((conner) =>
            h("div", {
                class: `resizer ${conner} side`,
                onMousedown: (event: MouseEvent) => {
                    onResizeStart(event, conner);
                },
            })
        );

        const oldChildren = Array.isArray(vnode.children) ? vnode.children : [vnode.children];

        const newChildren = [
            ...oldChildren,
            ...sideResizers,
            ...connersResizers
        ];
        vnode.children = newChildren  as VNodeNormalizedChildren;
        return cloneVNode(vnode);
    } else {
        return vnode;
    }
};

const onResizeStart  = (e: MouseEvent, className: string) =>{
    e.stopPropagation()
    e.preventDefault()
    const resizer = e.target as HTMLDivElement;
    if(!resizer) return;

    const computedStyle = window.getComputedStyle(contentEl.value!)
    const currentTop = parseFloat(computedStyle.top) || 0
    const currentLeft = parseFloat(computedStyle.left) || 0

    const originalRect = contentEl.value!.getBoundingClientRect()
    const originalWidth = originalRect.width
    const originalHeight = originalRect.height

    const startX = e.clientX
    const startY = e.clientY

    const onMouseMove =  (e: MouseEvent) => {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        const moveToTop = () =>{
            const notAtWindowTop = (originalRect.top + document.documentElement.scrollTop + deltaY) > 0;
            const overMinHeight = (originalRect.bottom - originalRect.top + -deltaY) >= props.minHeight;
            if (notAtWindowTop && overMinHeight) {
                contentEl.value!.style.height = (originalHeight - deltaY) + 'px'
                contentEl.value!.style.top = (currentTop + deltaY) + 'px'
            }
        }

        const moveToLeft = () =>{
            const overMinWidth = (originalRect.right - originalRect.left + -deltaX) >= props.minWidth;
            if (overMinWidth) {
                contentEl.value!.style.width = (originalWidth - deltaX) + 'px'
                contentEl.value!.style.left = (currentLeft + deltaX) + 'px'
            }
        }

        const moveToRight = () =>{
            const overMinWidth = (originalRect.right - originalRect.left + deltaX) >= props.minWidth;
            if (overMinWidth) {
                contentEl.value!.style.width = (originalWidth + deltaX) + 'px'
            }
        }

        const moveToBottom = () =>{
            const overMinHeight = (originalRect.bottom - originalRect.top + deltaY) >= props.minHeight;
            if (overMinHeight) {
                contentEl.value!.style.height = (originalHeight + deltaY) + 'px'
            }
        }

        if (className == 'bottom') {
            moveToBottom();
        } else if (className == 'top') {
            moveToTop()
        } else if (className == 'left') {
            moveToLeft();
        } else if (className == 'right') {
            moveToRight();
        }  else if (className == 'bottom-right') {
            moveToRight();
            moveToBottom();
        } else if (className == 'bottom-left') {
            moveToBottom();
            moveToLeft();
        } else if (className == 'top-right') {
            moveToTop()
            moveToRight();
        } else if (className == 'top-left') {
            moveToTop();
            moveToLeft();
        }
    }

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

defineExpose({ resetModal })
</script>

<style lang="scss">
.draggable-resizeable-modal-container {
    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: 100%;

        .ant-modal-body {
            flex: 1;
        }

        .resizer {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 1;

            &.top-left {
                top: -5px;
                left: -5px;
                cursor: nw-resize;
            }

            &.top-right {
                top: -5px;
                right: -5px;
                cursor: ne-resize;
            }

            &.bottom-left {
                bottom: -5px;
                left: -5px;
                cursor: sw-resize;
            }

            &.bottom-right {
                bottom: -5px;
                right: -5px;
                cursor: se-resize;
            }

            &.top {
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                cursor: n-resize;
                width: 100%;
                height: 10px;
            }

            &.bottom {
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                cursor: s-resize;
                width: 100%;
                height: 10px;
            }

            &.left {
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                cursor: w-resize;
                width: 10px;
                height: 100%;
            }

            &.right {
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                cursor: e-resize;
                width: 10px;
                height: 100%;
            }
        }
    }
    
    .rotated {
        transform: rotate(90deg);
        transform-origin: center;
    }

    .cursor-move {
        cursor: move;
    }
}
</style>