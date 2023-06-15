declare module "xendit-js-node" {
  export interface TokenData {
    // Define the properties of the tokenData object here
    amount: string;
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_cvn: string;
    is_multiple_use: boolean;
    should_authenticate: boolean;
  }

  export interface TokenResponse {
    // Define the properties of the tokenResponse object here
    card_expiration_month: string;
    card_expiration_year: string;
    card_info: CardInfo;
    id: string;
    masked_card_number: string;
    payer_authentication_url: string;
    status: string;
  }
  export class Card {
    constructor(xendit: Xendit);
    // Define the methods and properties of the Card class here
    createToken(
      tokenData: TokenData,
      responseHandler: (error: any, token: TokenResponse) => void
    ): void;
  }

  export interface XenditSettings {
    url: string;
    publishable_key?: string;
  }

  export class Xendit {
    static settings: XenditSettings;
    static card: Card;

    static setPublishableKey(publishableKey: string): void;
    static _useStagingURL(toggle: boolean): void;
    static _getXenditURL(): string;
    static _getPublishableKey(): string;
    static _getEnvironment(): "PRODUCTION" | "DEVELOPMENT";
  }

  export default Xendit;
}
