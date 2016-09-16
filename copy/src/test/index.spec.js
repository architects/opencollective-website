import copy, { DEFAULT_LOCALE } from '..'

describe('Interntionalization and Content / Copy', () => {
  it('sets my current locale to the default value of en', () => {
    copy.currentLocale.should
      .equal(DEFAULT_LOCALE)
      .and.equal('en')
  })

  it('Lets me access strings appropriate for my locale', () => {
    copy.t('paypalEmail').should.equal('Paypal Email')
  })

  it('Provides me with inflection utilities', () => {
    const { pluralize, singularize } = copy

    pluralize('horse').should.equal('horses')
    pluralize('dice').should.equal('die')
    singularize('things').should.equal('thing')
  })

  it('Provides currency formatting helpers', () => {
    copy.currency('100', 'USD').should.equal('$100.00')
  })

  it('Provides locale specific calendar labels', () => {
    copy.moment.daysOfWeek()
      .should.be.an('array')
      .that.includes('Monday','Tuesday')
  })
})
