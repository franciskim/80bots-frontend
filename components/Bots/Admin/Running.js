import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import Select from "react-select";
import Link from "next/link";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { Card, CardBody } from "/components/default/Card";
import {
  Table,
  Thead,
  Th,
  Filters,
  LimitFilter,
  ListFilter,
  SearchFilter
} from "/components/default/Table";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import {
  copyInstance,
  restoreBot,
  adminGetRunningBots,
  updateAdminRunningBot,
  downloadInstancePemFile,
  botInstanceUpdated,
  syncBotInstances
} from "/store/bot/actions";
import { addListener, removeAllListeners } from "/store/socket/actions";
import { Paginator, Loader, Button } from "/components/default";
import { download, minToTime } from "/lib/helpers";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
`;

const Td = styled.td`
  position: absolute;
  left: 20px;
  width: calc(100% - 40px);
`;

const NwTd = styled.td`
  white-space: nowrap;
`;

const Tr = styled.tr`
  position: relative;
  background-color: ${props =>
    props.disabled ? "rgba(221, 221, 221, .5)" : "none"};
`;

const Ip = styled.span`
  color: ${props => props.theme.colors.cyan};
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid ${props => props.theme.colors.cyan};
  }
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    &:last-child {
      margin-left: 20px;
    }
  }
`;

const A = styled.a`
  cursor: pointer;
  color: #ff7d7d !important;
  &:hover {
    text-decoration: underline !important;
  }
`;

const selectStyles = {
  container: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    minWidth: "150px"
  }),
  menuPortal: base => ({ ...base, zIndex: 5 }),
  control: (provided, state) => ({
    ...provided,
    background: "rgba(0,0,0,0.2)",
    // match with the menu
    borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
    // Overrides the different states of border
    borderColor: state.isFocused ? "black" : "rgba(0,0,0,0.2)",
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overrides the different states of border
      borderColor: "black"
    }
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#fff"
  })
};

const OPTIONS = [
  { value: "pending", label: "Pending", readOnly: true },
  { value: "running", label: "Running" },
  { value: "stopped", label: "Stopped" },
  { value: "terminated", label: "Terminated" }
];

const FILTERS_LIST_OPTIONS = [
  { value: "all", label: "All Instances" },
  { value: "my", label: "My Instances" }
];

const RunningBots = ({
  theme,
  notify,
  adminGetRunningBots,
  copyInstance,
  restoreBot,
  downloadInstancePemFile,
  updateAdminRunningBot,
  botInstances,
  total,
  user,
  addListener,
  removeAllListeners,
  botInstanceUpdated,
  syncBotInstances,
  syncLoading
}) => {
  const [list, setFilterList] = useState("all");
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    adminGetRunningBots({ page, limit, list });
    addListener(`running.${user.id}`, "InstanceLaunched", event => {
      if (event.instance) {
        const status =
          event.instance.status === "running"
            ? "launched"
            : event.instance.status;
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Bot ${event.instance.bot_name} successfully ${status}`
        });
        botInstanceUpdated(event.instance);
      }
    });
    addListener(`running.${user.id}`, "InstanceStatusUpdated", () => {
      adminGetRunningBots({
        page: 1,
        limit,
        list,
        sort: order.field,
        order: order.value
      });
    });
    addListener(`bots.${user.id}`, "BotsSyncSucceeded", () => {
      notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "Sync completed" });
      adminGetRunningBots({
        page,
        limit,
        list,
        sort: order.field,
        order: order.value
      });
    });
    return () => {
      removeAllListeners();
    };
  }, []);

  const choiceRestoreBot = instance => {
    restoreBot(instance.id)
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: "The instance was successfully queued for restoring"
        })
      )
      .catch(() =>
        notify({ type: NOTIFICATION_TYPES.ERROR, message: "Restore failed" })
      );
  };

  const choiceCopyInstance = instance => {
    copyInstance(instance.id)
      .then(() => {
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: "The instance was successfully queued for cloning"
        });
        adminGetRunningBots({ page, limit, list });
      })
      .catch(() =>
        notify({ type: NOTIFICATION_TYPES.ERROR, message: "Cloning failed" })
      );
  };

  const downloadEventHandler = instance => {
    downloadInstancePemFile(instance.id)
      .then(({ data }) => {
        download(data, `${instance.instance_id}.pem`, "application/x-pem-file");
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
            message: "Error occurred while downloading file"
          });
        }
      });
  };

  const changeBotInstanceStatus = (option, id) => {
    updateAdminRunningBot(id, { status: option.value })
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: `Enqueued status change: ${option.value}`
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Status update failed"
        })
      );
  };

  const syncWithAWS = () => {
    syncBotInstances()
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: "Sync sequence started"
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Can't start sync sequence"
        })
      );
  };

  const copyToClipboard = bot => {
    const text =
      process.env.NODE_ENV === "development"
        ? `chmod 400 ${bot.instance_id}.pem && ssh -i ${bot.instance_id}.pem ubuntu@${bot.ip}`
        : bot.ip;
    navigator.clipboard.writeText(text).then(() =>
      notify({
        type: NOTIFICATION_TYPES.INFO,
        message: "Copied to clipboard"
      })
    );
  };

  const Loading = (
    <Loader
      type={"bubbles"}
      width={40}
      height={40}
      color={theme.colors.primary}
    />
  );

  const renderRow = (botInstance, idx) => (
    <Tr
      key={idx}
      disabled={botInstance.status === "pending"}
      className={
        botInstance.status === "running"
          ? "running"
          : botInstance.status === "terminated"
          ? "terminated"
          : "not-running"
      }
    >
      <td>
        <Select
          options={OPTIONS}
          value={OPTIONS.find(item => item.value === botInstance.status)}
          onChange={option => changeBotInstanceStatus(option, botInstance.id)}
          styles={selectStyles}
          isOptionDisabled={option => option.readOnly}
          isDisabled={
            botInstance.status === "pending" ||
            botInstance.status === "terminated"
          }
          menuPortalTarget={document.body}
          menuPosition={"absolute"}
          menuPlacement={"bottom"}
        />
      </td>
      <td>
        <Link
          href={"/admin/bots/running/[id]"}
          as={`/admin/bots/running/${botInstance.id}`}
        >
          <A>&gt;&nbsp;View</A>
        </Link>
        {botInstance.status === "terminated" ? (
          <div
            title={"Restore Bot"}
            onClick={() => choiceRestoreBot(botInstance)}
          >
            <A>&gt;&nbsp;Restore</A>
          </div>
        ) : null}
        <div
          title={"Copy Instance"}
          onClick={() => choiceCopyInstance(botInstance)}
        >
          <A>&gt;&nbsp;Clone</A>
        </div>
        <div
          disabled={botInstance.status === "terminated"}
          title={"Download PEM"}
          type={"success"}
          onClick={() => downloadEventHandler(botInstance)}
        >
          <A>&gt;&nbsp;Key</A>
        </div>
      </td>
      <td>{botInstance.bot_name}</td>
      <td>{botInstance.launched_at}</td>
      <NwTd>{minToTime(botInstance.uptime)}</NwTd>
      <td>
        <Ip onClick={() => copyToClipboard(botInstance)}>{botInstance.ip}</Ip>
      </td>
      <td>{botInstance.name}</td>
      <td>{botInstance.instance_id}</td>
      <td>{botInstance.launched_by}</td>
      <td>{botInstance.region}</td>
      {botInstance.status === "pending" && <Td colSpan={"9"}>{Loading}</Td>}
    </Tr>
  );
  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    adminGetRunningBots({
      page,
      limit,
      list,
      sort: field,
      order: value,
      search
    });
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

  const searchRunningBots = value => {
    setSearch(value);
    adminGetRunningBots({
      page,
      limit,
      list,
      sort: order.field,
      order: order.value,
      search: value
    });
  };

  return (
    <>
      <AddButtonWrap>
        <Button
          type={"primary"}
          onClick={syncWithAWS}
          loading={`${syncLoading}`}
          loaderWidth={140}
        >
          Sync Bot Instances
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {
                setLimit(value);
                adminGetRunningBots({
                  page,
                  limit: value,
                  list,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <ListFilter
              options={FILTERS_LIST_OPTIONS}
              onChange={({ value }) => {
                setFilterList(value);
                adminGetRunningBots({
                  page,
                  limit,
                  list: value,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <SearchFilter
              onChange={value => {
                searchRunningBots(value);
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh field={"status"}>Status</OrderTh>
                <th>Actions</th>
                <OrderTh field={"bot_name"}>Bot</OrderTh>
                <OrderTh field={"launched_at"}>Deployed At</OrderTh>
                <OrderTh field={"uptime"}>Uptime</OrderTh>
                <OrderTh field={"ip"}>IP</OrderTh>
                <OrderTh field={"name"}>Name</OrderTh>
                <th>Instance ID</th>
                <OrderTh field={"launched_by"}>Deployed By</OrderTh>
                <OrderTh field={"region"}>Region</OrderTh>
              </tr>
            </Thead>
            <tbody>{botInstances.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              adminGetRunningBots({
                page,
                limit,
                list,
                sort: order.field,
                order: order.value,
                search
              });
            }}
          />
        </CardBody>
      </Container>
    </>
  );
};

RunningBots.propTypes = {
  notify: PropTypes.func.isRequired,
  copyInstance: PropTypes.func.isRequired,
  restoreBot: PropTypes.func.isRequired,
  adminGetRunningBots: PropTypes.func.isRequired,
  downloadInstancePemFile: PropTypes.func.isRequired,
  updateAdminRunningBot: PropTypes.func.isRequired,
  addListener: PropTypes.func.isRequired,
  removeAllListeners: PropTypes.func.isRequired,
  botInstanceUpdated: PropTypes.func.isRequired,
  syncBotInstances: PropTypes.func.isRequired,
  botInstances: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  syncLoading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  total: state.bot.total,
  user: state.auth.user,
  syncLoading: state.bot.syncLoading
});

const mapDispatchToProps = dispatch => ({
  notify: payload => dispatch(addNotification(payload)),
  copyInstance: id => dispatch(copyInstance(id)),
  restoreBot: id => dispatch(restoreBot(id)),
  adminGetRunningBots: query => dispatch(adminGetRunningBots(query)),
  downloadInstancePemFile: id => dispatch(downloadInstancePemFile(id)),
  updateAdminRunningBot: (id, data) =>
    dispatch(updateAdminRunningBot(id, data)),
  addListener: (room, eventName, handler) =>
    dispatch(addListener(room, eventName, handler)),
  removeAllListeners: () => dispatch(removeAllListeners()),
  botInstanceUpdated: botInstance => dispatch(botInstanceUpdated(botInstance)),
  syncBotInstances: () => dispatch(syncBotInstances())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(RunningBots));
