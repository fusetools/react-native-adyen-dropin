export declare type Amount = {
    value: number;
    currencyCode: string;
};
export declare type CardConfiguration = {
    /** @todo NOT IMPLEMENTED */
    showsHolderNameField?: boolean;
    /** @todo NOT IMPLEMENTED */
    showsStorePaymentMethodField?: boolean;
    /** @todo NOT IMPLEMENTED */
    showsSecurityCodeField?: boolean;
};
export declare type ApplePayConfiguration = {
    /** Label to show instead of "Total" */
    label?: string;
    amount?: Amount;
    configuration?: {
        /** Name to be displayed on the form */
        merchantName?: string;
        /** Your Apple merchant identifier */
        merchantId: string;
    };
};
export declare type DropInConfiguration = {
    clientKey: string;
    environment: 'test' | 'live';
    countryCode: string;
    amount: Amount;
    /** @todo NOT IMPLEMENTED */
    card?: CardConfiguration;
    applePay?: ApplePayConfiguration;
    returnUrl?: string;
};
export declare type ModuleConfig = {
    /**
     * *Required* base URL ending with "/"
     * @example
     * "http://server.com/api/"
     */
    baseUrl: string;
    /**
     * Set to `true` to view more native logs
     */
    debug?: boolean;
    /** Optional custom headers to add to requests */
    headers?: {
        [key: string]: string;
    };
    /** Optional custom endpoints */
    endpoints?: {
        /**
         * Full payment URL to call, with or without "/" at beginning
         * @example
         * "/payments"
         * @example
         * "payments"
         */
        makePayment: string;
        /**
         * Full details URL to call, with or without "/" at beginning
         * @example
         * "/details"
         * @example
         * "details"
         */
        makeDetailsCall: string;
    };
    /** Optional custom callbacks */
    callbacks?: {
        onSubmit: (data: any) => void;
        onAdditionalDetails: (data: any) => void;
    };
};
export declare type PaymentMethod = {
    [key: string]: [value: string];
};
export declare type PaymentMethodsResponse = {
    paymentMethods?: [PaymentMethod];
};
export declare type PaymentResult = {
    additionalData?: any;
    message?: string;
    errorCode?: string;
    resultCode?: string;
    refusalReason?: string;
    refusalReasonCode?: string;
};
export declare type PaymentPromise = Promise<PaymentResult>;
export declare enum RESULT_CODE {
    cancelled = "cancelled",
    refused = "refused",
    error = "error",
    received = "received"
}
export declare const AdyenDropInModule: any;
export declare function isCancelledError(err: unknown): boolean;
/**
 * Check if a payment result is considered successful
 * @param result Resolved payment promise result
 * @returns Whether or not the result is considered successful
 */
export declare function isSuccessResult(result: PaymentResult): boolean;
declare const AdyenDropIn: {
    /**
     * ***Required*** Call this function with a drop-in settings before calling `start()`
     * @param dropInConfig Configuration object
     * @returns `AdyenDropIn` instance (`this`)
     */
    setDropInConfig(dropInConfig: DropInConfiguration): any;
    /**
     * ***Required*** Call this function to set additional settings for the RN module
     * @param moduleConfig Configuration object
     * @returns `AdyenDropIn` instance (`this`)
     */
    setModuleConfig(moduleConfig: ModuleConfig): any;
    /**
     * ***Optional*** Call this function to set payment response for the RN module
     * @param paymentResponse Payment response object
     * @returns `AdyenDropIn` instance (`this`)
     */
    setPaymentResponse(paymentResponse: any): any;
    /**
     * ***Optional*** Call this function to set details response for the RN module
     * @param detailsResponse Details response object
     * @returns `AdyenDropIn` instance (`this`)
     */
    setDetailsResponse(detailsResponse: any): any;
    /**
     * Call this function to show the drop-in and start the payment flow
     * @param paymentMethodsResponse Payment methods response object
     * @returns Promise that resolves with payment result if payment finished without errors
     */
    start(paymentMethodsResponse: PaymentMethodsResponse): PaymentPromise;
};
export default AdyenDropIn;
