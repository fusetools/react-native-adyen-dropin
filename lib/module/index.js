import { NativeModules } from 'react-native';
export let RESULT_CODE;

(function (RESULT_CODE) {
  RESULT_CODE["cancelled"] = "cancelled";
  RESULT_CODE["refused"] = "refused";
  RESULT_CODE["error"] = "error";
  RESULT_CODE["received"] = "received";
})(RESULT_CODE || (RESULT_CODE = {}));

export const AdyenDropInModule = NativeModules.AdyenDropInModule;
export function isCancelledError(err) {
  if (err instanceof Error) {
    return err.message === 'Cancelled';
  }

  return err === 'Cancelled';
}
/**
 * Check if a payment result is considered successful
 * @param result Resolved payment promise result
 * @returns Whether or not the result is considered successful
 */

export function isSuccessResult(result) {
  var _result$resultCode$to, _result$resultCode;

  if (typeof result.resultCode === 'string') {
    switch ((_result$resultCode$to = (_result$resultCode = result.resultCode).toLowerCase) === null || _result$resultCode$to === void 0 ? void 0 : _result$resultCode$to.call(_result$resultCode)) {
      case RESULT_CODE.cancelled:
      case RESULT_CODE.refused:
      case RESULT_CODE.error:
        return false;

      default:
        return true;
    }
  }

  if (result.errorCode) return false;
  return false;
}

function trimStartingSlash(str) {
  if (str && str.charAt(0) === '/') {
    return str.substr(1);
  }

  return str !== null && str !== void 0 ? str : '';
}

function cleanModuleConfig(dirtyModuleConfig) {
  return { ...dirtyModuleConfig,
    ...(dirtyModuleConfig.endpoints ? {
      endpoints: {
        makePayment: trimStartingSlash(dirtyModuleConfig.endpoints.makePayment),
        makeDetailsCall: trimStartingSlash(dirtyModuleConfig.endpoints.makeDetailsCall)
      }
    } : {})
  };
}

function cleanPaymentMethodsResponse(dirtyPaymentMethodsResponse) {
  if (dirtyPaymentMethodsResponse.paymentMethods) {
    return dirtyPaymentMethodsResponse;
  }

  return {
    paymentMethods: dirtyPaymentMethodsResponse
  };
}

const AdyenDropIn = {
  /**
   * ***Required*** Call this function with a drop-in settings before calling `start()`
   * @param dropInConfig Configuration object
   * @returns `AdyenDropIn` instance (`this`)
   */
  setDropInConfig(dropInConfig) {
    AdyenDropInModule.setDropInConfig(dropInConfig);
    return this;
  },

  /**
   * ***Required*** Call this function to set additional settings for the RN module
   * @param moduleConfig Configuration object
   * @returns `AdyenDropIn` instance (`this`)
   */
  setModuleConfig(moduleConfig) {
    const cleanedModuleConfig = cleanModuleConfig(moduleConfig);
    AdyenDropInModule.setModuleConfig(cleanedModuleConfig);
    return this;
  },

  /**
   * Call this function to show the drop-in and start the payment flow
   * @param paymentMethodsResponse Payment methods response object
   * @returns Promise that resolves with payment result if payment finished without errors
   */
  start(paymentMethodsResponse) {
    return new Promise((resolve, reject) => {
      if (!paymentMethodsResponse) {
        return reject(new Error('Missing paymentMethodsResponse argument'));
      }

      const cleanedPaymentMethodsResponse = cleanPaymentMethodsResponse(paymentMethodsResponse);

      const resolveCallback = jsonStr => {
        try {
          const parsed = JSON.parse(jsonStr);
          return resolve(parsed);
        } catch {
          return reject(new Error('Failed to parse JSON from native resolve callback'));
        }
      };

      const rejectCallback = msgOrJsonStr => {
        if (msgOrJsonStr) {
          try {
            const parsed = JSON.parse(msgOrJsonStr);
            const parsedEntries = Object.entries(parsed);
            const hasOnlyMessage = parsedEntries.length === 1 && typeof parsed.message === 'string' && parsed.message.length > 0;

            if (hasOnlyMessage) {
              return reject(new Error(parsed.message));
            } else {
              var _ref;

              const {
                message
              } = parsed;
              const error = new Error((_ref = message !== null && message !== void 0 ? message : parsed.refusalReason) !== null && _ref !== void 0 ? _ref : 'Unknown error');
              parsedEntries.forEach(([key, value]) => {
                Object.defineProperty(error, key, {
                  value
                });
              });
              return reject(error);
            }
          } catch {}
        }

        return reject(new Error(msgOrJsonStr !== null && msgOrJsonStr !== void 0 ? msgOrJsonStr : 'Unknown error'));
      };

      try {
        AdyenDropInModule.start(cleanedPaymentMethodsResponse, resolveCallback, rejectCallback);
      } catch (err) {
        return reject(err);
      }
    });
  }

};
export default AdyenDropIn;
//# sourceMappingURL=index.js.map