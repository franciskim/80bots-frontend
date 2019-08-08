import React from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { connect } from 'react-redux';
import Icon from '../default/icons';
import PropTypes from 'prop-types';
import { NOTIFICATION_TYPES, notificationTimings } from 'config';
import { removeLastNotification, hideNotification } from 'store/notification/actions';
import { withTheme } from 'emotion-theming';

const { SUCCESS, ERROR } = NOTIFICATION_TYPES;

const P = styled.p`
  font-size: 10px;
  color: ${props => props.theme.colors.white};
`;

const A = styled.a`
  display: flex;
  opacity: 0.35;
  g {
    fill: ${props => props.theme.colors.paleGrey};
  }
  &:hover {
    cursor: pointer;
    opacity: 1;
    g {
      fill: ${props => props.theme.colors.white};
    }
  }
`;

const InfoClose = styled(A)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 3;
`;

const InfoNotificationDiv = styled.div`
  position: fixed;
  overflow: hidden;
  display: flex;
  min-width: 250px;
  min-height: 100px;
  box-shadow: 0 0 15px ${props => props.theme.colors.grey};
  border-radius: 10px;
  top: 2rem;
  z-index: 5;
  ${props => props.css};
`;

InfoNotificationDiv.propTypes = {
  css: PropTypes.object.isRequired
};

const InfoNotificationContent = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const NotificationMessage = styled(P)`
  font-size: 14px;
  margin: 0;
`;

const Notification = props => {
  const { theme: { colors: { mediumGreen, clearGreen, darkishPink, pink, clearBlue, clearBlueTwo } },
    notification, hideNotification, removeNotification } = props;

  const getStyle = (hide, status) => {
    const animation = keyframes`
      ${hide ? 'from' : 'to'} {
        opacity: 1;
        right: 2rem;
      }
      ${!hide ? 'from' : 'to'} {
        opacity: 0;
        right: calc(-2rem - 250px); // use notification div styles to calc
      }
    `;
    return css`
      background: ${ status === SUCCESS ? `linear-gradient(to left, ${mediumGreen}, ${clearGreen})`
    : status === ERROR ? `linear-gradient(to left, ${darkishPink}, ${pink})`
      : `linear-gradient(to left, ${clearBlue}, ${clearBlueTwo})`};
      right: ${hide ? 'calc(-2rem - 250px)' : '2rem'};
      animation: ${animation} ${notificationTimings.DURATION}ms ease;
    `;
  };

  const closeNotification = (timer) => {
    clearTimeout(timer);
    !notification.hide
      ? hideNotification()
      : setTimeout(removeNotification, notification.duration || notificationTimings.DURATION);
  };

  const renderInfoNotification = (notification) => {
    const timer = !notification.hide
      ? setTimeout(hideNotification, notification.hideDelay || notificationTimings.INFO_HIDE_DELAY)
      : setTimeout(removeNotification, notificationTimings.DURATION);
    return (
      <InfoNotificationDiv css={getStyle(notification.hide, notification.type)}>
        <InfoClose onClick={() => closeNotification(timer)}><Icon name={'cross'}/></InfoClose>
        <InfoNotificationContent>
          <NotificationMessage>{notification.message}</NotificationMessage>
        </InfoNotificationContent>
      </InfoNotificationDiv>
    );
  };

  return notification && notification.type !== NOTIFICATION_TYPES.HELP
    ? renderInfoNotification(notification)
    : null;
};

Notification.propTypes = {
  notification: PropTypes.any,
  hideNotification: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object
  }).isRequired
};

const mapStateToProps = state => ({
  notification: state.notification.current
});

const mapDispatchToProps = dispatch => ({
  removeNotification: () => dispatch(removeLastNotification()),
  hideNotification: () => dispatch(hideNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Notification));