import React from 'react';
import { mount } from 'enzyme';
import App from '../App';
import { mockEvent } from './models';
import '../setupTests'

const waitForAsync = () => new Promise(resolve => setImmediate(resolve));

jest.mock('@the-orange-alliance/api', () => ({
  API: jest.fn().mockImplementation(() => ({
    getEvent: jest.fn().mockResolvedValue(require('./models').mockEvent),
    getEventRankings: jest.fn().mockResolvedValue([]),
    getEventMatches: jest.fn().mockResolvedValue([])
  }))
}));

describe('Pit Display', () => {
  test('renders event name', async () => {
    window.history.pushState({}, 'Title', '/' + mockEvent.eventKey);
    const wrapper = mount(<App/>);
    await waitForAsync(); // Wait for all the promises
    wrapper.update();
    expect(wrapper.find('.title').text()).toEqual(mockEvent.fullEventName);
  });

  test('renders no data', async () => {
    window.history.pushState({}, 'Title', '/' + mockEvent.eventKey);
    const wrapper = mount(<App/>);
    await waitForAsync(); // Wait for all the promises
    wrapper.update();
    expect(wrapper.find('.error-message h1').text()).toEqual('No data available yet');
  });
});
