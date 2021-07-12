<template>
  <div>
    <img style="cursor: pointer;" :src="text" :width="params.width" @click="previewVisible=true">
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
      <img alt="example" style="width: 100%" :src="text" />
    </a-modal>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['text', 'index', 'record', 'params'],
  data () {
    return {
      previewVisible: false
    }
  }
}
</script>
