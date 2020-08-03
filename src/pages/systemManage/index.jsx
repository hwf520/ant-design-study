/*
 * @Author: hwf - 1798274010@qq.com
 * @Date: 2020-07-30 15:16:51
 * @Last Modified by: hwf
 * @Last Modified time: 2020-08-03 11:50:24
 */
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Input } from 'antd';
import { connect } from 'umi';
import CreateForm from '@/components/modals/CreateForm';
import UpdateForm from '@/components/modals/UpdateForm';

import { queryList } from './service';

const { confirm } = Modal; // 引入confirm
// 函数组件
export const Index = (props) => {
  const actionRef = useRef();
  const [createModalVisible, handleModalCreateVisible] = useState(false); // hooks写法
  const [updateModalVisible, handleModalUpdateVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState([]); // 定义选中
  const [editItem, setEditItem] = useState({
    initialValues: {},
    labelCol: {},
    wrapperCol: {},
    fields: [],
  });

  // 打开编辑框,并进行赋值
  const openEdit = (row) => {
    // console.log(row);
    setEditItem({
      // 赋初值
      initialValues: {
        ...row,
      },
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
      fields: [
        {
          name: ['treeId'],
          hidden: true,
        },
      ],
    });

    handleModalUpdateVisible(true);
  };

  // 打开新增
  const addAdmin = (values) => {
    props
      .dispatch({
        type: 'systemList/add',
        payload: {
          ...values,
        },
      })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.msg);
          handleModalCreateVisible(false);
          // actionRef.current.reload(); // 进行表格数据刷新
          actionRef.current.reloadAndRest(); // 进行重置所有项并刷新
        }
      });
  };

  // 进行编辑操作
  const editAdmin = (params) => {
    props
      .dispatch({
        type: 'systemList/edit',
        payload: {
          ...params,
        },
      })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.msg);
          handleModalUpdateVisible(false);
          actionRef.current.reload(); // 进行表格数据刷新
        }
      });
  };

  // 进行删除
  const deleteRecord = (id) => {
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除吗?',
      onOk() {
        props
          .dispatch({
            type: 'systemList/del',
            payload: {
              id,
            },
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg);
              actionRef.current.reload(); // 进行表格数据刷新
            }
          });
      },
      onCancel() {
        // console.log('不删除');
      },
    });
  };
  // 进行分页查询
  // const queryList = (values)=>{
  //       props.dispatch({
  //           type: 'systemList/list',
  //           payload: {
  //               treeId: "",
  //           },
  //       });
  //     console.log('values',values);
  // }
  const columns = [
    {
      title: '节点ID',
      dataIndex: 'treeId',
      rules: [
        {
          required: true,
          message: '树节点为必填项',
        },
      ],
    },
    {
      title: '名称',
      dataIndex: 'treeName',
      //   sorter: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          if (updateModalVisible === true) {
            return <Input {...rest} placeholder="请输入" disabled />; // 编辑时进行锁定，不能更改
          }
        }
        return defaultRender(_);
      },
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      render: (text, row) => {
        return (
          <>
            <Button type="primary" icon={<EditOutlined />} onClick={() => openEdit(row)}>
              编辑
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => deleteRecord(row.id)}
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="用户数据列表"
        actionRef={actionRef}
        rowKey="treeId"
        request={(params) =>
          queryList({
            treeId: '', // 添加了额外的参数
            ...params, // 进行分页参数添加
          }).then((res) => {
            const result = {
              data: res.result.data.slice(1, 10), // 返回来的数据列表
              total: res.result.data.length, // 返回来的总条数
              success: true,
              pageSize: 10, // 设置为当前的页数
              current: 1, // 设置为当前的页数
            };
            return result;
          })
        } // 可以考虑在这里进行请求发送
        toolBarRender={() => [
          // toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalCreateVisible(true)}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        onSubmit={(params) => {
          // 可以自行构造相应的参数,这里默认方法请求的是list列表接口,如果调用的是其它接口,
          // 可能需要自己进行函数定义,采用dva,dispath发起请求
          console.log('进行条件查询', params);
        }}
        // dataSource={props.systemList.list} // 采用了model层的数据
        loading={props.loadingAll} // 显示正在加载图标
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows), // 进行存储选中了哪些行
        }}
        // 分页
        pagination={{
          hideOnSinglePage: true, // 数据少于一页时,隐藏分页
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
          // onClick={async () => {
          //   await handleRemove(selectedRowsState);
          //   setSelectedRows([]);
          //   actionRef.current?.reloadAndRest();
          // }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalCreateVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            // 进行调用添加接口
            addAdmin(value);
          }}
          rowKey="id"
          type="form"
          columns={columns}
          rowSelection={{}}
          form={{
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
          }}
        />
      </CreateForm>

      <UpdateForm
        onCancel={() => handleModalUpdateVisible(false)}
        modalVisible={updateModalVisible}
      >
        <ProTable
          form={editItem}
          onSubmit={async (values) => {
            editAdmin(values);
          }}
          rowKey="id" // 这里是key,唯一值，react需要有,不然会有警告
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </UpdateForm>
    </PageHeaderWrapper>
  );
};

export default connect(({ systemList, loading }) => ({
  systemList,
  loadingAll: loading.models.systemList,
}))(Index);
