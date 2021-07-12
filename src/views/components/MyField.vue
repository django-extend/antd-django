<template>
  <a-drawer :width="620" @close="$emit('close')" :visible="visible">
    <a-form-model>
      <a-form-model label="dfadas">
        <a-transfer
          :data-source="dataSource"
          :target-keys="targetKeys"
          :render="item => item.title"
          @change="handleChange"
        >
        </a-transfer>
      </a-form-model>
    </a-form-model>
  </a-drawer>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    choices: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      targetKeys: [],
      dataSource: []
    }
  },
  watch: {
    value (val) {
      console.log('m2m newval', val)
      this.targetKeys = this.formatKeys(val)
    },
    choices (val) {
      console.log('m2m new choices', val)
      this.dataSource = this.formatSource(val)
    }
  },
  mounted () {
    console.log('m2m mounted')
    this.dataSource = this.formatSource(this.choices)
    this.targetKeys = this.formatKeys(this.value)
  },
  methods: {
    formatSource (source) {
      const rs = []
      Object.entries(source).forEach(item => {
        rs.push({ key: item[0].toString(), title: item[1] })
      })
      return rs
    },
    formatKeys (source) {
      const rs = []
      source.forEach(item => {
        rs.push(item.toString())
      })
      return rs
    },
    handleChange (nextTargetKeys) {
      this.$emit('change', nextTargetKeys)
    }
  }
}
</script>
