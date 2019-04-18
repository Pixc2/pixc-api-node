const PixcApiNode = require('../pixc-api-node');

describe('Constructor', () => {
  test('create instance', () => {
    const pixcApiNode = new PixcApiNode();
    expect(pixcApiNode).toBeInstanceOf(PixcApiNode);
  });

  test('set base URL from env', () => {
    process.env.PIXC_API_NODE_BASE_URL = 'http://localhost';
    const pixcApiNode = new PixcApiNode();
    expect(pixcApiNode.baseUrl).toBe('http://localhost');
  });

  test('set base URL from constant', () => {
    delete process.env.PIXC_API_NODE_BASE_URL;
    const pixcApiNode = new PixcApiNode();
    expect(pixcApiNode.baseUrl).toBe('https://dashboard.pixc.com/v1/api');
  });

  test('set token from env', () => {
    process.env.PIXC_API_NODE_TOKEN = 'test';
    const pixcApiNode = new PixcApiNode({
      token: 'other',
    });
    expect(pixcApiNode.token).toBe('test');
  });

  test('set token from options', () => {
    delete process.env.PIXC_API_NODE_TOKEN;
    const pixcApiNode = new PixcApiNode({
      token: 'test',
    });
    expect(pixcApiNode.token).toBe('test');
  });

  test('set test from env', () => {
    process.env.PIXC_API_NODE_TEST = true;
    const pixcApiNode = new PixcApiNode({
      test: false,
    });
    expect(pixcApiNode.test).toBe(true);
  });

  test('set test from options', () => {
    delete process.env.PIXC_API_NODE_TEST;
    const pixcApiNode = new PixcApiNode({
      test: true,
    });
    expect(pixcApiNode.test).toBe(true);
  });

  test('save promise of request lib', () => {
    const pixcApiNode = new PixcApiNode();
    expect(pixcApiNode.request).toBeInstanceOf(Function);
  });
});

describe('Method: setToken', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
  });

  test('set token', () => {
    pixcApiNode.setToken('test');
    expect(pixcApiNode.token).toBe('test');
  });
});

describe('Method: setTest', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
  });

  test('set test', () => {
    pixcApiNode.setTest(true);
    expect(pixcApiNode.test).toBe(true);
  });
});

describe('Method: get', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
    pixcApiNode.execute = jest.fn();
  });

  test('call execute', () => {
    pixcApiNode.get('path', { foo: 'fighters' });
    expect(pixcApiNode.execute).toBeCalledWith({
      url: 'https://dashboard.pixc.com/v1/api/path',
      method: 'get',
      qs: { foo: 'fighters' },
    });
  });

  test('call execute (no params)', () => {
    pixcApiNode.get('path');
    expect(pixcApiNode.execute).toBeCalledWith({
      url: 'https://dashboard.pixc.com/v1/api/path',
      method: 'get',
      qs: {},
    });
  });
});

describe('Method: post', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
    pixcApiNode.execute = jest.fn();
  });

  test('call execute', () => {
    pixcApiNode.post('path', { foo: 'fighters' });
    expect(pixcApiNode.execute).toBeCalledWith({
      url: 'https://dashboard.pixc.com/v1/api/path',
      method: 'post',
      json: { foo: 'fighters' },
    });
  });
});

describe('Method: put', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
    pixcApiNode.execute = jest.fn();
  });

  test('call execute', () => {
    pixcApiNode.put('path', { foo: 'fighters' });
    expect(pixcApiNode.execute).toBeCalledWith({
      url: 'https://dashboard.pixc.com/v1/api/path',
      method: 'put',
      json: { foo: 'fighters' },
    });
  });
});

describe('Method: remove', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode();
    pixcApiNode.execute = jest.fn();
  });

  test('call execute', () => {
    pixcApiNode.remove('path');
    expect(pixcApiNode.execute).toBeCalledWith({
      url: 'https://dashboard.pixc.com/v1/api/path',
      method: 'delete',
    });
  });
});

describe('Method: execute', () => {
  let pixcApiNode;

  beforeEach(() => {
    pixcApiNode = new PixcApiNode({
      token: 'token',
    });
  });

  test('make successfull request', async () => {
    let resolve;
    pixcApiNode.request = jest.fn(() => new Promise((theResolve) => { resolve = theResolve; }));
    setTimeout(() => resolve({ body: { success: true, data: 'test' } }));
    const result = await pixcApiNode.execute({});
    expect(result).toEqual('test');
  });

  test('make successfull request (with json and custom auth)', async () => {
    let resolve;
    pixcApiNode.request = jest.fn(() => new Promise((theResolve) => { resolve = theResolve; }));
    setTimeout(() => resolve({ body: { success: true, data: 'test' } }));
    pixcApiNode.token = 'Bearer test';
    pixcApiNode.test = true;
    const result = await pixcApiNode.execute({ json: true });
    expect(pixcApiNode.request).toBeCalledWith({
      json: true,
      headers: { Authorization: 'Bearer test', test: true },
    });
    expect(result).toEqual('test');
  });

  test('make failed request', async () => {
    let reject;
    pixcApiNode.request = jest.fn(() => new Promise((_, theReject) => { reject = theReject; }));
    setTimeout(() => reject('test'));
    try {
      await pixcApiNode.execute({});
    } catch (err) {
      expect(err).toEqual('test');
    }
  });
});

describe('Method: processResponse', () => {
  test('process success case', () => {
    const success = jest.fn();
    PixcApiNode.processResponse(
      { body: { success: true, data: 'test' } },
      success,
    );
    expect(success).toBeCalledWith('test');
  });

  test('process failure case', () => {
    const failure = jest.fn();
    PixcApiNode.processResponse(
      { body: 'test' },
      null,
      failure,
    );
    expect(failure).toBeCalledWith('test');
  });
});
