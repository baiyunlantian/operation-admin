<template>
    <div class="product-container">
        <div class="product-menu-container bg-fff box-shadow padding-2-pre u-m-t-10">
            <div class="u-font-22 u-font-weight u-m-r-30">产品目录</div>

            <div class="product-menu">
                <div :class="[product.productId === selectedProduct.productId ? 'product-active' : '', 'product u-cursor']" v-for="(product, index) in productMenuList" :key="index" @click="handleSelectProduct(product)">
                    <div class="left">
                        <div class="title u-font-22 u-font-weight">{{ product.title }}</div>
                        <div class="viceTitle u-font-16">{{ product.viceTitle }}</div>
                        <div class="version-container">
                            <div :class="[version.versionId === versionInfo.versionId ? 'active' : '','version']" v-for="(version) in product.version" :key="version.versionId" @click.stop="handleSelectProduct(product, version)">
                                {{ version.name }}
                            </div>
                        </div>
                        <div class="description u-font-weight">{{ product.description }}</div>
                        <div class="price u-font-weight">售价：{{ product.price }} 元</div>
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
                <div class="config-items" v-for="(product, index) in _productConfigList" :key="index">
                    <div class="config-type">{{ product[0] }}</div>

                    <div class="config-item">
                        <div class="item" v-for="(option, _index) in product[1]" :key="_index">
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

        <div class="settle-accounts-container bg-fff box-shadow padding-2-pre u-m-t-10">
            <div class="left" :style="{opacity: selectedProduct.productId ? 1 : 0}">
                <div class="product-option">
                    <div class="text">{{ selectedProduct.title }}</div>
                    <div class="version">{{ versionInfo.name }}</div>
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
    import { ref, reactive, computed, watch, getCurrentInstance } from 'vue';
    import { useRouter } from "vue-router";
    import CartImg from '@/assets/images/cart.png';

    const router = useRouter();
    const { proxy } = getCurrentInstance()

    const productMenuList = ref([
      {
        productId:'zhuhou',
        title: '吗哩呀咔-智能助手',
        viceTitle: '吗哩呀咔语言大模型',
        description: '这是描述文字',
        price: 4088,
        version: [
          {name:'基础班', versionId:'zhuhou1'},
          {name:'专业班', versionId:'zhuhou2'},
          {name:'企业班', versionId:'zhuhou3'},
        ],
      },
      {
        productId:'markinif',
        title: '吗哩呀咔-营销文案',
        viceTitle: '吗哩呀咔语言大模型',
        description: '这是描述文字',
        price: 4088,
        version: [
          {name:'基础班', versionId:'markinif1'},
          {name:'专业班', versionId:'markinif2'},
          {name:'企业班', versionId:'markinif3'},
        ],
      },
      {
        productId:'paint',
        title: '吗哩呀咔-智能绘图',
        viceTitle: '吗哩呀咔语言大模型',
        description: '这是描述文字',
        price: 4088,
        version: [
          {name:'基础班', versionId:'paint1'},
          {name:'专业班', versionId:'paint2'},
          {name:'企业班', versionId:'paint3'},
        ],
      }
    ])
    const productConfigList = ref([
      {type:'功能选配', title:'创建自定义角色', viceTitle:'AI助手', price:883, isEssential:true,optionId:'qweeqw'},
      {type:'运营选配', title:'邀请好友', viceTitle:'AI助手', price:883, isEssential:false,optionId:'fgjhfgt'},
      {type:'运营选配', title:'弹窗广告', viceTitle:'AI助手', price:883, isEssential:false,optionId:'tjtykgh'},
      {type:'多终端产品', title:'微信小程序', viceTitle:'AI助手', price:883, isEssential:false,optionId:'yukyvbc'},
      {type:'基础服务', title:'服务器', viceTitle:'AI助手', price:883, isEssential:true,optionId:'piwejpj'},
      {type:'功能选配', title:'自定义对话角色', viceTitle:'AI助手', price:883, isEssential:true,optionId:'xcvbfg'},
      {type:'运营选配', title:'自定义套餐', viceTitle:'AI助手', price:883, isEssential:false,optionId:'wetfag'},
      {type:'运营选配', title:'兑换码管理', viceTitle:'AI助手', price:883, isEssential:false,optionId:'gyktyk'},
      {type:'多终端产品', title:'微信公众号', viceTitle:'AI助手', price:883, isEssential:false,optionId:'oyujkn'},
      {type:'多终端产品', title:'微信订阅号', viceTitle:'AI助手', price:883, isEssential:false,optionId:'mvxcza'},
      {type:'其他配套', title:'AI互动课程', viceTitle:'AI助手', price:883, isEssential:false,optionId:'qsasvx'},
      {type:'其他配套', title:'付费问答', viceTitle:'AI助手', price:883, isEssential:false,optionId:'hrttnn'},
    ])
    const _productConfigList = ref(new Map())
    const checkedProductConfig = reactive(new Map())
    const selectedProduct = ref({})
    const versionInfo = ref({})

    function handleFormatConfigList(ConfigList) {
      let configMap = new Map();

      ConfigList.forEach(option=>{
        if (option.isEssential) checkedProductConfig.set(option.optionId, option)
        let list = configMap.has(option.type) ? configMap.get(option.type) : [];
        list.push(option)
        configMap.set(option.type, list)
      })

      _productConfigList.value = configMap
    }

    function handleSelectProduct(product, version) {
      selectedProduct.value = product
      versionInfo.value = version ? version : product.version[1]
      checkedProductConfig.clear()
      handleFormatConfigList(productConfigList.value)
    }

    function handleChangeCheckbox(option) {
      if (checkedProductConfig.has(option.optionId)) {
        checkedProductConfig.delete(option.optionId)
      }else {
        checkedProductConfig.set(option.optionId, option)
      }
    }

    function handleClickFooterBtn() {
      // 没有选中商品不可跳转
      if (selectedProduct.value.productId) {
        let params = [{...selectedProduct.value, type:'1', count:1}]

        checkedProductConfig.forEach(product=>{
          params.push({...product, type:'2', count:1})
        })
        sessionStorage.setItem('product', JSON.stringify(params))
        router.push({path: '/settleAccount'})
      }else {
        proxy.$message({
          type: 'info',
          message: '请选择购买的商品！'
        })
      }
    }

    const totalMoney = computed(() => {
      let money = 0;
      if (selectedProduct.value.price) {
        money += selectedProduct.value.price

        checkedProductConfig.forEach(product=>{
          money += product.price
        })
      }

      return money.toFixed(2)
    })

    watch(
      () => productConfigList.value,
      (newVal) => {
        handleFormatConfigList(newVal)
      }, {deep: true, immediate: true}
    )
</script>

<style scoped lang="scss">
    .product-container{
        position: relative;
        height: auto !important;
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