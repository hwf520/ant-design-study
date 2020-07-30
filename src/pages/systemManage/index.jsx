/*
 * @Author: hwf - 1798274010@qq.com
 * @Date: 2020-07-30 15:16:51
 * @Last Modified by: hwf
 * @Last Modified time: 2020-07-31 00:03:53
 */
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { connect } from 'umi';
import CreateForm from '@/components/modals/CreateForm';
import UpdateForm from '@/components/modals/UpdateForm';

// 函数组件
export const Index = (props) => {
  const actionRef = useRef();
  const [createModalVisible, handleModalCreateVisible] = useState(false);
  const [updateModalVisible, handleModalUpdateVisible] = useState(false);
  const [editItem, setEditItem] = useState({
    initialValues: {},
    labelCol: {},
    wrapperCol: {},
  });

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
    });

    handleModalUpdateVisible(true);
  };

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
            <Button danger type="primary" icon={<DeleteOutlined />}>
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
        rowKey="key"
        // request={params => queryList(params)}  //可以考虑在这里进行请求发送
        toolBarRender={() => [
          // toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalCreateVisible(true)}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        dataSource={props.systemList.list}
        columns={columns}
        rowSelection={{}}
      />

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
          rowKey="id"
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
  loading: loading.models.systemList,
}))(Index);
