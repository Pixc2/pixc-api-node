const { promisify } = require('util');
const request = require('request');

class PixcApiNode {
  constructor(options = {}) {
    this.baseUrl = process.env.PIXC_API_NODE_BASE_URL || 'https://dashboard.pixc.com/v1/api';
    this.setToken(
      process.env.PIXC_API_NODE_TOKEN
      || options.token,
    );
    this.setTest((
      typeof process.env.PIXC_API_NODE_TEST === 'undefined'
        ? false
        : process.env.PIXC_API_NODE_TEST
    ) || options.test);
    this.request = promisify(request);
  }

  setToken(token) {
    this.token = token;
  }

  setTest(test) {
    this.test = test;
  }

  get(path, params = {}) {
    return this.execute({
      url: `${this.baseUrl}/${path}`,
      method: 'get',
      qs: params,
    });
  }

  post(path, data) {
    return this.execute({
      url: `${this.baseUrl}/${path}`,
      method: 'post',
      json: data,
    });
  }

  put(path, data) {
    return this.execute({
      url: `${this.baseUrl}/${path}`,
      method: 'put',
      json: data,
    });
  }

  remove(path) {
    return this.execute({
      url: `${this.baseUrl}/${path}`,
      method: 'delete',
    });
  }

  execute(options) {
    return new Promise((resolve, reject) => {
      this.request({
        ...options,
        json: typeof options.json === 'undefined' ? true : options.json,
        headers: {
          Authorization: `${this.token.match(/^bearer /i) ? '' : 'Bearer '}${this.token}`,
          ...this.test ? { test: true } : {},
        },
      }).then(
        result => PixcApiNode.processResponse(result, resolve, reject),
        err => reject(err),
      );
    });
  }

  static processResponse(result, resolve, reject) {
    if (result.body.success) {
      resolve(result.body.data);
    } else {
      reject(result.body);
    }
  }
}

module.exports = PixcApiNode;
