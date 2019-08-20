import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { BILLING_DETAILS } from 'config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSubscription } from 'store/auth/actions';

const StripeCheckoutForm = props => {
  const { user, onClose, description, amount, panelLabel = 'Subscribe', children, onSuccess } = props;

  return (
    <StripeCheckout
      name={BILLING_DETAILS.company}
      description={description} // the pop-in header subtitle
      image={BILLING_DETAILS.image} // the pop-in header image (default none)
      ComponentClass="div"
      panelLabel={panelLabel}
      amount={amount}
      currency={BILLING_DETAILS.currency}
      stripeKey={process.env.STRIPE_PUBLIC_KEY}
      locale={BILLING_DETAILS.locale}
      email={user && user.email}
      shippingAddress={BILLING_DETAILS.shippingAddress}
      billingAddress={BILLING_DETAILS.billingDetails}
      zipCode={BILLING_DETAILS.zipCode}
      alipay={BILLING_DETAILS.alipay}
      bitcoin={BILLING_DETAILS.bitcoin}
      allowRememberMe={BILLING_DETAILS.allowRememberMe}
      token={onSuccess}
      opened={() => {}}
      closed={onClose}
      reconfigureOnUpdate={false}
      triggerEvent={'onClick'}
    >
      {children}
    </StripeCheckout>
  );
};

StripeCheckoutForm.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  panelLabel: PropTypes.string,
  description: PropTypes.string.isRequired,
  plan: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  createSubscription: (userId, plan, token) => dispatch(createSubscription(userId, plan, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(StripeCheckoutForm);
