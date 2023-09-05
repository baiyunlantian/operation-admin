import HTTP from "@/utils/request";

const getTopData = (params) => {
  return HTTP.get("/RedemptionCode/Page", params);
};

const getUserStatistic = (params) => {
  return HTTP.get("/RedemptionCode/Page", params);
};

export { getTopData, getUserStatistic };
