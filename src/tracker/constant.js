export const xpathList = [
  '//*[@id="1212"]/div[2]/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/table/tbody/tr[1]/td[2]/div/div',
  '//*[@id="10892870"]/span',
  '//*[@id="app"]/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/table/tbody/tr[1]/td[2]/div/div',
  '//*[@id="app"]/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/table/tbody/tr[2]/td[2]/div/div',
]

export const TrackerList = [
  {
    // 定义埋点位置
    xpath:
      '//*[@id="app"]/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/table/tbody/tr[2]/td[2]/div/div',
    trackerData: {
      page_data: {
        data_id: '{config.data_id}',
        data_type: 'Merchant',
        ext: { pagename_cn: 'WEB商家详情页' },
        pangu_page_data_type: 'Merchant',
        pangu_seq_page_data_id: '{config.pangu_seq_page_data_id}',
      },
      element_data: {
        data_id: '{index.data_id}',
        data_type: 'Example',
        pangu_data_type: 'Photography_work',
        pangu_seq_data_id: '{index.pangu_seq_data_id}',
      },
    },
  },
  {
    xpath: '//*[@id="10892870"]/span',
  },
]
