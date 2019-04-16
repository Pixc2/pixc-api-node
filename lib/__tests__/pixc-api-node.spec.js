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
    pixcApiNode.request = jest.fn(() => new Promise(resolve => setTimeout(() => resolve({ body: { data: 'test' } }))));
    const result = await pixcApiNode.execute({});
    expect(result).toEqual('test');
  });
});
