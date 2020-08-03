/*
 * @Author: hwf - 1798274010@qq.com
 * @Date: 2020-07-30 15:16:51
 * @Last Modified by: hwf
 * @Last Modified time: 2020-08-03 08:53:12
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
              // 这里应该还需要发一个请求，进行表格数据刷新
            }
          });
      },
      onCancel() {
        // console.log('不删除');
      },
    });
  };
  // 进行查询
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
      sorter: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          if (updateModalVisible === true) {
            return <Input {...rest} placeholder="请输入" disabled />;
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
        // request={(params, sorter, filter) => queryList({ ...params, sorter, filter })}  //可以考虑在这里进行请求发送
        toolBarRender={() => [
          // toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalCreateVisible(true)}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        dataSource={props.systemList.list}
        loading={props.loadingAll} // 显示正在加载图标
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows), // 进行存储选中了哪些行
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
