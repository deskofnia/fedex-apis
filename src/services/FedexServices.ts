import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import { getFedexAccessToken } from "../utils/helper";

dotenv.config({ path: ".env" });

export async function rateAndTimeService(req: Request, res: Response) {
  try {
    const {
      accountNumber,
      countryCode,
      recipientPostalCode,
      shipperPostalCode,
    } = req.body;

    const input = {
      accountNumber: {
        value: accountNumber,
      },
      requestedShipment: {
        shipper: {
          address: {
            postalCode: shipperPostalCode,
            countryCode: countryCode,
          },
        },
        recipient: {
          address: {
            postalCode: recipientPostalCode,
            countryCode: countryCode,
          },
        },
        pickupType: "DROPOFF_AT_FEDEX_LOCATION",
        rateRequestType: ["ACCOUNT", "LIST"],
        requestedPackageLineItems: [
          {
            weight: {
              units: "LB",
              value: 10,
            },
          },
        ],
      },
    };

    const token = await getFedexAccessToken();

    const data = JSON.stringify(input);

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/rate/v1/rates/quotes",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "X-locale": "en_US",
          Authorization: `bearer ${token}`,
        },
      }
    );

    return res
      .status(200)
      .send({ success: true, message: "Data Fetched", data: response.data });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function trackApiService(req: Request, res: Response) {
  try {
    const input = req.body; // Assuming the JSON payload is sent in the request body
    const token = await getFedexAccessToken();

    const data = JSON.stringify(input);

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/track/v1/associatedshipments",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "X-locale": "en_US",
          Authorization: `bearer ${token}`,
        },
      }
    );

    return res
      .status(200)
      .send({ success: true, message: "Data Fetched", data: response.data });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function trackShipmentService(req: Request, res: Response) {
  try {
    const { trackingNumber } = req.body;
    const token = await getFedexAccessToken();

    const input = {
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber,
          },
        },
      ],
      includeDetailedScans: true,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/track/v1/trackingnumbers",
      input,
      config
    );

    const data = response.data.output.completeTrackResults[0].trackResults;
    const trackingLocationData = data[0].scanEvents;

    console.log("trackingLocationData", trackingLocationData);

    const responseZero = await axios.post(
      "https://apis-sandbox.fedex.com/location/v1/locations",
      {
        locationsSummaryRequestControlParameters: {
          distance: {
            units: "MI",
            value: 2,
          },
        },
        locationSearchCriterion: "ADDRESS",
        location: {
          address:
            trackingLocationData[trackingLocationData.length - 2].scanLocation,
        },
      },
      config
    );

    const latLong = [
      responseZero?.data?.output?.matchedAddressGeoCoord?.latitude,
      responseZero?.data?.output?.matchedAddressGeoCoord?.longitude,
    ];

    return res
      .status(200)
      .send({ success: true, message: "Data Fetched", data, latLong });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function trackNotificationsService(req: Request, res: Response) {
  try {
    const { trackingNumber, senderEMailAddress, senderContactName } = req.body;
    const token = await getFedexAccessToken();

    const input = {
      trackingNumberInfo: {
        trackingNumber: trackingNumber,
      },
      senderEMailAddress: senderEMailAddress,
      senderContactName: senderContactName,
      trackingEventNotificationDetail: {
        trackingNotifications: [
          {
            notificationEventTypes: [
              "ON_ESTIMATED_DELIVERY",
              "ON_TENDER",
              "ON_EXCEPTION",
              "ON_DELIVERY",
            ],
            notificationDetail: {
              notificationType: "HTML",
              emailDetail: {
                emailAddress: senderEMailAddress,
              },
              localization: {
                languageCode: "en",
                localeCode: "US",
              },
            },
          },
        ],
      },
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/track/v1/notifications",
      input,
      config
    );
    return res
      .status(200)
      .send({ success: true, message: "Data Fetched", data: response });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function createShipmentService(req: Request, res: Response) {
  try {
    const { accountNumber } = req.body;
    const token = await getFedexAccessToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const input = {
      labelResponseOptions: "URL_ONLY",
      requestedShipment: {
        shipper: {
          contact: {
            personName: "SHIPPER NAME",
            phoneNumber: 1234567890,
            companyName: "Shipper Company Name",
          },
          address: {
            streetLines: ["SHIPPER STREET LINE 1"],
            city: "HARRISON",
            stateOrProvinceCode: "AR",
            postalCode: 72601,
            countryCode: "US",
          },
        },
        recipients: [
          {
            contact: {
              personName: "RECIPIENT NAME",
              phoneNumber: 1234567890,
              companyName: "Recipient Company Name",
            },
            address: {
              streetLines: [
                "RECIPIENT STREET LINE 1",
                "RECIPIENT STREET LINE 2",
              ],
              city: "Collierville",
              stateOrProvinceCode: "TN",
              postalCode: 38017,
              countryCode: "US",
            },
          },
        ],
        shipDatestamp: "2023-10-10",
        serviceType: "STANDARD_OVERNIGHT",
        packagingType: "FEDEX_SMALL_BOX",
        pickupType: "USE_SCHEDULED_PICKUP",
        blockInsightVisibility: false,
        shippingChargesPayment: {
          paymentType: "SENDER",
        },
        shipmentSpecialServices: {
          specialServiceTypes: ["FEDEX_ONE_RATE"],
        },
        labelSpecification: {
          imageType: "PDF",
          labelStockType: "PAPER_85X11_TOP_HALF_LABEL",
        },
        requestedPackageLineItems: [{}],
      },
      accountNumber: {
        value: accountNumber,
      },
    };

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/ship/v1/shipments",
      input,
      config
    );

    console.log("Response================", response.data.output);

    return res.status(200).send({
      success: true,
      message: "Data Fetched",
      data: response.data.output,
    });
  } catch (error) {
    console.log("ERRRRRRRRRRRRRRRR", error);
    res.status(400).send({
      success: false,
      message: "An error occurred while making the request to FedEx API.",
    });
  }
}

export async function cancelShipmentService(req: Request, res: Response) {
  try {
    const token = await getFedexAccessToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const input = {
      accountNumber: {
        value: "740561073",
      },
      trackingNumber: "794842623031",
    };

    const response = await axios.post(
      "https://developer.fedex.com/api/en-in/catalog/ship/v1/ship/v1/shipments/cancel",
      input,
      config
    );

    return res
      .status(200)
      .send({ success: true, message: "Shipment Cancelled", data: response });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}
export async function retrieveShipmentService(req: Request, res: Response) {
  try {
    const token = await getFedexAccessToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const input = {
      accountNumber: {
        value: "8014xxxxx",
      },
      jobId: "89sxxxxx233ae24ff31xxxxx",
    };

    const response = await axios.post(
      "https://developer.fedex.com/api/en-us/catalog/ship/v1/ship/v1/shipments/results",
      input,
      config
    );

    return res.status(200).send({
      success: true,
      message: "Shipment Retrieved",
      data: response,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function validateShipmentService(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function createTagShipmentService(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}
export async function cancelTagShipmentService(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function validateAddressService(req: Request, res: Response) {
  try {
    const token = await getFedexAccessToken();

    const input = {
      addressesToValidate: [
        {
          address: {
            streetLines: ["7372 PARKRIDGE BLVD", "APT 286"],
            city: "IRVING",
            stateOrProvinceCode: "TX",
            postalCode: "75063-8659",
            countryCode: "US",
          },
        },
      ],
    };

    // const input = {
    //   addressesToValidate: [
    //     {
    //       address: {
    //         streetLines: ["P.O. Box 5000"],
    //         city: "Green",
    //         stateOrProvinceCode: "OH ",
    //         postalCode: "44232-5000",
    //         countryCode: "US",
    //       },
    //     },
    //   ],
    // };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/address/v1/addresses/resolve",
      input,
      config
    );
    // .then((data) => {
    //   console.log("DATATTTTTTTTT====>>>>", data.data.output);
    // })
    // .catch((error) => console.log("ERRRRRR", error));

    console.log(">>>>>>>>>>>>>>", response);

    return res.status(200).send({
      success: true,
      message: "Address validation data fetched",
      data: response.data.output,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}

export async function validatePostalCodeService(req: Request, res: Response) {
  try {
    const token = await getFedexAccessToken();

    const input = {
      carrierCode: "FDXE",
      countryCode: "US",
      stateOrProvinceCode: "TN",
      postalCode: "38017",
      shipDate: "2016-09-13",
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      "https://developer.fedex.com/api/en-in/catalog/address-validation/v1/address/v1/addresses/resolve",
      input,
      config
    );

    return res.status(200).send({
      success: true,
      message: "Postal code validation data fetched",
      data: response,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
}
