import React, { Fragment } from 'react';
import qs from 'qs';
import uuid from 'uuid/v1';
import { navigate } from 'hookrouter';
import EventEmitter from 'eventemitter2';
import { storage } from './storage';

const bitbucketClientId = process.env.REACT_APP_BITBUCKET_CLIENT_ID || 'nxpBCkZfHP2gsvRDaA';

export class Auth extends EventEmitter {
  get tokens() {
    return storage.get('tokens') || {};
  }

  get routes() {
    return {
      '/redirect': () => () => {
        this.handleRedirect();
        return <Fragment />;
      },
      '/callback': () => () => {
        this.handleCallback('GITHUB');
        return <Fragment />;
      }
    };
  }

  get authorized() {
    const { token } = this.authorize();

    return token();
  }

  get source () {
    const serviceSource = storage.get('serviceSource');
    return serviceSource && serviceSource['type'];
  }

  get user() {
    return {
      id: 123,
      username: 'example',
      email: 'somebody@example.com',
      firstName: 'Chuck',
      lastName: 'Norris'
    };
  }

  authorize () {
    return {
      token: () => this.source && this.tokens[this.source]
    };
  }

  upsertToken(type, token) {
    storage.set('tokens', Object.assign({}, this.tokens, { [type]: token }));

    this.emit('authorized', { token, type });
  }

  login (type) {
    storage.set('authType', type);

    if (type === 'GITHUB') {
      this.loginGithub();
    } else if (type === 'BITBUCKET') {
      this.loginBitbucket();
    }
  }

  loginGithub() {
    const authState = uuid();
    storage.set('authState', authState);

    const oauthUrl = process.env.REACT_APP_AUTHORIZE_URL + '?' + qs.stringify({
      state: authState,
      scope: 'user:email,read:user,repo'
    });

    console.debug('redirecting for login with state', authState, oauthUrl);

    window.location = oauthUrl;
  }

  loginBitbucket() {
    window.location.href = `https://bitbucket.org/site/oauth2/authorize?client_id=${bitbucketClientId}&response_type=token`;
  }

  handleRedirect () {
    const authState = storage.get('authState');
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.debug('handling auth redirect!', authState, window.location, params);

    if (params.state !== authState) {
      throw new Error('BAD AUTH STATE');
    }

    const oauthCallbackUrl = process.env.REACT_APP_CALLBACK_URL + '?' + qs.stringify({
      state: authState,
      code: params.code
    });

    console.debug('oauthCallbackUrl', oauthCallbackUrl);

    window.location = oauthCallbackUrl;
  }

  callbackBitbucket (callback) {
    const hashParams = qs.parse(window.location.hash.replace(/^#/, ''));

    if (hashParams['access_token']) {
      if (hashParams['access_token']) {
        this.setSessionToken(hashParams['access_token']);
        callback();
      } else {
        callback(new Error('MISSING BITBUCKET AUTH TOKEN'));
      }
    }
  }

  /**
   * TODO: Finish/fix the github auth callback
   * @param {function} callback
   */
  callbackGithub (callback) {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.debug('handling auth callback!', window.location, params);

    if (params.access_token) {
      this.setSessionToken(params.access_token);
      callback();
    } else {
      callback(new Error('MISSING GITHUB AUTH TOKEN'));
    }
  }

  handleCallback (type) {
    const authType = storage.get('authType');

    if (authType === type) {
      if (type === 'GITHUB') {
        return this.callbackGithub(err => err ? console.warn(err.message || err) : this.resume());
      } else if (type === 'BITBUCKET') {
        return this.callbackBitbucket(err => err ? console.warn(err.message || err) : this.resume());
      }
    } else {
      console.debug('Ignoring auth callback for type + authType', { type, authType });
    }
  }

  setSessionToken (token) {
    this.upsertToken(storage.get('authType'), token);
    storage.remove('authType');
  }

  resume () {
    console.debug('Resume nav after auth');

    if (storage.get('serviceName')) {
      navigate(`/services/${storage.get('serviceName')}`);
    } else {
      navigate('/');
    }
  }

  logout () {
    storage.clear();
  }

  isAuthenticated (type) {
    return !!this.tokens[type];
  }
}

export const auth = new Auth();
