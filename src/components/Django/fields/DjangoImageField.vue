<template>
  <div>
    <a-upload
      list-type="picture-card"
      accept="image/*"
      :file-list="getFileList(value)"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :showUploadList="{showRemoveIcon: canDelete}"
      @preview="handlePreview"
    >
      <a-icon type="upload" />
      <div class="ant-upload-text">
        选择文件
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
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
  data () {
    return {
      previewVisible: false,
      previewImage: ''
    }
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
      getBase64(file).then(res => {
        file.url = res
        this.$emit('change', file)
      })
      return false
    },
    handlePreview (file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    handleCancel () {
      this.previewVisible = false
    }
  }
}
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
