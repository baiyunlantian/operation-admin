<template>
    <div class="tab-box u-flex u-flex-nowrap u-p-t-8 u-p-l-8 u-p-r-8">
        <el-scrollbar style="width: 100%;" class="u-flex u-flex-nowrap">
            <div class="u-flex u-flex-nowrap u-p-b-8" style="width: 100%;">
                <el-tag 
                    v-for="(item, index) in mainNavList" :key="item.name" 
                    :closable="index > 0" 
                    @click="clickNav(item.name, item.path)" 
                    @close="clickClose(index, item.path)" 
                    :type="getNavPath.indexOf(item.name) >= 0 ? 'primary': 'info'"
                >
                    {{ item.meta.level }}
                </el-tag>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            mainNavList: {
                type: Array,
                default () {
                    return []
                }
            },
            getNavPath: {
                type: String,
                default () {
                    return '/home'
                }
            }
        },
        methods: {
            // 点击跳转
            clickNav(name, path) {
                this.$router.push({
                    path: path
                })
                this.$store.commit('setNavPath', path)
            },
            // 关闭标签
            clickClose(index, path) {
                this.mainNavList.splice(index, 1)
                // 判断是否关闭当前激活的标签
                if (this.getNavPath == path) {
                    var idx = this.mainNavList.length - 1
                    var name = this.mainNavList[idx].name
                    var path = this.mainNavList[idx].path
                    this.$router.push({
                        path: path
                    })
                    this.$store.commit('setNavPath', path)
                }
                var mainNavList = JSON.stringify(this.mainNavList)
                sessionStorage.setItem('navCtrl', mainNavList)
            },

        }
    };
</script>

<style lang='scss' scoped>
.tab-box {
       margin: 0;
       background: #EAEDF7;
    //    border-radius: 12px 12px 0px 0px;
    //    border: 1px solid #F7FBFF;
    .el-tag {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>