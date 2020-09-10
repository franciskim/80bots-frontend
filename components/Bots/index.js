import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Icon from "/components/default/icons";
import Router from "next/router";
import LaunchEditor from "./components/LaunchEditor";
import Modal from "/components/default/Modal";
import { css } from "@emotion/core";
import { withTheme } from "emotion-theming";
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
import { connect } from "react-redux";
import {
  getBots,
  updateStatusBot,
  launchInstance,
  getBotSettings,
  updateBotSettings,
  deleteBot,
  syncLocalBots,
  setBotLimit
} from "/store/bot/actions";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from "/config";
import { addListener } from "/store/socket/actions";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
`;

const Deploy = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
  margin-right: 5px;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  padding: 2px;
  margin-right: 5px;
  width: 27px;
  height: 27px;
  &:last-child {
    margin-right: 0;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`;

const StatusButton = styled(Deploy)`
  text-transform: capitalize;
  margin-right: 0;
`;

const AddButtonWrap = styled.div`
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

const BotType = styled(Badge)`
  font-size: 14px;
  text-transform: uppercase;
`;

const Tag = styled(Badge)`
  margin-right: 0.5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Bots = ({
  getBots,
  updateStatusBot,
  launchInstance,
  bots,
  total,
  notify,
  theme,
  deleteBot,
  syncLocalBots,
  syncLoading,
  addListener,
  user,
  limit,
  setLimit,
}) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [search, setSearch] = useState(null);

  const modal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    getBots({ page, limit });
    addListener(`bots.${user.id}`, "BotsSyncSucceeded", () => {
      notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "Sync completed" });
        getBots({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search
      });
      setPage(1);
    });
    return setPage(1);
  }, []);

  const launchBot = params => {
    modal.current.close();

    launchInstance(clickedBot.id, params)
      .then(() => {
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: "New bot instance is deploying"
        });
        setTimeout(() => {
          Router.push("/bots/running");
        }, NOTIFICATION_TIMINGS.DURATION * 2 + NOTIFICATION_TIMINGS.INFO_HIDE_DELAY);
      })
      .catch(action => {
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message:
            action.error?.response?.data?.message ||
            "Error occurred during new instance launch",
          delay: 1500
        });
      });
  };

  const changeBotStatus = bot => {
    const statusName = bot.status === "active" ? "deactivated" : "activated";
    const status = bot.status === "active" ? "inactive" : "active";

    updateStatusBot(bot.id, { status })
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Bot was successfully ${statusName}!`
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Status update failed"
        })
      );
  };

  const getDeleteBot = () => {
    setClickedBot(null);
    deleteBot(clickedBot.id)
      .then(() => {
        notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "Bot removed!" });
        getBots({
          page,
          limit,
          sort: order.field,
          order: order.value,
          search
        });
        deleteModal.current.close();
      })
      .catch(() =>
        notify({ type: NOTIFICATION_TYPES.ERROR, message: "Bot delete failed" })
      );
  };

  const sync = () => {
    syncLocalBots()
      .then(() =>
        notify({ type: NOTIFICATION_TYPES.INFO, message: "Sync started" })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Sync cannot be started"
        })
      );
  };

  const renderRow = (bot, idx) => (
    <tr key={idx}>
      <td>{bot.name}</td>
      <td>
        <BotType type={bot.type === "public" ? "info" : "danger"} pill>
          {bot.type}
        </BotType>
      </td>
      <td>{bot.description}</td>
      <td>
        {bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => (
              <Tag key={idx} pill type={"info"}>
                {tag.name}
              </Tag>
            ))
          : "-"}
      </td>
      <td>
        <StatusButton
          type={bot.status === "active" ? "success" : "danger"}
          onClick={() => changeBotStatus(bot)}
        >
          {bot.status}
        </StatusButton>
      </td>
      <td>
        <Buttons>
          <Deploy
            type={"primary"}
            onClick={() => {
              setClickedBot(bot);
              modal.current.open();
            }}
          >
            Deploy
          </Deploy>
          <IconButton
            title={"Edit Bot"}
            type={"primary"}
            onClick={() => {
              Router.push(`/bot/${bot.id}`);
            }}
          >
            <Icon name={"edit"} color={theme.colors.white} />
          </IconButton>
          <IconButton
            title={"Delete Bot"}
            type={"danger"}
            onClick={() => {
              setClickedBot(bot);
              deleteModal.current.open();
            }}
          >
            <Icon name={"garbage"} color={theme.colors.white} />
          </IconButton>
        </Buttons>
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
      <AddButtonWrap style={{ marginBottom: "17px" }}>
        <Button type={"success"} onClick={() => Router.push("/bots/add")}>
          Add Bot
        </Button>
        <Button
          type={"primary"}
          onClick={sync}
          loading={`${syncLoading}`}
          loaderWidth={"30px"}
          loaderHeight={"20px"}
        >
          Sync Bots From Repo
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              defaultValue={limit}
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
                <OrderTh field={"name"}>Bot Name</OrderTh>
                <OrderTh field={"type"}>Bot Type</OrderTh>
                <OrderTh field={"description"}>Description</OrderTh>
                <th>Bot Tags</th>
                <OrderTh field={"status"}>Status</OrderTh>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>{bots.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            initialPage={page}
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
        title={"Deploy selected bot?"}
        onClose={() => setClickedBot(null)}
        contentStyles={css`
          overflow-x: visible;
          overflow-y: hidden;
        `}
        disableSideClosing
      >
        <LaunchEditor
          onSubmit={launchBot}
          onClose={() => modal.current.close()}
          bot={clickedBot}
        />
      </Modal>
      <Modal
        ref={deleteModal}
        title={"Delete Bot"}
        contentStyles={css`
          min-width: 300px;
        `}
      >
        <Buttons>
          <Button
            type={"danger"}
            onClick={() => {
              setClickedBot(null);
              deleteModal.current.close();
            }}
          >
            Cancel
          </Button>
          <Button type={"primary"} onClick={getDeleteBot}>
            Yes
          </Button>
        </Buttons>
      </Modal>
    </>
  );
};

Bots.propTypes = {
  bots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  syncLoading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  getBots: PropTypes.func.isRequired,
  updateStatusBot: PropTypes.func.isRequired,
  launchInstance: PropTypes.func.isRequired,
  deleteBot: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  setLimit: PropTypes.func.isRequired,
  syncLocalBots: PropTypes.func.isRequired,
  addListener: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  total: state.bot.total,
  syncLoading: state.bot.syncLoading,
  user: state.auth.user,
  limit: state.bot.limit
});

const mapDispatchToProps = dispatch => ({
  getBots: query => dispatch(getBots(query)),
  notify: payload => dispatch(addNotification(payload)),
  launchInstance: (id, params) =>
    dispatch(launchInstance(id, params)),
  updateStatusBot: (id, data) => dispatch(updateStatusBot(id, data)),
  deleteBot: id => dispatch(deleteBot(id)),
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
  syncLocalBots: () => dispatch(syncLocalBots()),
  addListener: (room, eventName, handler) =>
    dispatch(addListener(room, eventName, handler)),
  setLimit: limit => dispatch(setBotLimit(limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Bots));
