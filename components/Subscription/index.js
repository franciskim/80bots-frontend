import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, CardBody, CardFooter, CardHeader } from '../default/Card';
import Button from 'components/default/Button';
import { getSubscriptions, subscribe } from 'store/subscription/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from 'emotion-theming';
import StripeCheckout from 'components/default/StripeCheckout';

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

const Subscription = ({ getSubscriptions, subscribe,  plans }) => {
  const [selectedPlan, setPlan] = useState(null);

  useEffect(() => {
    getSubscriptions();
  }, []);

  const choosePlan = (tokenObj) => {
    subscribe(selectedPlan.id, tokenObj.id)
      .then(console.log)
      .catch(console.log);
  };

  const renderPlan = (plan, idx) => <div className={'col-4'} key={idx}>
    <PlanCard>
      <CardBody>
        <PlanTitle>{ plan.name }</PlanTitle>
        <PlanCost>${ plan.cost }</PlanCost>
        <PlanCredits>{ plan.credits }&nbsp;Credits</PlanCredits>
      </CardBody>
      <CardFooter>
        <PlanButton type={plan === selectedPlan ? 'success' : 'primary'} onClick={() => setPlan(plan)}
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
          <Submit type={'primary'} disabled={!selectedPlan}>Submit</Submit>
        </StripeCheckout>
      </SubmitContainer>
    </Container>
  );
};

Subscription.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  plans: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscription.plans
});

const mapDispatchToProps = dispatch => ({
  getSubscriptions: () => dispatch(getSubscriptions()),
  subscribe: (planId, tokenId) => dispatch(subscribe(planId, tokenId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Subscription));
