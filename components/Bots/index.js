import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import LaunchEditor from "./components/LaunchEditor";
import Router from "next/router";
import Modal from "../default/Modal";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { Button, Badge, Paginator } from "/components/default";
import { Card, CardBody } from "/components/default/Card";
import {
  Table,
  Thead,
  Filters,
  LimitFilter,
  SearchFilter,
  Th
} from "/components/default/Table";
import { getBots, launchInstance, setBotLimit } from "/store/bot/actions";
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from "/config";
import { addNotification } from "/store/notification/actions";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
`;

const Tag = styled(Badge)`
  margin-right: 0.5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const Bots = ({
  notify,
  getBots,
  launchInstance,
  bots,
  total,
  limit,
  setLimit
}) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [search, setSearch] = useState(null);

  const modal = useRef(null);

  const launchBot = params => {
    modal.current.close();

    launchInstance(clickedBot.id, params)
      .then(() => {
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: "New instance is enqueued for launch"
        });
        setTimeout(() => {
          Router.push("/bots/running");
        }, NOTIFICATION_TIMINGS.DURATION * 2 + NOTIFICATION_TIMINGS.INFO_HIDE_DELAY);
      })
      .catch(({ error: { response } }) => {
        if (response && response.data) {
          notify({
            type: NOTIFICATION_TYPES.ERROR,
            message: response.data.message
          });
        } else {
          notify({
            type: NOTIFICATION_TYPES.ERROR,
            message: "Error occurred during new instance launch"
          });
        }
      })
      .finally(() => {});
  };

  useEffect(() => {
    getBots({ limit, page });
  }, []);

  const renderRow = (bot, idx) => (
    <tr key={idx}>
      <td>{bot.platform}</td>
      <td>{bot.name}</td>
      <td>{bot.description}</td>
      <td>
        {bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => (
              <Tag key={idx} pill type={"info"}>
                {tag["name"]}
              </Tag>
            ))
          : "-"}
      </td>
      <td>
        <Launch
          type={"primary"}
          onClick={() => {
            setClickedBot(bot);
            modal.current.open();
          }}
        >
          Launch
        </Launch>
      </td>
    </tr>
  );

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getBots({ page, limit, sort: field, order: value, search });
  };

  const OrderTh = props => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ""
      }
      onClick={onOrderChange}
    />
  );

  const searchBots = value => {
    setSearch(value);
    getBots({
      page,
      limit,
      sort: order.field,
      order: order.value,
      search: value
    });
  };

  return (
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {
                setLimit(value);
                getBots({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <SearchFilter
              onChange={value => {
                searchBots(value);
              }}
            />
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <OrderTh field={"platform"}>Bot Platform</OrderTh>
                <OrderTh field={"name"}>Bot Name</OrderTh>
                <OrderTh field={"description"}>Description</OrderTh>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>{bots.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getBots({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search
              });
            }}
          />
        </CardBody>
      </Container>

      <Modal
        ref={modal}
        title={"Launch selected bot?"}
        onClose={() => setClickedBot(null)}
        contentStyles={css`
          overflow-x: visible;
          overflow-y: hidden;
        `}
      >
        <LaunchEditor
          onSubmit={launchBot}
          onClose={() => modal.current.close()}
          bot={clickedBot}
        />
      </Modal>
    </>
  );
};

Bots.propTypes = {
  launchInstance: PropTypes.func.isRequired,
  setLimit: PropTypes.func.isRequired,
  getBots: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  bots: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  total: state.bot.total,
  limit: state.bot.limit
});

const mapDispatchToProps = dispatch => ({
  getBots: query => dispatch(getBots(query)),
  notify: payload => dispatch(addNotification(payload)),
  launchInstance: (id, params) => dispatch(launchInstance(id, params)),
  setLimit: limit => dispatch(setBotLimit(limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(Bots);
