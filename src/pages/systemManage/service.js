/*
 * @Author: hwf - 1798274010@qq.com 
 * @Date: 2020-07-30 15:39:53 
 * @Last Modified by: hwf
 * @Last Modified time: 2020-07-30 23:12:13
 */
import request from 'umi-request';

export async function queryList(params) {
  console.log('params',params);
  return request('/api/search/getChildTreesInfo', {
    method: 'POST',
    // params
    data:{
      ...params
    }
  });
}

export async function add(params) {
  return request('/api/add', {
    method: 'POST',
    data:{
      ...params
    }
  });
}
