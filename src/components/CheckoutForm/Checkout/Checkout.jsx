import React, {useState,useEffect} from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@mui/material'

import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { useHistory, Link } from 'react-router-dom';


const steps = ['Shipping address', 'Payment details'];


  



const Checkout = ({ cart, onCaptureCheckout, error, order}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false)
  const history = useHistory();

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
 








  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

          setCheckoutToken(token);
        } catch {
           history.push('/');
        }
      };

      generateToken();
    }
  }, [cart]);

  
  const test = (data) => {
    setShippingData(data);

    nextStep();
  };

  const timeout = () =>{
    setTimeout(() => {
      setIsFinished(true)
      
    }, 3000);
  }



  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  ) : isFinished ? (
    <>
    <div>
      <Typography variant="h5">Thank you for your purchase</Typography>
      <Divider className={classes.divider} />
    </div>
    <br />
    <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
  </>
    
     
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  ));


  if (error) {
    
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    
  }

  
  // const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} test={test}/> : <PaymentForm />
  const Form = () => (activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
    : <PaymentForm timeout={timeout} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation/>  :  checkoutToken && <Form />}
        </Paper>
      </main>
    
    </>
  )
}

export default Checkout