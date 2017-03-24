import { GghisPage } from './app.po';

describe('gghis App', () => {
  let page: GghisPage;

  beforeEach(() => {
    page = new GghisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
