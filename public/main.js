const regBtn = document.getElementById('register');
const sigBtn = document.getElementById('signIn');

const user = {
  name: 'dsa',
  email: 'ads@asddn.com',
  ssn: 'sasdsada',
};

const makeRegRequest = async () => {
  const res = await fetch('http://localhost:3000/signup/get-options', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: user }),
  });
  return res.json();
};
const makeAuthRequest = async () => {
  const res = await fetch('http://localhost:3000/signin/get-options', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ssn: user.ssn }),
  });
  return res.json();
};

const makevRegRequest = async (options, challenge) => {
  const res = await fetch('http://localhost:3000/signup/verify-options', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authOptions: options,
      user: user,
      challenge: challenge,
    }),
  });
  console.log('v', await res.json());
  return res.json();
};

const makevAuthRequest = async (options, challenge) => {
  const res = await fetch('http://localhost:3000/signin/verify-options', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authOptions: options,
      user: user,
      challenge: challenge,
    }),
  });
  console.log('v', await res.json());
  return res.json();
};
// startRegistration();
const { startRegistration } = SimpleWebAuthnBrowser;
regBtn.addEventListener('click', async () => {
  const opttions = await makeRegRequest();
  console.log('step 2');
  console.log(opttions.data);
  let attResp;
  try {
    attResp = await startRegistration(opttions.data);
    console.log('step 3');
    console.log(attResp);
  } catch (error) {
    // Some basic error handling
    console.log(error);
  }
  console.log('step 4');
  const vRes = await makevRegRequest(attResp, opttions.data.challenge);
  console.log(vRes);
});

const { startAuthentication } = SimpleWebAuthnBrowser;
sigBtn.addEventListener('click', async () => {
  const opttions = await makeAuthRequest();
  console.log('step 2');
  console.log(opttions.data);
  let attResp;
  try {
    attResp = await startAuthentication(opttions.data);
    console.log('step 3');
    console.log(attResp);
  } catch (error) {
    // Some basic error handling
    console.log(error);
  }
  console.log('step 4');
  const vRes = await makevAuthRequest(attResp, opttions.data.challenge);
  console.log(vRes);
});
