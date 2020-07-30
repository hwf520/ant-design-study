/*
 * @Author: hwf - 1798274010@qq.com 
 * @Date: 2020-07-30 15:20:09 
 * @Last Modified by: hwf
 * @Last Modified time: 2020-07-30 15:21:04
 */
import React from 'react';
import { Modal } from 'antd';

const UpdateForm = props => {
  const { modalVisible, onCancel } = props;
  return (
    <Modal
      destroyOnClose
      title="修改"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
