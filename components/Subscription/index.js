import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '/components/default/Button';
import StripeCheckout from '/components/default/StripeCheckout';
import { connect } from 'react-redux';
import { withTheme } from 'emotion-theming';
import { Card, CardBody, CardFooter, CardHeader } from '../default/Card';
import { getSubscriptions, subscribe } from '/store/subscription/actions';
import { addNotification } from '/store/notification/actions';
import { NOTIFICATION_TYPES } from '/config';

const Container = styled(Card)`  
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Plans = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const PlanCard = styled(Card)`
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 100%;
  flex-basis: 33%;
  margin-bottom: 20px;
`;

const PlanTitle = styled.h5`
  font-size: 1.5rem;
  text-transform: uppercase;
  margin: .25rem 0 .75rem 0;
`;

const PlanCost = styled.h5`
  font-size: 3.15rem;
  color: ${ props => props.theme.colors.blue };
  font-weight: 700;
  margin: 1.5rem 0 .5rem 0;
`;

const PlanCredits = styled.h6`
  color: ${ props => props.theme.colors.darkGrey };
  font-size: 0.9rem;
  margin: 1rem 0 .5rem 0;
`;

const PlanButton = styled(Button)`
  text-transform: uppercase;
  margin: .25rem 0 .5rem 0;
  font-size: 14px;
`;

const SubmitContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-bottom: 20px;
`;

const Submit = styled(Button)`
  font-size: 20px;
  text-transform: uppercase;
`;

const Title = styled.h5`
  margin: 0;
  text-align: start;
`;

const Subscription = ({ getSubscriptions, addNotification, subscribe, plans, activePlan, loading }) => {
  const [selectedPlan, setPlan] = useState(null);

  useEffect(() => {
    getSubscriptions();
  }, []);

  useEffect(() => {
    setPlan(activePlan);
  }, [activePlan]);

  const choosePlan = (tokenObj) => {
    subscribe(selectedPlan.id, tokenObj.id)
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `You have successfully subscribed to ${selectedPlan.name} plan`
        });
      })
      .catch(() => {
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Can't subscribe to ${selectedPlan.name} plan`
        });
      });
  };

  const renderPlan = (plan, idx) => <div className={'col-4'} key={idx}>
    <PlanCard>
      <CardBody>
        <PlanTitle>{ plan.name }</PlanTitle>
        <PlanCost>${ plan.cost }</PlanCost>
        <PlanCredits>{ plan.credits }&nbsp;Credits</PlanCredits>
      </CardBody>
      <CardFooter>
        <PlanButton type={selectedPlan && plan.id === selectedPlan.id ? 'success' : 'primary'} onClick={() => setPlan(plan)}
          rounded
        >
          Select
        </PlanButton>
      </CardFooter>
    </PlanCard>
  </div>;

  return(
    <Container>
      <CardHeader>
        <Title>Subscription Plans</Title>
      </CardHeader>
      <CardBody>
        <Plans>
          { plans.map(renderPlan) }
        </Plans>
      </CardBody>
      <SubmitContainer>
        <StripeCheckout
          amount={selectedPlan && selectedPlan.cost * 100 || 0} plan={selectedPlan && selectedPlan.name || ''}
          description={selectedPlan && ( selectedPlan.name + ', ' + selectedPlan.credits + ' credits') || ''}
          onSuccess={choosePlan}
        >
          <Submit type={'primary'} disabled={!selectedPlan || selectedPlan.id === activePlan.id}
            loading={loading.toString()} loaderWidth={73} loaderHeight={32}
          >
            Submit
          </Submit>
        </StripeCheckout>
      </SubmitContainer>
    </Container>
  );
};

Subscription.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  plans: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  activePlan: PropTypes.object
};

const mapStateToProps = state => ({
  plans: state.subscription.plans,
  activePlan: state.subscription.activePlan,
  loading: state.subscription.subscribeLoading
});

const mapDispatchToProps = dispatch => ({
  getSubscriptions: () => dispatch(getSubscriptions()),
  addNotification: payload => dispatch(addNotification(payload)),
  subscribe: (planId, tokenId) => dispatch(subscribe(planId, tokenId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Subscription));
