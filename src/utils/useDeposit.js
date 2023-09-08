import { computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';


export function useDeposit() {
  const store = useStore();
  const { proxy } = getCurrentInstance();
  const agentInfo = computed(() => {
    return store.getters["user/agentInfo"]
  })

  const getDepositStatus = (callback) => {
    let status = true;
    const { isFreeOfCommission, isPayCashPledge } = agentInfo.value

    if (isFreeOfCommission === false && isPayCashPledge === false) {
      if (typeof callback === 'function') {
        callback()
      }else {
        proxy.$message({
          type: 'warning',
          message: '请先支付押金！'
        })
      }

      status = false
    }
    return status
  }

  return { getDepositStatus }
}