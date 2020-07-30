/*
 * @Author: hwf - 1798274010@qq.com 
 * @Date: 2020-07-30 15:39:23 
 * @Last Modified by: hwf
 * @Last Modified time: 2020-07-30 23:15:33
 */
import { queryList,add } from './service';

const Model = {
  namespace: 'systemList',
  state: {
    list: [],
  },
  effects: {
    *list({ payload }, { call,put }) {
      const response = yield call(queryList, payload);
    //   console.log('response',response);
      if(response.reason==="success"){
        yield put({
            type: 'queryList',
            payload: Array.isArray(response.result.data) ? response.result.data : [],
          });
      }
     
    },
    *add({ payload }, { call }) {
        const response = yield call(add, payload);
        return response;
      },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
    // 用于订阅一个数据源
    subscriptions: {
        setup({ dispatch, history }) {
          return history.listen(({ pathname }) => {
            if (pathname === '/systemManage') {
              dispatch({
                type: 'list',
                payload: {
                    treeId: "",
                },
              });
            }
          });
        },
    },
};
export default Model;
