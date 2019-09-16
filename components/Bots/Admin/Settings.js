import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import SettingsEditor from './components/SettingsEditor';
import Icon from 'components/default/icons';
import Modal from 'components/default/Modal';
import { Filters, LimitFilter, SearchFilter, Table, Thead } from 'components/default/Table';
import { Card, CardBody } from 'components/default/Card';
import { connect } from 'react-redux';
import { adminGetRegions, adminUpdateRegion } from 'store/bot/actions';
import { Button, Paginator } from 'components/default';
import { withTheme } from 'emotion-theming';
import { Select } from 'components/default/inputs';
import { css } from '@emotion/core';
import { NOTIFICATION_TYPES } from 'config';
import { addNotification } from 'store/notification/actions';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  padding: 2px;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  &:last-child {
    margin-right: 0;
  }
`;

const modalStyles = css`
  min-width: 300px;
  overflow-y: visible;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const selectStyles = {
  container: css`margin: 20px 0;`,
  select: {
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 8px',
      borderColor: '#ced4da'
    })
  }
};

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Settings = ({ theme, addNotification, regions, total, getRegions, updateRegion }) => {
  const [clickedRegion, setClickedRegion] = useState(null);
  const [amis, setAmis] = useState([]);
  const [defaultAmi, setDefaultAmi] = useState(null);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const editSettingsModal = useRef(null);

  useEffect(() => {
    getRegions({ page, limit });
  }, []);

  const toOption = item => ({
    value: item.image_id, label: `${item.name} | ${item.image_id}`
  });

  const openEditModal = region => {
    setClickedRegion(region);
    setAmis(region.amis);
    setDefaultAmi(region.default_ami);
    modal.current.open();
  };

  const onModalClose = () => {
    setClickedRegion(null);
    setDefaultAmi(null);
    setAmis([]);
  };

  const getCurrentSelect = () => {
    const value = amis.find((item) => {
      return item.image_id === defaultAmi;
    });
    return value ? { value: value.image_id, label: `${value.name} | ${value.image_id}` } : null;
  };

  const changeRegionAmi = () => {

    updateRegion(clickedRegion.id, {default_ami: defaultAmi})
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Region ami was successfully ${defaultAmi}`
        });
        modal.current.close();
      })
      .catch(() => addNotification({type: NOTIFICATION_TYPES.ERROR, message: 'Ami update failed'}));
  };

  const renderRow = (region, idx) => <tr key={idx}>
    <td>{ region.name }</td>
    <td>{ region.code }</td>
    <td>{ region.limit }</td>
    <td>{ region.created_instances }</td>
    <td>{ region.show_default_ami }</td>
    <td>
      <IconButton title={'Edit Region AMI'} type={'primary'} onClick={() => openEditModal(region)}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <ButtonWrap>
        <Button type={'primary'} onClick={() => editSettingsModal.current.open()}>Edit Global Bot Settings</Button>
      </ButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getRegions({ page, limit: value }); }}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Limit</th>
                <th>Used Limit</th>
                <th>Default AMI</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { regions.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => { setPage(page); getRegions({ page, limit }); }}
          />
        </CardBody>
      </Container>

      <Modal ref={modal} title={'Edit Default AMI'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Select label={'AMI'} onChange={option => setDefaultAmi(option.value)} styles={selectStyles}
          options={amis.map(toOption)} value={getCurrentSelect()}
        />
        <Buttons>
          <Button type={'primary'} onClick={changeRegionAmi}>Update</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={editSettingsModal} title={'Edit Global Settings'} disableSideClosing
        containerStyles={css`margin-top: 0;`} contentStyles={css`min-width: 600px;`}
      >
        <SettingsEditor onClose={() => editSettingsModal.current.close()} />
      </Modal>
    </>
  );
};

Settings.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  regions:    PropTypes.array.isRequired,
  total:      PropTypes.number.isRequired,
  getRegions: PropTypes.func.isRequired,
  updateRegion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  regions: state.bot.regions,
  total: state.bot.totalRegions
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getRegions: (...args) => dispatch(adminGetRegions(...args)),
  updateRegion: (id, data) => dispatch(adminUpdateRegion(id, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Settings));
