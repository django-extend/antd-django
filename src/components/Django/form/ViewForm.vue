<template>
  <a-drawer
    title="查看"
    :width="720"
    :visible="visible"
    @close="handleClose"
  >
    <a-descriptions v-for="fieldset in fieldsets" :key="fieldset[0]" :title="fieldset[0]" bordered :column="1">
      <a-descriptions-item v-for="field in fieldset[1].fields" :key="field.name" :label="field.label">
        {{ field.value }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="submit-tail">
      <a-button @click="handleClose">关闭</a-button>
    </div>
  </a-drawer>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    sourceKey: {
      type: String,
      required: true
    },
    metaInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      fieldsets: []
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        return
      }
      const vm = this
      vm.loading = true
      const [app, model] = this.$route.name.split('.')
      resource.getView(app, model, vm.sourceKey).then(res => {
        vm.bind(res)
      })
      .finally(() => {
        vm.loading = false
      })
    }
  },
  methods: {
    bind (values) {
      this.resetData()
      const fieldInfos = this.metaInfo.actions.POST
      const sourceFieldsets = this.metaInfo.fieldsets
      const fieldsets = []
      sourceFieldsets.forEach(item => {
        const fields = []
        item[1].fields.forEach(name => {
          const meta = fieldInfos[name]
          let value = values[name]
          value = value instanceof Array ? value.join() : value
          fields.push({
            label: meta.label,
            name: name,
            value: value
          })
        })
        fieldsets.push([item[0], { fields: fields }])
      })
      this.fieldsets = fieldsets
    },
    resetData () {
      this.fieldsets = []
    },
    handleClose () {
      this.resetData()
      this.$emit('close')
    }
  }
}
</script>
