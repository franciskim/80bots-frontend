import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import SettingsEditor from './components/SettingsEditor';
import Icon from '/components/default/icons';
import Modal from '/components/default/Modal';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { Filters, LimitFilter, SearchFilter, Table, Th, Thead } from '/components/default/Table';
import { Card, CardBody } from '/components/default/Card';
import { adminGetRegions, adminUpdateRegion, syncRegions } from '/store/bot/actions';
import { Button, Paginator } from '/components/default';
import { Select } from '/components/default/inputs';
import { NOTIFICATION_TYPES } from '/config';
import { addNotification } from '/store/notification/actions';
import { addListener } from '/store/socket/actions';

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

const Settings = ({ theme, addNotification, addListener, user, regions, total, getRegions, updateRegion, syncRegions, syncLoading }) => {
  const [clickedRegion, setClickedRegion] = useState(null);
  const [amis, setAmis] = useState([]);
  const [defaultAmi, setDefaultAmi] = useState(null);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: '', field: '' });
  const [search, setSearch] = useState(null);

  const modal = useRef(null);
  const editSettingsModal = useRef(null);

  useEffect(() => {
    getRegions({ page, limit });

    addListener(`regions.${user.id}`, 'RegionsSyncSucceeded', () => {
      addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Sync completed' });
      getRegions({ page, limit, sort: order.field, order: order.value, search });
    });

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

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getRegions({ page, limit, sort: field, order: value, search });
  };

  const OrderTh = props => <Th {...props}
    // eslint-disable-next-line react/prop-types
    order={(props.field === order.field) || (props.children === order.field) ? order.value : ''}
    onClick={onOrderChange}
  />;

  const searchRegions = (value) => {
    setSearch(value);
    getRegions({ page, limit, sort: order.field, order: order.value, search: value });
  };

  const sync = () => {
    syncRegions()
      .then(() => addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'Sync started' }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Sync cannot be started' }));
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
        <Button type={'primary'} onClick={sync} loading={`${syncLoading}`} loaderWidth={148}>
          Sync Regions
        </Button>
      </ButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getRegions({ page, limit: value, sort: order.field, order: order.value, search }); }}/>
            <SearchFilter onChange={( value ) => { searchRegions(value); }}/>
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <OrderTh field={'name'}>Name</OrderTh>
                <OrderTh field={'code'}>Code</OrderTh>
                <OrderTh field={'limit'}>Limit</OrderTh>
                <OrderTh field={'used_limit'}>Used Limit</OrderTh>
                <th>Default AMI</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { regions.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => { setPage(page); getRegions({ page, limit, sort: order.field, order: order.value, search }); }}
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
  addListener: PropTypes.func.isRequired,
  user: PropTypes.object,
  regions: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  getRegions: PropTypes.func.isRequired,
  updateRegion: PropTypes.func.isRequired,
  syncRegions: PropTypes.func.isRequired,
  syncLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  regions: state.bot.regions,
  total: state.bot.totalRegions,
  syncLoading: state.bot.syncLoading,
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
  getRegions: (...args) => dispatch(adminGetRegions(...args)),
  updateRegion: (id, data) => dispatch(adminUpdateRegion(id, data)),
  syncRegions: () => dispatch(syncRegions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Settings));
