import {Helper} from "../Helper";

export const CurrencySymbol = Object.freeze({
    'USD': '$',
    'GBP': '£',
    'EUR': '€'
});

export const BillingCycle = {
    'MONTHLY' : 1,
    'ANNUAL'  : 12,
    'LIFETIME': 0
};

export const DefaultCurrency = 'usd';

export class Pricing {

    //region Properties

    plan_id = null;

    licenses = null;

    monthly_price = null;

    annual_price = null;

    lifetime_price = null;

    currency = null;

    is_hidden = null;

    //endregion Properties

    constructor(object = null) {
        if (null == object) {
            return;
        }

        for (const p in object) {
            if (object.hasOwnProperty(p)) {
                this[p] = object[p];
            }
        }
    }

    static getBillingCyclePeriod(billingCycle) {
        if ( ! Helper.isNumeric(billingCycle)) {
            return billingCycle;
        }

        switch (billingCycle) {
            case BillingCycle.ANNUAL:
                return 'annual';
            case BillingCycle.LIFETIME:
                return 'lifetime';
            case BillingCycle.MONTHLY:
            default:
                return 'monthly';
        }
    }

    getAmount(billingCycle, format) {
        let amount = .0;

        switch (billingCycle)
        {
            case BillingCycle.MONTHLY:
                amount = this.monthly_price;
                break;
            case BillingCycle.ANNUAL:
                amount = this.annual_price;
                break;
            case BillingCycle.LIFETIME:
                amount = this.lifetime_price;
                break;
        }

        amount = parseFloat(amount);

        if (format) {
            amount = Helper.formatNumber(amount);
        }

        return amount;
    }

    getMonthlyAmount(billingCycle, format = false)
    {
        let amount = .0;

        switch (billingCycle) {
            case BillingCycle.MONTHLY:
                amount = this.hasMonthlyPrice() ?
                    this.monthly_price :
                    this.annual_price / 12;
                break;
            case BillingCycle.ANNUAL:
                amount = this.hasAnnualPrice() ?
                    this.annual_price / 12 :
                    this.monthly_price;
                break;
        }

        if (format) {
            amount = Helper.formatNumber(amount);
        }

        return parseFloat(amount);
    }

    hasAnnualPrice() {
        return (this.annual_price && Helper.isNumeric(this.annual_price) && this.annual_price > 0);
    }

    hasLifetimePrice() {
        return (this.lifetime_price && Helper.isNumeric(this.lifetime_price) && this.lifetime_price > 0);
    }

    hasMonthlyPrice() {
        return (this.monthly_price && Helper.isNumeric(this.monthly_price) && this.monthly_price > 0);
    }

    isFree() {
        return (
            ! this.hasMonthlyPrice() &&
            ! this.hasAnnualPrice() &&
            ! this.hasLifetimePrice()
        );
    }

    isSingleSite() {
        return (1 == this.licenses);
    }

    isUnlimited() {
        return (null == this.licenses);
    }

    sitesLabel() {
        let sites = '';

        if (this.isSingleSite())
            sites = 'Single';
        else if (this.isUnlimited())
            sites = 'Unlimited';
        else
            sites = this.licenses;

        return (sites + ' Site' + (this.isSingleSite() ? '' : 's'));
    }

    supportsBillingCycle(billingCycle) {
        return (null !== this[`${billingCycle}_price`]);
    }
}