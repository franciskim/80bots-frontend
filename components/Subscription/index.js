import React, { Fragment, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, CardBody, CardFooter } from '../default/Card';
import Button from '../default/Button';
import { getSubscriptions } from 'store/subscription/actions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';

const PlanCard = styled(Card)`
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 100%;
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

const Subscription = ({ getSubscriptions, plans }) => {
  const [selectedPlan, setPlan] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    getSubscriptions();
  }, []);

  const choosePlan = e => {
    e.preventDefault();
  };

  const renderPlan = (plan, idx) => <div className={'col-4'} key={idx}>
    <PlanCard>
      <CardBody>
        <PlanTitle>{ plan.name }</PlanTitle>
        <PlanCost>${ plan.cost }</PlanCost>
        <PlanCredits>{ plan.credits }&nbsp;Credits</PlanCredits>
      </CardBody>
      <CardFooter>
        <PlanButton type={plan.name === selectedPlan ? 'success' : 'primary'} onClick={() => setPlan(plan.name)}
          rounded
        >
          Select
        </PlanButton>
      </CardFooter>
    </PlanCard>
  </div>;

  return(
    <Fragment>
      <div className="card border-bottom-0 rounded-0 rounded-top">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">Subscription Plans</h5>
        </div>
        <div className="card-body d-flex justify-content-center">
          <div className="row w-75 p-3">
            { plans.map(renderPlan) }
          </div>
        </div>
      </div>
      <div className="card border-top-0 rounded-0 rounded-bottom">
        <div className="card-body d-flex justify-content-center">
          <div className="row w-100 p-3">
            <form method="post" className="w-100" id="payment-form">
              <div className="offset-3 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Name*</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} name="customer_name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="offset-3 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Credit Card Number*</label>
                  <input type="text" value={number} onChange={e => setNumber(e.target.value)} name="number"
                    maxLength={16} className="form-control"
                  />
                </div>
              </div>
              <div className="offset-3 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Expiry Month*</label>
                  <input type="text" value={month} onChange={e => setMonth(e.target.value)} name="month"
                    maxLength={2} className="form-control"
                  />
                </div>
              </div>
              <div className="offset-3 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Expiry Year*</label>
                  <input type="text" value={year} onChange={e => setYear(e.target.value)} name="year"
                    maxLength={2} className="form-control"
                  />
                </div>
              </div>
              <div className="offset-3 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>CVV*</label>
                  <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} name="cvv"
                    maxLength={3} className="form-control"
                  />
                </div>
              </div>
              <div className="offset-3 col-md-6 col-sm-12">
                <input type="submit" className="btn btn-primary" onClick={choosePlan}/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Subscription.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  plans: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscription.plans
});

const mapDispatchToProps = dispatch => ({
  getSubscriptions: () => dispatch(getSubscriptions())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Subscription));