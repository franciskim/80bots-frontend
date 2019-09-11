import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import LaunchEditor from './components/LaunchEditor';
import Router from 'next/router';
import Modal from '../default/Modal';
import { css } from '@emotion/core';
import { Button, Badge, Paginator } from '../default';
import { Card, CardBody } from '../default/Card';
import { Table, Thead, Filters, LimitFilter, SearchFilter } from '../default/Table';
import { connect } from 'react-redux';
import { getBots, launchInstance } from 'store/bot/actions';
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from 'config';
import { addNotification } from 'store/notification/actions';
import { Range } from '../default/inputs';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const inputStyle = {
  container: css`
    margin-top: 10px;
  `,
};

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const Bots = ({ addNotification, getBots, launchInstance, bots, total }) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [instances, setInstances] = useState(1);

  const modal = useRef(null);
  const modalSetParams = useRef(null);

  const launchBot = (params) => {

    console.log(instances);
    return false;

    modal.current.close();

    launchInstance(clickedBot.id, params).then(() => {
      addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'New instance is enqueued for launch' });
      setTimeout(() => {
        Router.push('/bots/running');
      }, (NOTIFICATION_TIMINGS.DURATION * 2) + NOTIFICATION_TIMINGS.INFO_HIDE_DELAY);
    }).catch(({ error : { response } }) => {
      if (response && response.data) {
        addNotification({type: NOTIFICATION_TYPES.ERROR, message: response.data.message});
      } else {
        addNotification({type: NOTIFICATION_TYPES.ERROR, message: 'Error occurred during new instance launch'});
      }
    }).finally(() => {
    });
  };

  useEffect(() => {
    getBots({ limit, page });
  }, []);

  const setInstancesParams = () => {
    console.log(instances);
  };

  const renderRow = (bot, idx) => <tr key={idx}>
    <td>{ bot.platform }</td>
    <td>{ bot.name }</td>
    <td>{ bot.description }</td>
    <td>
      {
        bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => <Tag key={idx} pill type={'info'}>{ tag['name'] }</Tag>)
          : '-'
      }
    </td>
    <td>
      <Launch type={'primary'} onClick={() => { setClickedBot(bot); modal.current.open(); }}>
      Launch
      </Launch>
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getBots({ page, limit: value }); }}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <th>Bot Platform</th>
                <th>Bot Name</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>
              { bots.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); getBots({ page, limit }); }}/>
        </CardBody>
      </Container>

      <Modal ref={modal} title={'Launch selected bot?'}
        contentStyles={css`overflow: visible;`} disableSideClosing
      >
        <Range label={'Select the number of instances to run'} styles={inputStyle}
          min={1} max={10}
          onChange={value => setInstances(value) } value={instances}
        />
        <Buttons>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
          <Button type={'primary'} onClick={() => { modal.current.close(); modalSetParams.current.open(); }}>Next</Button>
        </Buttons>
      </Modal>

      <Modal ref={modalSetParams} title={'Input the parameters for instance #1'} onClose={() => setClickedBot(null)}
        contentStyles={css`overflow: visible;`} disableSideClosing
      >
        <LaunchEditor bot={clickedBot} onClose={() => modalSetParams.current.close()} onSubmit={launchBot}/>
      </Modal>
      {/*<Modal ref={modal} title={'Launch selected bot?'} onClose={() => setClickedBot(null)}*/}
      {/*  contentStyles={css`overflow: visible;`} disableSideClosing*/}
      {/*>*/}
      {/*  <LaunchEditor bot={clickedBot} onClose={() => modal.current.close()} onSubmit={launchBot} />*/}
      {/*</Modal>*/}
    </>
  );
};

Bots.propTypes = {
  getBots: PropTypes.func.isRequired,
  launchInstance: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  total: state.bot.total,
});

const mapDispatchToProps = dispatch => ({
  getBots: query => dispatch(getBots(query)),
  addNotification: payload => dispatch(addNotification(payload)),
  launchInstance: (id, params) => dispatch(launchInstance(id, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bots);
