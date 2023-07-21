<template>
  <div class="container">
    <!-- header  -->
    <div v-if="header || titleLabel || titleVaule" class="header_container">
      <slot name="header">
        <div class="title_container">
          <div class="title_label_container">{{ titleLabel }}</div>
          <div
            class="title_value_container"
            :style="{
                '--titleValueColor': titleValueColor
                  ? titleValueColor
                  : color[type].titleValueColor,
              }"
          >{{ titleValue }}</div>
        </div>
      </slot>
    </div>
    <!-- main  -->
    <div class="main_container">
      <slot></slot>
    </div>
    <!-- footer -->
    <div v-if="footer || footerLabel || footerVaule" class="footer_container">
      <slot name="footer">
        <div class="footer_label_container">{{ footerLabel }}</div>
        <div class="footer_value_container">{{ footerValue }}</div>
      </slot>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    titleValueColor: {
      type: String
    },
    type: {
      default: "primary",
      type: String
    },
    header: {
      default: false,
      type: Boolean
    },
    titleLabel: {
      type: String
    },
    titleValue: {
      type: [String, Number]
    },
    footer: {
      default: false,
      type: Boolean
    },
    footerLabel: {
      type: String
    },
    footerValue: {
      type: [String, Number]
    }
  },
  data() {
    return {
      color: {
        primary: { titleValueColor: "#409eff" },
        success: { titleValueColor: "#67c23a" },
        info: { titleValueColor: "#909399" },
        warning: { titleValueColor: "#e6a23c" },
        danger: { titleValueColor: "#f56c6c" }
      }
    };
  }
};
</script>
  
  <style lang="scss" scoped>
.container {
  font-size: 14px;
  background-color: #fff;
  box-shadow: #eee 0px 0px 25px;
  .title_container {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .title_value_container {
      font-size: 20px;
      color: var(--titleValueColor);
      font-size: 25px;
    }
  }
  .main_container {
    padding: 10px;
  }
  .footer_container {
    display: flex;
    align-items: center;
    border-top: 1px solid #ccc;
    padding: 10px;
    font-size: 12px;
  }
}
</style>