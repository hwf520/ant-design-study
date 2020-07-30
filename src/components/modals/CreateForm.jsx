/*
 * @Author: hwf - 1798274010@qq.com 
 * @Date: 2020-07-30 15:19:53 
 * @Last Modified by: hwf
 * @Last Modified time: 2020-07-30 20:15:07
 */

import React from 'react';
import { Modal } from 'antd';

const CreateForm = props => {
  const { modalVisible, onCancel } = props;
  return (
    <Modal
      destroyOnClose
      title="添加"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
