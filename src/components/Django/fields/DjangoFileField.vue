<template>
  <div>
    <a-upload
      :file-list="getFileList(value)"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :showUploadList="{showRemoveIcon: canDelete}"
    >
      <a-button> <a-icon type="upload" /> 选择文件 </a-button>
    </a-upload>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, File],
      default: null
    },
    canDelete: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    getNameFromURI (value) {
      const url = decodeURI(value)
      const index = url.lastIndexOf('/')
      return url.substr(index + 1)
    },
    getFileList (value) {
      if (!value) {
        return []
      }
      if (value instanceof File) {
        return [value]
      }
      return [
        {
          uid: 1,
          name: this.getNameFromURI(value),
          url: value
        }
      ]
    },
    handleRemove () {
      this.$emit('change', '')
    },
    beforeUpload (file) {
      this.$emit('change', file)
      return false
    }
  }
}
</script>
