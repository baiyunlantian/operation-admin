<template>
    <el-popover placement="right" :width="150" trigger="click">
        <template #reference>
            <div class="popover-text">
                <slot name="popover-icon">
                    <span class="point"></span>
                </slot>

                <span class="text u-m-l-10 u-cursor">{{ selectedLabel }}</span>
            </div>
        </template>
        <el-radio-group v-model="selectedValue" @change="handleChangeValue">
            <el-radio v-for="(item) in selectOptions" :key="item.key" :label="item.key">{{item.label}}</el-radio>
        </el-radio-group>
    </el-popover>
</template>

<script setup>
  import {computed, ref, defineEmits, defineProps, watch} from "vue";
  import { useStore } from 'vuex';

  const store = useStore()

  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: [Number, String],
    },
     options: {
       required: false,
       type: Array,
       default: () => []
     }
  })


  const selectOptions = ref([])
  const selectedValue = ref(0)
  const selectedLabel = computed(() => {
    const obj = selectOptions.value.find(item => item.key === props.modelValue)
    return obj ? obj['label'] : '';
  })

  function handleChangeValue(val) {
    emits('update:modelValue', val)
  }

  watch(()=>props.modelValue, (newVal)=>{
    selectedValue.value = newVal
  }, {immediate: true})


  watch(()=>store.getters['platformType/list'],  (newVal)=>{
    if (props.options && props.options.length > 0) {
      selectOptions.value = props.options
    }else {
      let res = [{label:'全部', key:0}];
      if (Array.isArray(newVal)) {
        res = res.concat(newVal)
      }

      selectOptions.value = res
    }
  }, {immediate: true})
</script>

<style scoped lang="scss">
    .popover-text{
        position: relative;
        display: flex;
        align-items: center;

        .point{
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #6ea3ff;
        }

        .text{
            color: #6ea3ff;
        }
    }
</style>