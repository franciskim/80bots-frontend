import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {NOTIFICATION_TYPES} from '../../config';
import {CardBody, CardFooter, CardHeader} from '../default/Card';
import StripeCheckout from '../default/StripeCheckout';
import {getCreditUsageHistory, history} from '../../store/history/actions';
import {addNotification} from '../../store/notification/actions';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';


const Subscription = ({ getCreditUsageHistory, history }) => {

  useEffect(() => {
    getCreditUsageHistory();
  }, []);

  const renderPlan = (plan, idx) => <div className={'col-4'} key={idx}>
    <PlanCard>
      <CardBody>
        <PlanTitle>{ plan.name }</PlanTitle>
        <PlanCost>${ plan.cost }</PlanCost>
        <PlanCredits>{ plan.credits }&nbsp;Credits</PlanCredits>
      </CardBody>
      <CardFooter>
        <PlanButton type={plan.id === selectedPlan.id ? 'success' : 'primary'} onClick={() => setPlan(plan)}
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
  getCreditUsageHistory: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  history: state.history
});

const mapDispatchToProps = dispatch => ({
  getCreditUsageHistory: () => dispatch(getCreditUsageHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Subscription));