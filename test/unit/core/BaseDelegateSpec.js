describe('BaseDelegate', function () {

  beforeEach(() => {
    this.logs = [];

    const mockConsole = {
      log: (...args) => this.logs.push(args)
    };

    injector()
      .addDependency('console', mockConsole, true)
      .inject((BaseDelegate) => {
        this.BaseDelegate = BaseDelegate;

        class SomeDelegate extends this.BaseDelegate {
          constructor() {
            super();
            this.supportsMethods([
              'log', 'debug'
            ]);
          }
        }

        this.SomeDelegate = SomeDelegate;
      });
  });

  it('base delegate test', () => {
    const delegate = new this.SomeDelegate();
    delegate.log('hi');
    delegate.debug('hello');

    expect(this.logs).to.deep.equal([
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'hi'],
      ['\u001b[36mSomeDelegate#debug: \u001b[39m', 'hello']
    ]);

    delegate.useRecorder();
    delegate.log('hi2');
    delegate.debug('hello2');
    expect(delegate.recorded.log).to.deep.equal([['hi2']]);
    expect(delegate.recorded.debug).to.deep.equal([['hello2']]);

    delegate.use({
      log: (delegateLog) => { this.delegateLog = delegateLog; },
      debug: (delegateDebug) => { this.delegateDebug = delegateDebug; }
    });

    delegate.log('foo');
    delegate.debug('bar');

    expect(this.delegateLog).to.equal('foo');
    expect(this.delegateDebug).to.equal('bar');
  });

  it('multiple delegates', () => {
    const delegate = new this.SomeDelegate();
    delegate.delegates = [
      delegate.consoleDelegate,
      delegate.consoleDelegate,
      delegate.consoleDelegate
    ];

    delegate.log('foo');

    expect(this.logs).to.deep.equal([
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo'],
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo'],
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo']
    ]);
  });
});
