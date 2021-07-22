<template>
  <a-select
    :show-search="relation.lazy"
    label-in-value
    :value="valueObject"
    style="min-width: 200px"
    :filter-option="false"
    @change="handleChange"
    @search="handleSearch"
    @popupScroll="handleScroll"
  >
    <div slot="dropdownRender" slot-scope="menu">
      <v-nodes :vnodes="menu" />
      <div style="text-align:center;">
        <a-spin v-if="autocompleteLoading"/>
      </div>
    </div>
    <a-select-option v-for="choice in choices" :key="choice.key">{{ choice.label }}</a-select-option>
  </a-select>
</template>
<script>
import * as resource from '../api/resource'
const DEFAULT_PAGESIZE = 20
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      choices: [
      ],
      valueObject: {
      },
      autocompleteLoading: false,
      pageInfo: {

      },
      searchKeyword: ''
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    relation: {
      type: Object,
      required: true
    }
  },
  mounted () {
    if (this.value) {
      resource.getStr(this.relation.app, this.relation.model, this.value).then(res => {
        this.valueObject = {
          key: this.value,
          label: res.str
        }
      })
    }
    const pageSize = this.relation.lazy ? DEFAULT_PAGESIZE : -1
    resource.listAutoComplete(this.relation.app, this.relation.model, { pageSize: pageSize }).then(res => {
      this.choices = res.result.data
      this.pageInfo = res.result
    })
  },
  methods: {
    doAutoCompleteLoad () {
      if (this.autocompleteLoading) {
        return
      }
      if (this.pageInfo.totalPage && this.pageInfo.pageNo >= this.pageInfo.totalPage) {
        return
      }
      const params = {
        pageSize: DEFAULT_PAGESIZE,
        search: this.searchKeyword
      }
      if (this.pageInfo.pageNo) {
        params.pageNo = this.pageInfo.pageNo + 1
      }
      const vm = this
      vm.autocompleteLoading = true
      resource.listAutoComplete(this.relation.app, this.relation.model, params).then(res => {
        vm.autocompleteLoading = false
        vm.pageInfo = res.result
        vm.choices.push(...res.result.data)
      })
    },
    handleChange (val) {
      this.valueObject = val
      this.$emit('change', val.key)
    },
    handleSearch (val) {
      this.searchKeyword = val
      this.pageInfo = {}
      this.choices = []
      this.doAutoCompleteLoad()
    },
    handleScroll (e) {
      if (!this.relation.lazy) {
        return
      }
      const { target } = e
      const rmHeight = target.scrollHeight - target.scrollTop
      const clHeight = target.clientHeight
      if (rmHeight === 0 && clHeight === 0) {
      } else {
        if (rmHeight === clHeight) {
          this.doAutoCompleteLoad()
        }
      }
    }
  }
}
</script>
