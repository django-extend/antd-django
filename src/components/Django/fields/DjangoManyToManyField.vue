<template>
  <a-transfer
    :data-source="dataSource"
    :target-keys="targetKeys"
    :render="item => item.title"
    :lazy="false"
    :showSearch="true"
    @change="handleChange"
  >
  </a-transfer>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      required: false,
      default: undefined
    },
    choices: {
      type: Object,
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
      this.targetKeys = this.formatKeys(val)
    },
    choices (val) {
      this.dataSource = this.formatSource(val)
    }
  },
  mounted () {
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
      if (source) {
        source.forEach(item => {
          rs.push(item.toString())
        })
      }
      return rs
    },
    handleChange (nextTargetKeys) {
      this.$emit('change', nextTargetKeys)
    }
  }
}
</script>
