import React from 'react';
import { mount } from 'enzyme';
import App from './App';
import './setupTests'

const flushPromises = () => new Promise(setImmediate);

test('renders event name', async () => {
  Object.assign(location, { pathname: '/1920-ISR-SIS' });
  const wrapper = mount(<App/>);
  await flushPromises(); // Wait for all the promises
  wrapper.update();
  expect(wrapper.find('.title').text()).toEqual('Israel Tournament South');
});
