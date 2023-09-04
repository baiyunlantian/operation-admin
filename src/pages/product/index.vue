<template>
    <div class="product-container">
        <div class="product-main">
            <div class="product-menu-container bg-fff box-shadow padding-2-pre">
                <div class="u-font-22 u-font-weight u-m-r-30">产品目录</div>

                <div class="product-menu">
                    <div :class="[product.productId === selectedProduct.productId ? 'product-active' : '', 'product u-cursor']" v-for="(product, index) in productMenuList" :key="index" @click="handleSelectProduct(product)">
                        <div class="left">
                            <div class="title u-font-22 u-font-weight">{{ product.title }}</div>
                            <div class="viceTitle u-font-16">{{ product.viceTitle }}</div>
                            <div class="version-container">
                                <div :class="[version.productVersionId === selectedVersion.productVersionId ? 'active' : '','version']" v-for="(version) in product.version" :key="version.productVersionId" @click.stop="handleSelectProduct(product, version)">
                                    {{ version.versionName }}
                                </div>
                            </div>
                            <div class="description u-font-weight">{{ selectedVersion.description }}</div>
                            <div class="price u-font-weight">售价：{{ selectedVersion.price }} 元</div>
                        </div>

                        <div class="right">
                            <div class="img-container u-cursor">
                                <img :src="CartImg"/>
                            </div>
                        </div>

                        <el-progress class="progress" :percentage="50" :show-text="false" stroke-linecap="square"/>
                    </div>
                </div>
            </div>

            <div class="product-config-container bg-fff box-shadow padding-2-pre u-m-t-10">
                <div class="u-font-22 u-font-weight u-m-r-30" style="margin-bottom: 1%">产品选配</div>

                <div class="product-config-box">
                    <div class="config-items" v-for="(product, index) in productConfigList" :key="index">
                        <div class="config-type">{{ product[0] }}</div>

                        <div class="config-item">
                            <div class="item" v-for="(option, _index) in product[1]" :key="option.productFeatureId">
                                <div class="left">
                                    <div class="title u-font-22 u-font-weight">{{ option.title }}</div>
                                    <div class="viceTitle u-font-16">{{ option.viceTitle }}</div>
                                    <div class="price u-font-weight">售价：{{ option.price }} 元</div>
                                </div>

                                <div class="right">
                                    <el-checkbox @change="handleChangeCheckbox(option)" :checked="option.isEssential" :disabled="option.isEssential" size="large"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settle-accounts-container bg-fff box-shadow padding-2-pre u-m-t-10">
            <div class="left" :style="{opacity: selectedProduct.productId ? 1 : 0}">
                <div class="product-option">
                    <div class="text">{{ selectedProduct.title }}</div>
                    <div class="version">{{ selectedVersion.versionName }}</div>
                    <div class="count">x 1</div>
                </div>
                <div class="product-option">选配产品 x {{ checkedProductConfig.size }}</div>
            </div>
            <div class="right">
                <div class="total-money">共计<span>{{totalMoney}}</span>元</div>
                <div class="btn" @click="handleClickFooterBtn">结算</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, computed, watch, getCurrentInstance, onMounted } from 'vue';
    import { useRouter } from "vue-router";
    import API from './api';
    import CartImg from '@/assets/images/cart.png';

    const router = useRouter();
    const { proxy } = getCurrentInstance()

    const productMenuList = ref([])
    const productConfigList = ref(new Map())
    const checkedProductConfig = reactive(new Map())
    const selectedProduct = ref({})
    const selectedVersion = ref({})

    function handleFormatConfigList(ConfigList) {
      let configMap = new Map();


      ConfigList.forEach(option=>{
        const {isEssential, productFeatureId, typeId} = option
        if (isEssential) checkedProductConfig.set(productFeatureId, option)
        let list = configMap.has(typeId) ? configMap.get(typeId) : [];
        list.push(option)
        configMap.set(typeId, list)
      })

      productConfigList.value = configMap
    }

    function handleSelectProduct(product, version, initPage = false) {
      let _version = {};

      if (version) {
        _version = version
      }
      // 默认选中专业版
      else {
        const versionList = product.version, length = versionList.length;
        if (Array.isArray(versionList) && length > 0) {
          _version = length > 1 ? version[1] : product.version[0]
        }
      }

      // 优化---点击同个产品同个版本时，不发送新请求
      if (!(product.productId === selectedProduct.value.productId && _version.productVersionId === selectedVersion.value.productVersionId)) {
        checkedProductConfig.clear()
        handleGetProductSelection(_version.productVersionId)
      }

      selectedVersion.value = _version
      selectedProduct.value = initPage ? {} : product
    }

    function handleChangeCheckbox(option) {
      const {productFeatureId} = option
      // 防止初次加载时，未选择产品直接选择选配
      if (JSON.stringify(selectedProduct.value) === '{}') {
        selectedProduct.value = productMenuList.value[0]
      }

      if (checkedProductConfig.has(productFeatureId)) {
        checkedProductConfig.delete(productFeatureId)
      }else {
        checkedProductConfig.set(productFeatureId, option)
      }
    }

    function handleClickFooterBtn() {
      const {productId, title} = selectedProduct.value;
      const {price, productVersionId} = selectedVersion.value;
      // 没有选中商品不可跳转
      if (productId) {
        let params = [{title, price, productMarking:1, count:1, productId: productVersionId}]

        checkedProductConfig.forEach(option=>{
          const {title, price, productFeatureId} = option
          params.push({title, price, productMarking:2, count:1, productId: productFeatureId})
        })
        sessionStorage.setItem('product', JSON.stringify(params))
        // 不向 history 添加 settleAccount页面 记录
        router.replace({path: '/settleAccount'})
      }else {
        proxy.$message({
          type: 'warning',
          message: '请选择购买的商品！'
        })
      }
    }

    function handleGetProductMenu() {
      API.getProductMenu().then(res=>{
        if (res.code == 0) {
          productMenuList.value = res.data || [];

          if (Array.isArray(res.data) && res.data.length > 0) {
            const firstProduct = res.data[0]
            handleSelectProduct(firstProduct, null, true)
          }
        }
      })
    }
    
    function handleGetProductSelection(productVersionId) {
      if (productVersionId) {
        API.getProductSelection({productVersionId}).then(res=>{
          if (res.code == 0) {
            handleFormatConfigList(res.data || [])
          }
        })
      }
    }

    const totalMoney = computed(() => {
      let money = 0;
      if (JSON.stringify(selectedProduct.value) !== '{}' && selectedVersion.value.price) {
        money += selectedVersion.value.price

        checkedProductConfig.forEach(product=>{
          money += product.price
        })
      }

      return money.toFixed(2)
    })

    onMounted(() => {
      handleGetProductMenu()
    })
</script>

<style scoped lang="scss">
    .product-container{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: auto !important;
        min-height: 100%;
        margin: 0 2% 1% 2%;

        .box-shadow{box-shadow: 0px 1px 4px 0px #d6d6d6;}
        .padding-2-pre {padding: 1.5% 2%;}

        .viceTitle{
            color: #b1b1b1;
            font-weight: bold;
            font-size: 14px;
        }

        .price{
            color: #3164f5;
            font-size: 15px;
        }

        .product-main{
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .product-menu{
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1%;

            .product-active{
                box-shadow: inset 0px 1px 5px 0px #5996ff;
            }

            .product{
                position: relative;
                width: 30%;
                border: 1px solid #dedede;
                border-radius: 4px;
                padding: 1%;
                display: flex;

                .left{
                    flex: 1;

                    .title{
                        position: relative;
                    }

                    .version-container{
                        position: relative;
                        display: flex;
                        align-items: center;
                        margin-top: 1vh;

                        .version{
                            position: relative;
                            font-size: 14px;
                            padding: 5px 10px;
                            text-align: center;
                            background-color: #e3e6eb;
                            color: #7d7d7d;
                            margin-right: 10px;
                            border-radius: 4px;
                            cursor: pointer;
                        }

                        .active {
                            background-color: #00a870;
                            color: #ffffff;
                        }
                    }

                    .description{
                        font-size: 14px;
                        margin: 3vh 0 4vh 0;
                        color: #b1b1b1;
                        font-weight: bold;
                    }

                }

                .right{
                    width: 50px;

                    .img-container{
                        width: 100%;
                        height: 50px;
                        border-radius: 50%;
                        background-color: #d4e3fc;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        img{
                            width: 50%;
                            height: 50%;
                        }
                    }

                    .arrow-right{
                        font-size: 14px;
                        color: #c7c7c7;
                        margin-top: 8vh;
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }
                }

                .progress{
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                }
            }
        }

        .product-config-container{
            position: relative;
            flex: 1;
            margin-top: 1%;

            .product-config-box{
                position: relative;

                .config-items{
                    position: relative;
                    margin-top: 1%;

                    .config-type{
                        font-size: 16px;
                        color: #848484;
                        font-weight: bold;
                        margin-bottom: 1vh;
                    }

                    .config-item{
                       display: flex;
                        flex-wrap: wrap;

                        .item{
                            width: 29%;
                            margin-right: 1%;
                            margin-bottom: 1%;
                            padding: 1.5%;
                            border: 1px solid #dedede;
                            border-radius: 4px;
                            display: flex;
                            justify-content: space-between;

                            .price{
                                margin: 1vh 0;
                            }
                        }
                    }
                }
            }
        }

        .settle-accounts-container{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1% 2%;
            font-size: 16px;

            .left{
                position: relative;

                .product-option{
                    position: relative;
                    display: flex;
                    align-items: center;

                    .version{
                        background-color: #3164f5;
                        padding: 4px 10px;
                        color: #fff;
                        border-radius: 4px;
                        margin: 0 10px;
                        font-size: 14px;
                    }
                }
            }

            .right{
                display: flex;
                align-items: center;

                .total-money{
                    span{
                        color: #3164f5;
                        margin: 0 5px;
                    }
                }

                .btn{
                    background-color: #0052d9;
                    color: #ffffff;
                    padding: 8px 20px;
                    text-align: center;
                    letter-spacing: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 1vw;
                    font-size: 14px;
                }
            }
        }
    }
</style>