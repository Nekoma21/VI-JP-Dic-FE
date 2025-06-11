import axiosClient from "../utils/axiosCustomize.js";

const dashboardAPI = {
  getStats: () => {
    const url = `/dashboard/stats`;
    return axiosClient.applicationAuth.get(url);
  },

  getChart: (period: number) => {
    const url = `/dashboard/user-registration-chart?period=${period}`;
    return axiosClient.applicationAuth.get(url);
  },
};

export default dashboardAPI;
